# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class Partnership(models.Model):
    # the old way
    FIELD_PARTNER = u'field'
    FUNDING_PARTNER = u'funding'
    SPONSOR_PARTNER = u'sponsor'
    SUPPORT_PARTNER = u'support'
    EXTENDING_PARTNER = u'extending'

    PARTNER_TYPE_LIST = [
        FIELD_PARTNER, FUNDING_PARTNER, SPONSOR_PARTNER, SUPPORT_PARTNER, EXTENDING_PARTNER
    ]
    PARTNER_LABELS = [
        _(u'Implementing partner'),
        _(u'Funding partner'),
        _(u'Sponsor partner'),
        _(u'Accountable partner'),
        _(u'Extending partner'),
    ]
    PARTNER_TYPES = zip(PARTNER_TYPE_LIST, PARTNER_LABELS)

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
        _(u'Funding partner'),
        _(u'Accountable partner'),
        _(u'Extending partner'),
        _(u'Implementing partner'),
        _(u'Sponsor partner'),
        _(u'Reporting organisation'),
    ]
    IATI_ROLES = zip(IATI_ROLE_LIST, IATI_ROLE_LABELS)

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
        IATI_REPORTING_ORGANISATION: u''
    }

    ALLIANCE_PARTNER = u'alliance'
    KNOWLEDGE_PARTNER = u'knowledge'
    NETWORK_PARTNER = u'network'

    PARTNER_TYPE_EXTRAS_LIST = (ALLIANCE_PARTNER, KNOWLEDGE_PARTNER, NETWORK_PARTNER)
    PARTNER_TYPE_EXTRA_LABELS = (
        _(u'Alliance'),
        _(u'Knowledge'),
        _(u'Network')
    )

    PARTNER_TYPE_EXTRAS = zip(PARTNER_TYPE_EXTRAS_LIST, PARTNER_TYPE_EXTRA_LABELS)

    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'), related_name='partnerships', null=True,
        blank=True,
        help_text=_(u'Select an organisation that is taking an active role in the project.')
    )
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='partnerships')
    iati_organisation_role = models.PositiveSmallIntegerField(
        _(u'organisation role'), choices=IATI_ROLES, db_index=True, null=True, blank=True,
        help_text=_(u'Select the role of the organisation within the project:<br/>'
                    u'- Funding organisation: a government or organisation that provides funds to '
                    u'the project<br/>'
                    u'- Implementing organisation: an organisation involved in carrying out the '
                    u'activity or intervention<br/>'
                    u'- Accountable organisation: an organisation responsible for oversight of '
                    u'the project and its outcomes<br/>'
                    u'- Extending organisation: an organisation that manages the budget and '
                    u'direction of a project on behalf of the funding organisation<br/>'
                    u'- Reporting organisation: an organisation that will report this project in '
                    u'an IATI file')
    )
    # is_secondary_reporter is only used when the iati_organisation_role is set to
    # IATI_REPORTING_ORGANISATION, thus the use of NullBooleanField
    is_secondary_reporter = models.NullBooleanField(
        _(u'secondary reporter'),
        help_text=_(
            u'This indicates whether the reporting organisation is a secondary publisher: '
            u'publishing data for which it is not directly responsible.'
        )
    )
    funding_amount = models.DecimalField(
        _(u'funding amount'), max_digits=14, decimal_places=2, blank=True, null=True, db_index=True,
        help_text=_(u'It’s only possible to indicate a funding amount for funding partners. Use a '
                    u'period to denote decimals.')
    )
    partner_type_extra = ValidXMLCharField(
        _(u'partner type extra'), max_length=30, blank=True, null=True, choices=PARTNER_TYPE_EXTRAS,
        help_text=_(u'RSR specific partner type.')
    )
    iati_activity_id = ValidXMLCharField(
        _(u'IATI activity ID'), max_length=100, blank=True, null=True, db_index=True,
        help_text=_(u'A valid activity identifier published by the participating organisation '
                    u'which points to the activity that it has published to IATI that describes '
                    u'its role in this activity.')
    )
    internal_id = ValidXMLCharField(
        _(u'Internal ID'), max_length=75, blank=True, null=True, db_index=True,
        help_text=_(u'This field can be used to indicate an internal identifier that is used by '
                    u'the organisation for this project. (75 characters)')
    )
    iati_url = models.URLField(
        blank=True,
        help_text=_(
            u'Please enter the URL for where the IATI Activity Id Funding details are published. '
            u'For projects directly or indirectly funded by the Dutch Government, this should '
            u'be the OpenAid.nl page. For other projects, an alternative URL can be used.'
        )
    )
    related_activity_id = ValidXMLCharField(
        _(u'related IATI activity ID'), max_length=100, blank=True
    )

    def iati_organisation_role_label(self):
        return dict(self.IATI_ROLES).get(self.iati_organisation_role, '')

    def iati_organisation_role_label_unicode(self):
        return u"{}".format(self.iati_organisation_role_label())

    def iati_role_to_partner_type(self):
        return dict(self.ROLES_TO_PARTNER_TYPES_MAP).get(self.iati_organisation_role, '')

    def iati_role_to_partner_type_unicode(self):
        return u"{}".format(self.iati_role_to_partner_type())

    def organisation_show_link(self):
        if self.organisation:
            return u'<a href="{0}">{1}</a>'.format(self.organisation.get_absolute_url(),
                                                   self.organisation.long_name or
                                                   self.organisation.name)
        return ''

    def funding_amount_with_currency(self):
        """Returns the funding amount, prepended by the project's currency."""
        if self.funding_amount and self.project and self.project.currency:
            return u'{0} {1}'.format(self.project.currency, self.funding_amount)
        return self.funding_amount

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project partner')
        verbose_name_plural = _(u'project partners')
        ordering = ['iati_organisation_role']

    def __unicode__(self):
        if self.organisation:
            if self.organisation.name:
                organisation_unicode = self.organisation.name
            elif self.organisation.long_name:
                organisation_unicode = self.organisation.long_name
            else:
                organisation_unicode = u'%s' % _(u'Organisation name not specified')
        else:
            organisation_unicode = u'%s' % _(u'Organisation not specified')

        if self.iati_organisation_role:
            organisation_unicode += u' ({})'.format(
                unicode(dict(self.IATI_ROLES)[self.iati_organisation_role])
            )
        return organisation_unicode

    def clean(self):
        # Don't allow multiple reporting organisations
        Project = models.get_model('rsr', 'project')
        project = Project.objects.get(id=self.project_id)
        if self.iati_organisation_role == self.IATI_REPORTING_ORGANISATION:
            reporting_orgs = project.partnerships.filter(
                iati_organisation_role=self.IATI_REPORTING_ORGANISATION
            )

            if reporting_orgs.count() > 1:
                raise ValidationError(
                    {'iati_organisation_role': u'%s' % _(u'Project can only have one reporting '
                                                         u'organisation')}
                )

    def save(self, *args, **kwargs):
        super(Partnership, self).save(*args, **kwargs)
        self.set_primary_organisation()

    def delete(self, *args, **kwargs):
        super(Partnership, self).delete(*args, **kwargs)
        self.set_primary_organisation()

    def set_primary_organisation(self):
        # Check which organisation should be set to the primary organisation of the project
        # This is done to get better performance on the project list page
        Project = models.get_model('rsr', 'project')
        project = Project.objects.get(id=self.project_id)
        project.primary_organisation = project.find_primary_organisation()
        project.save(update_fields=['primary_organisation'])


