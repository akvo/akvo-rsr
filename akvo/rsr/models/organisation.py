# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.db.models.query import QuerySet
from django.utils.translation import ugettext_lazy as _

from sorl.thumbnail.fields import ImageWithThumbnailsField

from akvo.utils import rsr_image_path
from akvo.utils import RSR_LIMITED_CHANGE

from ..mixins import TimestampsMixin
from ..fields import ValidXMLCharField, ValidXMLTextField
from ..iati.iati_code_lists import IATI_LIST_ORGANISATION_TYPE

from .country import Country
from .models_utils import QuerySetManager
from .partner_type import PartnerType
from .partner_site import PartnerSite
from .partnership import Partnership
from .publishing_status import PublishingStatus

ORG_TYPE_NGO = 'N'
ORG_TYPE_GOV = 'G'
ORG_TYPE_COM = 'C'
ORG_TYPE_KNO = 'K'
ORG_TYPES = (
    (ORG_TYPE_NGO, _(u'NGO')),
    (ORG_TYPE_GOV, _(u'Governmental')),
    (ORG_TYPE_COM, _(u'Commercial')),
    (ORG_TYPE_KNO, _(u'Knowledge institution')),
)


class Organisation(TimestampsMixin, models.Model):
    """
    There are four types of organisations in RSR, called Field,
    Support, Funding and Sponsor partner respectively.
    """
    NEW_TO_OLD_TYPES = [
        ORG_TYPE_GOV, ORG_TYPE_GOV, ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_NGO,
        ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_COM, ORG_TYPE_KNO
    ]

    @classmethod
    def org_type_from_iati_type(cls, iati_type):
        """ utility that maps the IATI organisation types to the old Akvo organisation types
        """
        types = dict(zip([type for type, name in IATI_LIST_ORGANISATION_TYPE],
            cls.NEW_TO_OLD_TYPES
        ))
        return types[iati_type]

    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/org/%(instance_pk)s/%(file_name)s')

    # TODO: make name unique
    name = ValidXMLCharField(
        _(u'name'), max_length=25, db_index=True,
        help_text=_(u'Short name which will appear in organisation and partner listings (25 characters).'),
    )
    long_name = ValidXMLCharField(
        _(u'long name'), blank=True, max_length=75,
        help_text=_(u'Full name of organisation (75 characters).'),
    )
    language = ValidXMLCharField(
        max_length=2, choices=settings.LANGUAGES, default='en',
        help_text=u'The main language of the organisation',
    )
    partner_types = models.ManyToManyField(PartnerType)
    organisation_type = ValidXMLCharField(_(u'organisation type'), max_length=1, db_index=True, choices=ORG_TYPES)
    new_organisation_type = models.IntegerField(
        _(u'IATI organisation type'), db_index=True, choices=IATI_LIST_ORGANISATION_TYPE, default=22,
        help_text=u'Check that this field is set to an organisation type that matches your organisation.',
    )
    iati_org_id = ValidXMLCharField(
        _(u'IATI organisation ID'), max_length=75, blank=True, null=True, db_index=True, unique=True
    )
    internal_org_ids = models.ManyToManyField(
        'self', through='InternalOrganisationID', symmetrical=False, related_name='recording_organisation'
    )
    logo = ImageWithThumbnailsField(
        _(u'logo'), blank=True, upload_to=image_path, thumbnail={'size': (360, 270)},
        extra_thumbnails={
            'map_thumb': {'size': (160, 120), 'options': ('autocrop',)},
            'fb_thumb': {'size': (200, 200), 'options': ('pad', )}
        },
        help_text=_(u'Logos should be approximately 360x270 pixels (approx. 100-200kB in size) on a white background.'),
    )

    url = models.URLField(
        blank=True,
        help_text=_(u'Enter the full address of your web site, beginning with http://.'),
    )

    phone = ValidXMLCharField(_(u'phone'), blank=True, max_length=20, help_text=_(u'(20 characters).'))
    mobile = ValidXMLCharField(_(u'mobile'), blank=True, max_length=20, help_text=_(u'(20 characters).'))
    fax = ValidXMLCharField(_(u'fax'), blank=True, max_length=20, help_text=_(u'(20 characters).'))
    contact_person = ValidXMLCharField(
        _(u'contact person'), blank=True, max_length=30,
        help_text=_(u'Name of external contact person for your organisation (30 characters).'),
    )
    contact_email = ValidXMLCharField(
        _(u'contact email'), blank=True, max_length=50,
        help_text=_(u'Email to which inquiries about your organisation should be sent (50 characters).'),
    )
    description = ValidXMLTextField(_(u'description'), blank=True, help_text=_(u'Describe your organisation.'))

    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    # old_locations = generic.GenericRelation(Location)
    primary_location = models.ForeignKey('OrganisationLocation', null=True, on_delete=models.SET_NULL)

    content_owner = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL,
        help_text=_(u'Organisation that maintains content for this organisation through the API.'),
    )

    # Allowed to manually edit information on projects of this organisation
    allow_edit = models.BooleanField(
        _(u'Partner editors of this organisation are allowed to manually edit projects where this organisation is '
          u'support partner'),
        help_text=_(
            u'When manual edits are disallowed, partner admins and editors of other organisations are also not '
            u'allowed to edit these projects.'
        ),
        default=True
    )

    objects = QuerySetManager()

    @models.permalink
    def get_absolute_url(self):
        return ('organisation_main', (), {'org_id': self.pk})


    class QuerySet(QuerySet):
        def has_location(self):
            return self.filter(primary_location__isnull=False)

        def partners(self, partner_type):
            "return the organisations in the queryset that are partners of type partner_type"
            return self.filter(partnerships__partner_type__exact=partner_type).distinct()

        def allpartners(self):
            return self.distinct()

        def fieldpartners(self):
            return self.partners(Partnership.FIELD_PARTNER)

        def fundingpartners(self):
            return self.partners(Partnership.FUNDING_PARTNER)

        def sponsorpartners(self):
            return self.partners(Partnership.SPONSOR_PARTNER)

        def supportpartners(self):
            return self.partners(Partnership.SUPPORT_PARTNER)

        def supportpartners_with_projects(self):
            """return the organisations in the queryset that are support partners with published projects, not
            counting archived projects"""
            from .project import Project
            return self.filter(
                partnerships__partner_type=Partnership.SUPPORT_PARTNER,
                partnerships__project__publishingstatus__status=PublishingStatus.STATUS_PUBLISHED,
                partnerships__project__status__in=[
                    Project.STATUS_ACTIVE,
                    Project.STATUS_COMPLETE,
                    Project.STATUS_NEEDS_FUNDING,
                    Project.STATUS_CANCELLED,
                ]
            ).distinct()

        def ngos(self):
            return self.filter(organisation_type__exact=ORG_TYPE_NGO)

        def governmental(self):
            return self.filter(organisation_type__exact=ORG_TYPE_GOV)

        def commercial(self):
            return self.filter(organisation_type__exact=ORG_TYPE_COM)

        def knowledge(self):
            return self.filter(organisation_type__exact=ORG_TYPE_KNO)

    def __unicode__(self):
        return self.name

    def is_partner_type(self, partner_type):
        "returns True if the organisation is a partner of type partner_type to at least one project"
        return self.partnerships.filter(partner_type__exact=partner_type).count() > 0

    def is_field_partner(self):
        "returns True if the organisation is a field partner to at least one project"
        return self.is_partner_type(Partnership.FIELD_PARTNER)

    def is_funding_partner(self):
        "returns True if the organisation is a funding partner to at least one project"
        return self.is_partner_type(Partnership.FUNDING_PARTNER)

    def is_sponsor_partner(self):
        "returns True if the organisation is a sponsor partner to at least one project"
        return self.is_partner_type(Partnership.SPONSOR_PARTNER)

    def is_support_partner(self):
        "returns True if the organisation is a support partner to at least one project"
        return self.is_partner_type(Partnership.SUPPORT_PARTNER)

    def partnersites(self):
        "returns the partnersites belonging to the organisation in a PartnerSite queryset"
        return PartnerSite.objects.filter(organisation=self)

    def website(self):
        return '<a href="%s">%s</a>' % (self.url, self.url,)
    website.allow_tags = True

    def published_projects(self):
        "returns a queryset with published projects that has self as any kind of partner"
        return self.projects.published().distinct()

    def all_projects(self):
        "returns a queryset with all projects that has self as any kind of partner"
        return self.projects.all().distinct()

    def active_projects(self):
        return self.published_projects().status_not_cancelled().status_not_archived()

    def partners(self):
        "returns a queryset of all organisations that self has at least one project in common with, excluding self"
        return self.published_projects().all_partners().exclude(id__exact=self.id)

    def countries_where_active(self):
        """Returns a Country queryset of countries where this organisation has published projects."""
        return Country.objects.filter(
            projectlocation__project__partnerships__organisation=self,
            projectlocation__project__publishingstatus__status=PublishingStatus.STATUS_PUBLISHED
        ).distinct()

    # New API

    def euros_pledged(self):
        "How much € the organisation has pledged to projects it is a partner to"
        return self.active_projects().euros().filter(
            partnerships__organisation__exact=self, partnerships__partner_type__exact=Partnership.FUNDING_PARTNER
        ).aggregate(
            euros_pledged=Sum('partnerships__funding_amount')
        )['euros_pledged'] or 0

    def dollars_pledged(self):
        "How much $ the organisation has pledged to projects"
        return self.active_projects().dollars().filter(
            partnerships__organisation__exact=self, partnerships__partner_type__exact=Partnership.FUNDING_PARTNER
        ).aggregate(
            dollars_pledged=Sum('partnerships__funding_amount')
        )['dollars_pledged'] or 0

    def euro_projects_count(self):
        "How many projects with budget in € the organisation is a partner to"
        return self.published_projects().euros().distinct().count()

    def dollar_projects_count(self):
        "How many projects with budget in $ the organisation is a partner to"
        return self.published_projects().dollars().distinct().count()

    def _aggregate_funds_needed(self, projects):
        return sum(projects.values_list('funds_needed', flat=True))

    def euro_funds_needed(self):
        "How much is still needed to fully fund all projects with € budget that the organiastion is a partner to"
        # the ORM aggregate() doesn't work here since we may have multiple partnership relations to the same project
        return self._aggregate_funds_needed(self.published_projects().euros().distinct())

    def dollar_funds_needed(self):
        "How much is still needed to fully fund all projects with $ budget that the organiastion is a partner to"
        # the ORM aggregate() doesn't work here since we may have multiple partnership relations to the same project
        return self._aggregate_funds_needed(self.published_projects().dollars().distinct())

    # New API end

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation')
        verbose_name_plural = _(u'organisations')
        ordering = ['name']
        permissions = (
            ("%s_organisation" % RSR_LIMITED_CHANGE, u'RSR limited change organisation'),
        )
