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
        (STATUS_UNPUBLISHED, _(u'Unpublished')),
        (STATUS_PUBLISHED, _(u'Published')),
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

            if not self.project.date_start_planned:
                validation_errors.append(
                    ValidationError(
                        _('Project needs to have the planned start date field filled in.'),
                        code='goals_overview')
                )

            if not self.project.partners:
                validation_errors.append(
                    ValidationError(_('Project needs to have at least one valid partner.'),
                                    code='partners')
                )
            elif not self.project.partnerships.filter(
                    partner_type__in=['field', 'funding', 'support']
            ).exists():
                validation_errors.append(
                    ValidationError(
                        _('Project needs to have at least one field, funding or support partner.'),
                        code='partners'
                    )
                )
            else:
                for funding_partner in self.project.partnerships.filter(
                        iati_organisation_role=Partnership.IATI_FUNDING_PARTNER):
                    if not funding_partner.funding_amount:
                        validation_errors.append(
                            ValidationError(_('All funding partners should have a funding amount.'),
                                            code='partners'
                            )
                        )
                        break

            if not self.project.sync_owner:
                validation_errors.append(
                    ValidationError(_('Project needs to have a reporting organisation.'),
                                    code='reporting_org')
                )

            if not self.project.current_image:
                validation_errors.append(
                    ValidationError(_('Project needs to have a photo.'),
                                    code='current_image')
                )

            if not self.project.locations.all():
                validation_errors.append(
                    ValidationError(_('Project needs to have at least one location.'),
                                    code='location')
                )
            else:
                for location in self.project.locations.all():
                    if not location.latitude or not location.longitude or not location.country:
                        validation_errors.append(
                            ValidationError(
                                _('All locations need to have a latitude, longitude and country '
                                  'specified.'),
                                code='location')
                        )
                        break

            if not self.project.budget_items.all():
                validation_errors.append(
                    ValidationError(_('Project needs to have at least one budget item.'),
                                    code='budget_item')
                )
            elif not self.project.budget_items.filter(amount__gt=0).exists():
                validation_errors.append(
                    ValidationError(
                        _('Project needs to have at least one budget item with an amount.'),
                        code='budget_item'
                    )
                )

            if not self.project.sectors.all():
                validation_errors.append(
                    ValidationError(_('Project needs to have at least one sector.'),
                                    code='sector')
                )
            else:
                for sector in self.project.sectors.all():
                    if not sector.sector_code:
                        validation_errors.append(
                            ValidationError(_('All sectors need to have a sector code.'),
                                            code='sector')
                        )
                        break

            if validation_errors:
                raise ValidationError(validation_errors)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'publishing status')
        verbose_name_plural = _(u'publishing statuses')
        ordering = ('-status', 'project')