@receiver(post_save, sender=Partnership)
def allow_project_access_if_restrictions_disabled(sender, **kwargs):
    created = kwargs['created']
    # Return if save is not a "create"
    if not created:
        return

    partnership = kwargs['instance']
    partnership_roles = {
        Partnership.IATI_REPORTING_ORGANISATION,
        Partnership.IATI_IMPLEMENTING_PARTNER
    }
    # Change permissions only when a reporting organisation is created, or implementing partner is added
    if partnership.iati_organisation_role not in partnership_roles:
        return

    if partnership.iati_organisation_role == Partnership.IATI_REPORTING_ORGANISATION:
        org = partnership.organisation

    else:
        reporting_org = partnership.project.reporting_org
        # If project has no reporting organisation, don't do anything
        if reporting_org is None:
            return
        content_owned_ids = set(reporting_org.content_owned_organisations().values_list('pk', flat=True))
        # If the new implementing partner is not a content owned org, don't do anything
        # NOTE: partnership.organisation is None when saving from the project Editor - weird saving!
        if partnership.organisation is None or partnership.organisation.pk not in content_owned_ids:
            return
        org = reporting_org

    if org.enable_restrictions:
        return

    from akvo.rsr.models.user_projects import unrestrict_projects
    users = (
        partnership.organisation.content_owned_organisations().users()
        if partnership.iati_organisation_role == Partnership.IATI_REPORTING_ORGANISATION
        else partnership.organisation.all_users()
    )

    for user in users:
        unrestrict_projects(None, user, [partnership.project])
