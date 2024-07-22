# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from sorl.thumbnail.fields import ImageField

from .utils import (calculate_percentage, file_path, image_path,
                    MultipleUpdateError, PERCENTAGE_MEASURE, QUALITATIVE,
                    QUANTITATIVE)
from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin, IndicatorUpdateMixin
from akvo.rsr.usecases.jobs.aggregation import schedule_aggregation_jobs
from akvo.utils import rsr_image_path


class IndicatorPeriodData(TimestampsMixin, IndicatorUpdateMixin, models.Model):
    """
    Model for adding data to an indicator period.
    """

    project_relation = 'results__indicators__periods__data__in'

    STATUS_DRAFT = str(_('draft'))
    STATUS_PENDING = str(_('pending approval'))
    STATUS_REVISION = str(_('return for revision'))
    STATUS_APPROVED = str(_('approved'))

    STATUS_DRAFT_CODE = 'D'
    STATUS_PENDING_CODE = 'P'
    STATUS_REVISION_CODE = 'R'
    STATUS_APPROVED_CODE = 'A'

    STATUS_CODES_LIST = [STATUS_DRAFT_CODE, STATUS_PENDING_CODE,
                         STATUS_REVISION_CODE, STATUS_APPROVED_CODE]
    STATUSES_LABELS_LIST = [STATUS_DRAFT, STATUS_PENDING, STATUS_REVISION,
                            STATUS_APPROVED]
    STATUSES = list(zip(STATUS_CODES_LIST, STATUSES_LABELS_LIST))

    UPDATE_METHODS = (
        ('W', _('web')),
        ('M', _('mobile')),
    )

    period = models.ForeignKey('IndicatorPeriod', verbose_name=_('indicator period'),
                               related_name='data', on_delete=models.PROTECT)
    # TODO: rename to created_by when old results framework page is no longer in use
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             verbose_name=_('user'),
                             db_index=True,
                             related_name='created_period_updates')
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        verbose_name=_('approved by'), db_index=True,
        related_name='approved_period_updates', blank=True, null=True,
    )
    narrative = ValidXMLTextField(_('qualitative indicator narrative'), blank=True)
    score_index = models.SmallIntegerField(_('score index'), null=True, blank=True)
    score_indices = ArrayField(models.SmallIntegerField(), default=list, blank=True)
    status = ValidXMLCharField(_('status'), max_length=1, choices=STATUSES, db_index=True,
                               default=STATUS_DRAFT_CODE)
    text = ValidXMLTextField(_('text'), blank=True)
    review_note = ValidXMLTextField(_('text'), blank=True)
    photo = ImageField(_('photo'), blank=True, upload_to=image_path, max_length=255)
    file = models.FileField(_('file'), blank=True, upload_to=file_path, max_length=255)
    update_method = ValidXMLCharField(_('update method'), blank=True, max_length=1,
                                      choices=UPDATE_METHODS, db_index=True, default='W')

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator period data')
        verbose_name_plural = _('indicator period data')
        ordering = ('-id', )

    def save(self, recalculate=True, *args, **kwargs):
        # Allow only a single update for percentage measure indicators
        if not self.period.can_save_update(self.id):
            raise MultipleUpdateError('Cannot create multiple updates with percentages')

        if (
                self.period.indicator.measure == PERCENTAGE_MEASURE
                and self.numerator is not None
                and self.denominator not in {0, '0', None}
        ):
            self.value = calculate_percentage(self.numerator, self.denominator)

        super(IndicatorPeriodData, self).save(*args, **kwargs)

        # In case the status is approved, recalculate the period
        if recalculate and self.status == self.STATUS_APPROVED_CODE:
            # FIXME: Should we call this even when status is not approved?
            schedule_aggregation_jobs(self.period)
            self.period.update_actual_comment()
        # Update score even when the update is not approved, yet. It handles the
        # case where an approved update is returned for revision, etc.
        self.period.update_score()

    def delete(self, *args, **kwargs):
        old_status = self.status
        period = self.period

        super(IndicatorPeriodData, self).delete(*args, **kwargs)

        # In case the status was approved, recalculate the period
        if old_status == self.STATUS_APPROVED_CODE:
            schedule_aggregation_jobs(period)
            self.period.update_actual_comment()
            self.period.update_score()

    def clean(self):
        """
        Perform several checks before we can actually save the update data.
        """
        validation_errors = {}

        project = self.period.indicator.result.project

        # Don't allow a data update to an unpublished project
        if not project.is_published():
            validation_errors['period'] = str(_('Indicator period must be part of a published '
                                                'project to add data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to a non-Impact project
        if not project.is_impact_project:
            validation_errors['period'] = str(_('Indicator period must be part of an RSR '
                                                'Impact project to add data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to a locked period
        if self.period.locked:
            validation_errors['period'] = str(_('Indicator period must be unlocked to add '
                                                'data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to an aggregated parent period with 'percentage' as measurement
        if self.period.indicator.children_aggregate_percentage:
            validation_errors['period'] = str(
                _('Indicator period has an average aggregate of the child projects. Disable '
                  'aggregations to add data to it'))
            raise ValidationError(validation_errors)

        if self.pk:
            orig = IndicatorPeriodData.objects.get(pk=self.pk)

            # Don't allow for the indicator period to change
            if orig.period != self.period:
                validation_errors['period'] = str(_('Not allowed to change indicator period '
                                                    'in a data update'))

        if self.period.indicator.type == QUANTITATIVE:
            if self.narrative is not None:
                validation_errors['period'] = str(
                    _('Narrative field should be empty in quantitative indicators'))
            if self.value is not None:
                try:
                    self.value = Decimal(self.value)
                except Exception:
                    validation_errors['period'] = str(
                        _('Only numeric values are allowed in quantitative indicators'))

        if self.period.indicator.type == QUALITATIVE:
            if self.value is not None:
                validation_errors['period'] = str(
                    _('Value field should be empty in qualitative indicators'))

        if validation_errors:
            raise ValidationError(validation_errors)

    @property
    def status_display(self):
        """
        Returns the display of the status.
        """
        try:
            return dict(self.STATUSES)[self.status].capitalize()
        except KeyError:
            return ''

    @property
    def photo_url(self):
        """
        Returns the full URL of the photo.
        """
        return self.photo.url if self.photo else ''

    @property
    def file_url(self):
        """
        Returns the full URL of the file.
        """
        return self.file.url if self.file else ''

    @classmethod
    def get_user_viewable_updates(cls, queryset, user):
        approved_updates = queryset.filter(status=cls.STATUS_APPROVED_CODE)

        if user.is_anonymous:
            f_queryset = approved_updates

        elif user.is_admin or user.is_superuser:
            f_queryset = queryset

        else:
            from akvo.rsr.models import Project
            projects = Project.objects\
                              .filter(results__indicators__periods__data__in=queryset)\
                              .distinct()
            project = projects.first() if projects.count() == 1 else None

            # Allow Nuffic users to see all updates, irrespective of what state they are in
            if project is not None and project.in_nuffic_hierarchy() and user.has_perm('rsr.view_project', project):
                f_queryset = queryset

            else:
                own_updates = queryset.filter(user=user)
                non_draft_updates = queryset.exclude(status=cls.STATUS_DRAFT_CODE)
                filter_ = user.get_permission_filter(
                    'rsr.view_indicatorperioddata',
                    'period__indicator__result__project__'
                )
                others_updates = non_draft_updates.filter(filter_)
                f_queryset = (
                    approved_updates
                    | own_updates
                    | others_updates
                )

        return f_queryset.distinct()


def update_image_path(instance, file_name):
    path = 'db/indicator_period_data/%d/data_photo/%%(instance_pk)s/%%(file_name)s' % instance.update.pk
    return rsr_image_path(instance, file_name, path)


class IndicatorPeriodDataPhoto(models.Model):
    update = models.ForeignKey('IndicatorPeriodData', on_delete=models.CASCADE)
    photo = ImageField(_('photo'), upload_to=update_image_path, max_length=255)

    class Meta:
        app_label = 'rsr'


def update_file_path(instance, file_name):
    path = 'db/indicator_period_data/%d/data_file/%%(instance_pk)s/%%(file_name)s' % instance.update.pk
    return rsr_image_path(instance, file_name, path)


class IndicatorPeriodDataFile(models.Model):
    update = models.ForeignKey('IndicatorPeriodData', on_delete=models.CASCADE)
    file = models.FileField(_('file'), upload_to=update_file_path, max_length=255)

    class Meta:
        app_label = 'rsr'


@receiver(post_save, sender=IndicatorPeriodData)
def set_qualitative_narrative(sender, **kwargs):
    """Update the narrative field of a qualitative indicator on updates."""

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    update = kwargs['instance']
    if update.status != IndicatorPeriodData.STATUS_APPROVED_CODE:
        return

    if update.period.indicator.type != QUALITATIVE:
        return

    # Current update is the latest update?
    if update.period.approved_updates.last().id != update.id:
        return

    update.period.narrative = update.narrative
    update.period.save()


@receiver(post_save, sender=IndicatorPeriodData)
def _send_return_for_revision_email(sender, **kwargs):
    """Send email to assigned enumerator when indicator is returned for revision."""

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    update = kwargs['instance']
    if update.status != IndicatorPeriodData.STATUS_REVISION_CODE:
        return

    from akvo.rest.views.project_enumerators import send_return_for_revision_email
    send_return_for_revision_email(update)
