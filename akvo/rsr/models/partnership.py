# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import logging
from typing import Type

from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.apps import apps
from django.db import models
from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

logger = logging.getLogger(__name__)


class Partnership(models.Model):
    # the old way
    FIELD_PARTNER = 'field'
    FUNDING_PARTNER = 'funding'
    SPONSOR_PARTNER = 'sponsor'
    SUPPORT_PARTNER = 'support'
    EXTENDING_PARTNER = 'extending'

    PARTNER_TYPE_LIST = [
        FIELD_PARTNER, FUNDING_PARTNER, SPONSOR_PARTNER, SUPPORT_PARTNER, EXTENDING_PARTNER
    ]
    PARTNER_LABELS = [
        _('Implementing partner'),
        _('Funding partner'),
        _('Sponsor partner'),
        _('Accountable partner'),
        _('Extending partner'),
    ]
    PARTNER_TYPES = list(zip(PARTNER_TYPE_LIST, PARTNER_LABELS))

    # the new way
    IATI_FUNDING_PARTNER = 1
    IATI_ACCOUNTABLE_PARTNER = 2
    IATI_EXTENDING_PARTNER = 3
    IATI_IMPLEMENTING_PARTNER = 4
    AKVO_SPONSOR_PARTNER = 100   # not part of the IATI OrganisationRole codelist!
    IATI_REPORTING_ORGANISATION = 101

    # make sure the AKVO_SPONSOR_PARTNER is last in the list
    IATI_ROLE_LIST = [
        IATI_FUNDING_PARTNER, IATI_ACCOUNTABLE_PARTNER, IATI_EXTENDING_PARTNER,
        IATI_IMPLEMENTING_PARTNER, AKVO_SPONSOR_PARTNER, IATI_REPORTING_ORGANISATION
    ]
    IATI_ROLE_LABELS = [
        _('Funding partner'),
        _('Accountable partner'),
        _('Extending partner'),
        _('Implementing partner'),
        _('Sponsor partner'),
        _('Reporting organisation'),
    ]
    IATI_ROLES = list(zip(IATI_ROLE_LIST, IATI_ROLE_LABELS))

    # used when migrating
    PARTNER_TYPES_TO_ROLES_MAP = {
        FUNDING_PARTNER: IATI_FUNDING_PARTNER,
        SUPPORT_PARTNER: IATI_ACCOUNTABLE_PARTNER,
        FIELD_PARTNER: IATI_IMPLEMENTING_PARTNER,
        SPONSOR_PARTNER: AKVO_SPONSOR_PARTNER,
    }

    # backwards compatibility
    ROLES_TO_PARTNER_TYPES_MAP = {
        IATI_FUNDING_PARTNER: FUNDING_PARTNER,
        IATI_ACCOUNTABLE_PARTNER: SUPPORT_PARTNER,
        IATI_EXTENDING_PARTNER: EXTENDING_PARTNER,
        IATI_IMPLEMENTING_PARTNER: FIELD_PARTNER,
        AKVO_SPONSOR_PARTNER: SPONSOR_PARTNER,
        # TODO: not backwards compatible
        IATI_REPORTING_ORGANISATION: ''
    }

    ALLIANCE_PARTNER = 'alliance'
    KNOWLEDGE_PARTNER = 'knowledge'
    NETWORK_PARTNER = 'network'

    PARTNER_TYPE_EXTRAS_LIST = (ALLIANCE_PARTNER, KNOWLEDGE_PARTNER, NETWORK_PARTNER)
    PARTNER_TYPE_EXTRA_LABELS = (
        _('Alliance'),
        _('Knowledge'),
        _('Network')
    )

    PARTNER_TYPE_EXTRAS = list(zip(PARTNER_TYPE_EXTRAS_LIST, PARTNER_TYPE_EXTRA_LABELS))

    organisation = models.ForeignKey(
        'Organisation', on_delete=models.CASCADE, verbose_name=_('organisation'), related_name='partnerships', null=True,
        blank=True,
        help_text=_('Select an organisation that is taking an active role in the project.')
    )
    project = models.ForeignKey('Project', on_delete=models.CASCADE, verbose_name=_('project'), related_name='partnerships')
    iati_organisation_role = models.PositiveSmallIntegerField(
        _('organisation role'), choices=IATI_ROLES, db_index=True, null=True, blank=True,
        help_text=_('Select the role of the organisation within the project:<br/>'
                    '- Funding organisation: a government or organisation that provides funds to '
                    'the project<br/>'
                    '- Implementing organisation: an organisation involved in carrying out the '
                    'activity or intervention<br/>'
                    '- Accountable organisation: an organisation responsible for oversight of '
                    'the project and its outcomes<br/>'
                    '- Extending organisation: an organisation that manages the budget and '
                    'direction of a project on behalf of the funding organisation<br/>'
                    '- Reporting organisation: an organisation that will report this project in '
                    'an IATI file')
    )
    # is_secondary_reporter is only used when the iati_organisation_role is set to
    # IATI_REPORTING_ORGANISATION, thus the use of NullBooleanField
    is_secondary_reporter = models.BooleanField(
        _('secondary reporter'),
        null=True,
        help_text=_(
            'This indicates whether the reporting organisation is a secondary publisher: '
            'publishing data for which it is not directly responsible.'
        )
    )
    funding_amount = models.DecimalField(
        _('funding amount'), max_digits=14, decimal_places=2, blank=True, null=True, db_index=True,
        help_text=_('It’s only possible to indicate a funding amount for funding partners. Use a '
                    'period to denote decimals.')
    )
    partner_type_extra = ValidXMLCharField(
        _('partner type extra'), max_length=30, blank=True, null=True, choices=PARTNER_TYPE_EXTRAS,
        help_text=_('RSR specific partner type.')
    )
    iati_activity_id = ValidXMLCharField(
        _('IATI activity ID'), max_length=100, blank=True, null=True, db_index=True,
        help_text=_('A valid activity identifier published by the participating organisation '
                    'which points to the activity that it has published to IATI that describes '
                    'its role in this activity.')
    )
    internal_id = ValidXMLCharField(
        _('Internal ID'), max_length=75, blank=True, null=True, db_index=True,
        help_text=_('This field can be used to indicate an internal identifier that is used by '
                    'the organisation for this project. (75 characters)')
    )
    iati_url = models.URLField(
        blank=True,
        help_text=_(
            'Please enter the URL for where the IATI Activity Id Funding details are published. '
            'For projects directly or indirectly funded by the Dutch Government, this should '
            'be the OpenAid.nl page. For other projects, an alternative URL can be used.'
        )
    )
    related_activity_id = ValidXMLCharField(
        _('related IATI activity ID'), max_length=100, blank=True
    )

    def iati_organisation_role_label(self):
        return dict(self.IATI_ROLES).get(self.iati_organisation_role, '')

    def iati_organisation_role_label_unicode(self):
        return "{}".format(self.iati_organisation_role_label())

    def iati_role_to_partner_type(self):
        return dict(self.ROLES_TO_PARTNER_TYPES_MAP).get(self.iati_organisation_role, '')

    def iati_role_to_partner_type_unicode(self):
        return "{}".format(self.iati_role_to_partner_type())

    def organisation_show_link(self):
        if self.organisation:
            return '<a href="{0}">{1}</a>'.format(self.organisation.get_absolute_url(),
                                                  self.organisation.long_name
                                                  or self.organisation.name)
        return ''

    def funding_amount_with_currency(self):
        """Returns the funding amount, prepended by the project's currency."""
        if self.funding_amount and self.project and self.project.currency:
            return '{0} {1}'.format(self.project.currency, self.funding_amount)
        return self.funding_amount

    class Meta:
        app_label = 'rsr'
        verbose_name = _('project partner')
        verbose_name_plural = _('project partners')
        ordering = ['iati_organisation_role']

    def __str__(self):
        if self.organisation:
            if self.organisation.name:
                organisation_unicode = self.organisation.name
            elif self.organisation.long_name:
                organisation_unicode = self.organisation.long_name
            else:
                organisation_unicode = '%s' % _('Organisation name not specified')
        else:
            organisation_unicode = '%s' % _('Organisation not specified')

        if self.iati_organisation_role:
            organisation_unicode += ' ({})'.format(
                str(dict(self.IATI_ROLES)[self.iati_organisation_role])
            )
        return organisation_unicode

    def clean(self):
        # Don't allow multiple reporting organisations
        Project = apps.get_model('rsr', 'project')
        try:
            project = Project.objects.get(id=self.project_id)
        except Project.DoesNotExist:
            return
        if self.iati_organisation_role == self.IATI_REPORTING_ORGANISATION:
            reporting_orgs = project.partnerships.filter(
                iati_organisation_role=self.IATI_REPORTING_ORGANISATION
            )

            if reporting_orgs.count() > 1:
                raise ValidationError(
                    {'iati_organisation_role': '%s' % _('Project can only have one reporting '
                                                        'organisation')}
                )

    def save(self, *args, **kwargs):
        super(Partnership, self).save(*args, **kwargs)
        self.set_primary_organisation()
        self.project.update_use_project_roles()

    def delete(self, *args, **kwargs):
        super(Partnership, self).delete(*args, **kwargs)
        self.set_primary_organisation()

    def set_primary_organisation(self):
        # Check which organisation should be set to the primary organisation of the project
        # This is done to get better performance on the project list page
        Project = apps.get_model('rsr', 'project')
        project = Project.objects.get(id=self.project_id)
        project.primary_organisation = project.find_primary_organisation()
        project.save(update_fields=['primary_organisation'])


@receiver([pre_delete, pre_save], sender=Partnership)
def invalidate_caches(sender: Type[Partnership], instance: Partnership = None, **kwargs):
    """Ensure related cache keys are removed to prevent access to old data"""

    if instance is None:
        return
    from akvo.rest.viewsets import make_projects_filter_cache_prefix

    if instance.id is None:
        return

    # Handle cache of akvo.rest.viewsets.PublicProjectViewSet.projects_filter_for_non_privileged_users
    organisation = instance.organisation
    # We might be deleting or replacing an org from the partnership
    if organisation is None:
        # Get the original org
        partnership = Partnership.objects.filter(id=instance.id).first()
        organisation = partnership.organisation

    # There really is no org, let's bail
    if organisation is None:
        return
    try:
        # Delete the keys of of all users employed by the org
        keys = []
        for user in instance.organisation.users.all():
            user_key = make_projects_filter_cache_prefix(user)
            keys.extend(cache.keys(f"{user_key}*"))
        if keys:
            logger.info("Deleting project_filter keys: %s", len(keys))
            cache.delete_many(keys)
    except Exception as exc:
        logger.warning("Cannot invalidate cache: %s", exc)
