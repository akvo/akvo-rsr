# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from .partnership import Partnership

from ..fields import ValidXMLCharField


class PublishingStatus(models.Model):
    """Keep track of publishing status."""
    STATUS_PUBLISHED = 'published'
    STATUS_UNPUBLISHED = 'unpublished'
    PUBLISHING_STATUS = (
        (STATUS_UNPUBLISHED, _('Unpublished')),
        (STATUS_PUBLISHED, _('Published')),
    )

    project = models.OneToOneField('Project',)
    status = ValidXMLCharField(max_length=30,
                               choices=PUBLISHING_STATUS,
                               db_index=True, default=STATUS_UNPUBLISHED)

    def clean(self):
        """Projects can only be published, when several checks have been performed."""
        if self.status == 'published':
            validation_errors = []

            if not self.project.title:
                validation_errors.append(
                    ValidationError(_('Project needs to have a title.'),
                                    code='title')
                )

            if not self.project.subtitle:
                validation_errors.append(
                    ValidationError(_('Project needs to have a subtitle.'),
                                    code='subtitle')
                )

            if self.project.iati_status == '6':
                validation_errors.append(
                    ValidationError(_('Project needs to have non-suspended status.'),
                                    code='status')
                )

            if not (self.project.date_start_planned or self.project.date_start_actual):
                validation_errors.append(
                    ValidationError(
                        _('Project needs to have the planned or actual start date field filled '
                          'in.'), code='start_date')
                )

            if not self.project.current_image:
                validation_errors.append(
                    ValidationError(_('Project needs to have a photo.'),
                                    code='current_image')
                )

            if not self.project.partnerships.filter(
                    organisation__can_create_projects__exact=True).exists():
                validation_errors.append(
                    ValidationError(
                        _('Project has no partner that is allowed to publish it.'),
                        code='partners'
                    )
                )

            if not self.project.partnerships.filter(
                    iati_organisation_role__in=[Partnership.IATI_FUNDING_PARTNER,
                                                Partnership.IATI_IMPLEMENTING_PARTNER,
                                                Partnership.IATI_ACCOUNTABLE_PARTNER]
            ).exists():
                validation_errors.append(
                    ValidationError(
                        _('Project needs to have at least one funding, implementing or accountable '
                          'partner.'),
                        code='partners'
                    )
                )
            else:
                for funding_partner in self.project.partnerships.filter(
                        iati_organisation_role=Partnership.IATI_FUNDING_PARTNER):
                    if not funding_partner.funding_amount and not funding_partner.funding_amount == 0:
                        validation_errors.append(
                            ValidationError(_('All funding partners should have a funding amount.'),
                                            code='partners'
                                            )
                        )
                        break

            if not self.project.project_plan_summary:
                validation_errors.append(
                    ValidationError(_('Project needs to have the project plan summary filled in.'),
                                    code='summary')
                )

            if not self.project.goals_overview:
                validation_errors.append(
                    ValidationError(_('Project needs to have the goals overview field filled in.'),
                                    code='goals_overview')
                )

            if not self.project.locations.all():
                validation_errors.append(
                    ValidationError(_('Project needs to have at least one location.'),
                                    code='location')
                )
            else:
                for location in self.project.locations.all():
                    if not (location.latitude and location.longitude):
                        validation_errors.append(
                            ValidationError(
                                _('All locations need to have a latitude and longitude specified.'),
                                code='location')
                        )
                        break

            if not self.project.budget_items.all():
                validation_errors.append(
                    ValidationError(_('Project needs to have at least one budget item.'),
                                    code='budget_item')
                )
            elif not self.project.budget_items.filter(amount__gte=0).exists():
                validation_errors.append(
                    ValidationError(
                        _('Project needs to have at least one budget item with an amount.'),
                        code='budget_item'
                    )
                )

            if validation_errors:
                raise ValidationError(validation_errors)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('publishing status')
        verbose_name_plural = _('publishing statuses')
        ordering = ('-status', 'project')
