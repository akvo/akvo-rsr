# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum, Q
from django.db.models.query import QuerySet as DjangoQuerySet
from django.utils.translation import ugettext_lazy as _

from sorl.thumbnail.fields import ImageField

from akvo.utils import codelist_choices, rsr_image_path

from ..mixins import TimestampsMixin
from ..fields import ValidXMLCharField, ValidXMLTextField
from akvo.codelists.store.codelists_v201 import ORGANISATION_TYPE as IATI_LIST_ORGANISATION_TYPE

from .country import Country
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


def image_path(instance, file_name):
    return rsr_image_path(instance, file_name, 'db/org/%(instance_pk)s/%(file_name)s')


class OrgManager(models.Manager):
    def get_queryset(self):
        return self.model.QuerySet(self.model).extra(
            select={
                'lower_name': 'lower(rsr_organisation.name)'
            }
        ).order_by('lower_name')

    def __getattr__(self, attr, *args):
        try:
            return getattr(self.__class__, attr, *args)
        except AttributeError:
            return getattr(self.get_queryset(), attr, *args)


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
        types = dict(zip([int(type) for type, name in IATI_LIST_ORGANISATION_TYPE[1:]],
            cls.NEW_TO_OLD_TYPES
        ))
        return types[iati_type]

    name = ValidXMLCharField(
        _(u'name'), max_length=25, db_index=True, unique=True,
        help_text=_(u'Short name which will appear in organisation and partner listings '
                    u'(25 characters).')
    )
    long_name = ValidXMLCharField(
        _(u'long name'), max_length=75, db_index=True, unique=True,
        help_text=_(u'Full name of organisation (75 characters).'),
    )
    language = ValidXMLCharField(
        _(u'language'), max_length=2, choices=settings.LANGUAGES, default='en',
        help_text=_(u'The main language of the organisation'),
    )
    organisation_type = ValidXMLCharField(
        _(u'organisation type'), max_length=1, db_index=True, choices=ORG_TYPES, blank=True,
        null=True
    )
    new_organisation_type = models.IntegerField(
        _(u'IATI organisation type'), db_index=True,
        choices=[(int(c[0]), c[1]) for c in codelist_choices(IATI_LIST_ORGANISATION_TYPE)],
        default=22, help_text=_(u'Check that this field is set to an organisation type that '
                                u'matches your organisation.'),
    )
    iati_org_id = ValidXMLCharField(
        _(u'IATI organisation ID'), max_length=75, blank=True, null=True, db_index=True,
        unique=True, default=None
    )
    internal_org_ids = models.ManyToManyField(
        'self', through='InternalOrganisationID', symmetrical=False,
        related_name='recording_organisation'
    )
    logo = ImageField(_(u'logo'), blank=True, upload_to=image_path,
                      help_text=_(u'Logos should be approximately 360x270 pixels '
                                  u'(approx. 100-200kB in size) on a white background.')
    )
    url = models.URLField(
        blank=True,
        help_text=_(u'Enter the full address of your web site, beginning with http://.'),
    )
    facebook = models.URLField(
        blank=True,
        help_text=_(u'Enter the full address of your Facebook page, beginning with http://.'),
    )
    twitter = models.URLField(
        blank=True,
        help_text=_(u'Enter the full address of your Twitter feed, beginning with http://.'),
    )
    linkedin = models.URLField(
        blank=True,
        help_text=_(u'Enter the full address of your LinkedIn page, beginning with http://.'),
    )
    phone = ValidXMLCharField(
        _(u'phone'), blank=True, max_length=20, help_text=_(u'(20 characters).')
    )
    mobile = ValidXMLCharField(
        _(u'mobile'), blank=True, max_length=20, help_text=_(u'(20 characters).')
    )
    fax = ValidXMLCharField(
        _(u'fax'), blank=True, max_length=20, help_text=_(u'(20 characters).')
    )
    contact_person = ValidXMLCharField(
        _(u'contact person'), blank=True, max_length=30,
        help_text=_(u'Name of external contact person for your organisation (30 characters).'),
    )
    contact_email = ValidXMLCharField(
        _(u'contact email'), blank=True, max_length=50,
        help_text=_(u'Email to which inquiries about your organisation should be sent '
                    u'(50 characters).'),
    )
    description = ValidXMLTextField(
        _(u'description'), blank=True, help_text=_(u'Describe your organisation.')
    )
    notes = ValidXMLTextField(verbose_name=_(u"Notes and comments"), blank=True, default='')
    primary_location = models.ForeignKey(
        'OrganisationLocation', null=True, on_delete=models.SET_NULL
    )
    can_create_projects = models.BooleanField(
        default=False,
        help_text=_(u'Partner editors of this organisation can create new projects, and publish '
                    u'projects it is a partner of.')
    )
    content_owner = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL,
        help_text=_(u'Organisation that maintains content for this organisation through the API.')
    )
    allow_edit = models.BooleanField(
        _(u'Partner editors of this organisation are allowed to manually edit projects where '
          u'this organisation is support partner'),
        help_text=_(u'When manual edits are disallowed, partner admins and editors of other '
                    u'organisations are also not allowed to edit these projects.'), default=True
    )
    public_iati_file = models.BooleanField(
        _(u'Show latest exported IATI file on organisation page.'), default=True
    )
    can_become_reporting = models.BooleanField(
        _(u'Reportable'),
        help_text=_(u'Organisation is allowed to become a reporting organisation. '
                    u'Can be set by superusers.'),
        default=False)

    objects = OrgManager()

    @models.permalink
    def get_absolute_url(self):
        return 'organisation-main', (), {'organisation_id': self.pk}

    def clean(self):
        """Organisations can only be saved when we're sure that they do not exist already."""
        validation_errors = {}

        name = self.name.strip()
        other_names = Organisation.objects.filter(name__iexact=name)
        if name:
            if other_names.exists():
                validation_errors['name'] = _('Organisation name already exists: %s.' %
                                              other_names[0].name)
        else:
            validation_errors['name'] = _('Organisation name can not be blank')

        long_name = self.long_name.strip()
        other_long_names = Organisation.objects.filter(long_name__iexact=long_name)
        if long_name:
            if other_long_names.exists():
                validation_errors['long_name'] = _('Organisation long name already exists: %s.' %
                                                   other_long_names[0].long_name)
        else:
            validation_errors['long_name'] = _('Organisation long name can not be blank')

        if self.iati_org_id:
            iati_org_id = self.iati_org_id.strip()
            other_iati_ids = Organisation.objects.filter(iati_org_id__iexact=iati_org_id)
            if iati_org_id and other_iati_ids.exists():
                validation_errors['iati_org_id'] = _('IATI organisation identifier already exists '
                                                     'for this organisation: %s.' %
                                                     other_iati_ids[0].name)

        if validation_errors:
            raise ValidationError(validation_errors)

    class QuerySet(DjangoQuerySet):
        def has_location(self):
            return self.filter(primary_location__isnull=False)

        def partners(self, role):
            "return the organisations in the queryset that are partners of type role"
            return self.filter(partnerships__iati_organisation_role__exact=role).distinct()

        def allpartners(self):
            return self.distinct()

        def fieldpartners(self):
            return self.partners(Partnership.IATI_IMPLEMENTING_PARTNER)

        def fundingpartners(self):
            return self.partners(Partnership.IATI_FUNDING_PARTNER)

        def sponsorpartners(self):
            return self.partners(Partnership.AKVO_SPONSOR_PARTNER)

        def supportpartners(self):
            return self.partners(Partnership.IATI_ACCOUNTABLE_PARTNER)

        def extendingpartners(self):
            return self.partners(Partnership.IATI_EXTENDING_PARTNER)

        def supportpartners_with_projects(self):
            """return the organisations in the queryset that are support partners with published
            projects, not counting archived projects"""
            from .project import Project
            return self.filter(
                partnerships__iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER,
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

        def all_projects(self):
            "returns a queryset with all projects that has self as any kind of partner"
            from .project import Project
            return (Project.objects.filter(partnerships__organisation__in=self) |
                    Project.objects.filter(sync_owner__in=self)).distinct()

        def users(self):
            "returns a queryset of all users belonging to the organisation(s)"
            from .user import User
            return User.objects.filter(employers__organisation__in=self).distinct()

        def employments(self):
            "returns a queryset of all employments belonging to the organisation(s)"
            from .employment import Employment
            return Employment.objects.filter(organisation__in=self).distinct()

        def content_owned_organisations(self):
            """
            Returns a list of Organisations of which these organisations are the content owner.
            Includes self, is recursive.
            """

            kids = Organisation.objects.filter(content_owner__in=self).exclude(organisation=self)
            if kids:
                return Organisation.objects.filter(
                    Q(pk__in=self.values_list('pk', flat=True)) | Q(pk__in=kids.content_owned_organisations().values_list('pk', flat=True))
                )
            else:
                return self

    def __unicode__(self):
        return self.name

    def iati_org_type(self):
        return dict(IATI_LIST_ORGANISATION_TYPE)[str(self.new_organisation_type)] if \
            self.new_organisation_type else ""

    def partnersites(self):
        "returns the partnersites belonging to the organisation in a PartnerSite queryset"
        return PartnerSite.objects.filter(organisation=self)

    def website(self):
        return '<a href="%s">%s</a>' % (self.url, self.url,)
    website.allow_tags = True

    def all_users(self):
        "returns a queryset of all users belonging to the organisation"
        from .user import User
        return User.objects.filter(employers__organisation=self).distinct()

    def published_projects(self):
        "returns a queryset with published projects that has self as any kind of partner"
        return self.projects.published().distinct()

    def all_projects(self):
        """returns a queryset with all projects that has self as any kind of partner or reporting
        organisation."""
        return (self.projects.all() | self.reporting_projects.all()).distinct()

    def active_projects(self):
        return self.published_projects().status_not_cancelled().status_not_archived()

    def partners(self):
        """returns a queryset of all organisations that self has at least one project
        in common with, excluding self"""
        return self.published_projects().all_partners().exclude(id__exact=self.id)

    def support_partners(self):
        """returns a queryset of support partners that self has at least one project
        in common with, excluding self"""
        return self.published_projects().support_partners().exclude(id__exact=self.id)

    def has_partner_types(self, project):
        """Return a list of partner types of this organisation to the project"""
        partner_types = []
        for ps in Partnership.objects.filter(project=project, organisation=self):
            if ps.iati_organisation_role:
                partner_types.append(ps.iati_organisation_role_label())
        return partner_types

    def content_owned_organisations(self):
        """
        Returns a list of Organisations of which this organisation is the content owner.
        Includes self and is recursive.
        """
        return Organisation.objects.filter(content_owner=self).content_owned_organisations()

    def countries_where_active(self):
        """Returns a Country queryset of countries where this organisation has
        published projects."""
        return Country.objects.filter(
            projectlocation__project__partnerships__organisation=self,
            projectlocation__project__publishingstatus__status=PublishingStatus.STATUS_PUBLISHED
        ).distinct()

    def iati_file(self):
        """
        Looks up the latest public IATI file of this organisation.

        :return: String of IATI file or None
        """
        for export in self.iati_exports.all().order_by('-last_modified_at'):
            if export.is_public and export.status == 3 and export.iati_file:
                return export.iati_file
        return None

    # New API

    def euros_pledged(self):
        "How much € the organisation has pledged to projects it is a partner to"
        return self.active_projects().euros().filter(
            partnerships__organisation__exact=self,
            partnerships__iati_organisation_role__exact=Partnership.IATI_FUNDING_PARTNER
        ).aggregate(
            euros_pledged=Sum('partnerships__funding_amount')
        )['euros_pledged'] or 0

    def dollars_pledged(self):
        "How much $ the organisation has pledged to projects"
        return self.active_projects().dollars().filter(
            partnerships__organisation__exact=self,
            partnerships__iati_organisation_role__exact=Partnership.IATI_FUNDING_PARTNER
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
        """How much is still needed to fully fund all projects with € budget that the
        organisation is a partner to.

        The ORM aggregate() doesn't work here since we may have multiple partnership relations
        to the same project."""
        return self._aggregate_funds_needed(self.published_projects().euros().distinct())

    def dollar_funds_needed(self):
        """How much is still needed to fully fund all projects with $ budget that the
        organisation is a partner to.

        The ORM aggregate() doesn't work here since we may have multiple partnership relations
        to the same project."""
        return self._aggregate_funds_needed(self.published_projects().dollars().distinct())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation')
        verbose_name_plural = _(u'organisations')
        permissions = (
            ('user_management', u'Can manage users'),
        )
