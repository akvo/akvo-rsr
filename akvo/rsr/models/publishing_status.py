# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

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
            if not self.project.title:
                raise ValidationError(_('Projects need to have a title.'))

            if not self.project.subtitle:
                raise ValidationError(_('Projects need to have a subtitle.'))

            if not self.project.project_plan_summary:
                raise ValidationError(
                    _('Projects need to have the project plan summary filled in.')
                )

            if not self.project.sustainability:
                raise ValidationError(
                    _('Projects need to have the sustainability field filled in.')
                )

            if not self.project.goals_overview:
                raise ValidationError(
                    _('Projects need to have the goals overview field filled in.')
                )

            if not self.project.partners:
                raise ValidationError(_('Projects need to have at least one valid partner.'))
            elif not self.project.partnerships.filter(
                    partner_type__in=['field', 'funding', 'support']
            ).exists():
                raise ValidationError(
                    _('Projects need to have at least one field, funding or support partner.')
                )

            if not self.project.sync_owner:
                raise ValidationError(_('Projects need to have a reporting organisation.'))

            if not self.project.current_image:
                raise ValidationError(_('Projects need to have a photo.'))

            if not self.project.locations.all():
                raise ValidationError(_('Projects need to have at least one location.'))

            if not self.project.budget_items.all():
                raise ValidationError(_('Projects need to have at least one budget item.'))
            elif not self.project.budget_items.filter(amount__gt=0).exists():
                raise ValidationError(
                    _('Projects need to have at least one budget item with an amount.')
                )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'publishing status')
        verbose_name_plural = _(u'publishing statuses')
        ordering = ('-status', 'project')
