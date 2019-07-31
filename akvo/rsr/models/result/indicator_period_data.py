# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal, InvalidOperation

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from sorl.thumbnail.fields import ImageField

from .utils import (calculate_percentage, file_path, image_path,
                    MultipleUpdateError, PERCENTAGE_MEASURE, QUALITATIVE,
                    QUANTITATIVE)
from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin, IndicatorUpdateMixin


class IndicatorPeriodData(TimestampsMixin, IndicatorUpdateMixin, models.Model):
    """
    Model for adding data to an indicator period.
    """

    project_relation = 'results__indicators__periods__data__in'

    STATUS_DRAFT = unicode(_(u'draft'))
    STATUS_PENDING = unicode(_(u'pending approval'))
    STATUS_REVISION = unicode(_(u'return for revision'))
    STATUS_APPROVED = unicode(_(u'approved'))

    STATUS_DRAFT_CODE = u'D'
    STATUS_PENDING_CODE = u'P'
    STATUS_REVISION_CODE = u'R'
    STATUS_APPROVED_CODE = u'A'

    STATUS_CODES_LIST = [STATUS_DRAFT_CODE, STATUS_PENDING_CODE,
                         STATUS_REVISION_CODE, STATUS_APPROVED_CODE]
    STATUSES_LABELS_LIST = [STATUS_DRAFT, STATUS_PENDING, STATUS_REVISION,
                            STATUS_APPROVED]
    STATUSES = zip(STATUS_CODES_LIST, STATUSES_LABELS_LIST)

    UPDATE_METHODS = (
        ('W', _(u'web')),
        ('M', _(u'mobile')),
    )

    period = models.ForeignKey('IndicatorPeriod', verbose_name=_(u'indicator period'),
                               related_name='data', on_delete=models.PROTECT)
    # TODO: rename to created_by when old results framework page is no longer in use
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_(u'user'), db_index=True,
                             related_name='created_period_updates')
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name=_(u'approved by'), db_index=True,
        related_name='approved_period_updates', blank=True, null=True,
    )
    narrative = ValidXMLTextField(_(u'qualitative indicator narrative'), blank=True)
    period_actual_value = ValidXMLCharField(_(u'period actual value'), max_length=50, default='')
    status = ValidXMLCharField(_(u'status'), max_length=1, choices=STATUSES, db_index=True,
                               default=STATUS_DRAFT_CODE)
    text = ValidXMLTextField(_(u'text'), blank=True)
    photo = ImageField(_(u'photo'), blank=True, upload_to=image_path, max_length=255)
    file = models.FileField(_(u'file'), blank=True, upload_to=file_path, max_length=255)
    update_method = ValidXMLCharField(_(u'update method'), blank=True, max_length=1,
                                      choices=UPDATE_METHODS, db_index=True, default='W')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period data')
        verbose_name_plural = _(u'indicator period data')
        ordering = ('-id', )

    def save(self, recalculate=True, *args, **kwargs):
        # Allow only a single update for percentage measure indicators
        if not self.period.can_save_update(self.id):
            raise MultipleUpdateError('Cannot create multiple updates with percentages')

        if (
                self.period.indicator.measure == PERCENTAGE_MEASURE and
                self.numerator is not None and
                self.denominator not in {0, '0', None}
        ):
            self.value = calculate_percentage(self.numerator, self.denominator)

        super(IndicatorPeriodData, self).save(*args, **kwargs)

        # In case the status is approved, recalculate the period
        if recalculate and self.status == self.STATUS_APPROVED_CODE:
            self.period.recalculate_period()
            self.period.update_actual_comment()

    def delete(self, *args, **kwargs):
        old_status = self.status

        super(IndicatorPeriodData, self).delete(*args, **kwargs)

        # In case the status was approved, recalculate the period
        if old_status == self.STATUS_APPROVED_CODE:
            self.period.recalculate_period()
            self.period.update_actual_comment()

    def clean(self):
        """
        Perform several checks before we can actually save the update data.
        """
        validation_errors = {}

        project = self.period.indicator.result.project

        # Don't allow a data update to an unpublished project
        if not project.is_published():
            validation_errors['period'] = unicode(_(u'Indicator period must be part of a published '
                                                    u'project to add data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to a non-Impact project
        if not project.is_impact_project:
            validation_errors['period'] = unicode(_(u'Indicator period must be part of an RSR '
                                                    u'Impact project to add data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to a locked period
        if self.period.locked:
            validation_errors['period'] = unicode(_(u'Indicator period must be unlocked to add '
                                                    u'data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to an aggregated parent period with 'percentage' as measurement
        if self.period.indicator.children_aggregate_percentage:
            validation_errors['period'] = unicode(
                _(u'Indicator period has an average aggregate of the child projects. Disable '
                  u'aggregations to add data to it'))
            raise ValidationError(validation_errors)

        if self.pk:
            orig = IndicatorPeriodData.objects.get(pk=self.pk)

            # Don't allow for the indicator period to change
            if orig.period != self.period:
                validation_errors['period'] = unicode(_(u'Not allowed to change indicator period '
                                                        u'in a data update'))

        if self.period.indicator.type == QUANTITATIVE:
            if self.narrative is not None:
                validation_errors['period'] = unicode(
                    _(u'Narrative field should be empty in quantitative indicators'))
            if self.value is not None:
                try:
                    self.value = Decimal(self.value)
                except:
                    validation_errors['period'] = unicode(
                        _(u'Only numeric values are allowed in quantitative indicators'))

        if self.period.indicator.type == QUALITATIVE:
            if self.value is not None:
                validation_errors['period'] = unicode(
                    _(u'Value field should be empty in qualitative indicators'))

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
            return u''

    @property
    def photo_url(self):
        """
        Returns the full URL of the photo.
        """
        return self.photo.url if self.photo else u''

    @property
    def file_url(self):
        """
        Returns the full URL of the file.
        """
        return self.file.url if self.file else u''

    def update_new_value(self):
        """Returns a string with the new value."""
        try:
            add_up = Decimal(self.value) + Decimal(self.period_actual_value)
            relative = '+' + str(self.value) if self.value >= 0 else str(self.value)
            return "{} ({})".format(str(add_up), relative)
        except (InvalidOperation, TypeError):
            return self.value

    @classmethod
    def get_user_viewable_updates(cls, queryset, user):
        approved_updates = queryset.filter(status=cls.STATUS_APPROVED_CODE)

        if user.is_anonymous():
            f_queryset = approved_updates

        elif user.is_admin or user.is_superuser:
            f_queryset = queryset

        else:
            own_updates = queryset.filter(user=user)
            non_draft_updates = queryset.exclude(status=cls.STATUS_DRAFT_CODE)
            filter_ = user.get_permission_filter(
                'rsr.view_indicatorperioddata',
                'period__indicator__result__project__'
            )
            f_queryset = (
                approved_updates |
                own_updates |
                non_draft_updates.filter(filter_)
            )

        return f_queryset.distinct()


@receiver(post_save, sender=IndicatorPeriodData)
def set_qualitative_narrative(sender, **kwargs):
    """Update the narrative field of a qualitative indicator on updates."""

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
