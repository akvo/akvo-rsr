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

from akvo.utils import codelist_choices, codelist_name, rsr_image_path

from ..mixins import TimestampsMixin
from ..fields import ValidXMLCharField, ValidXMLTextField
from akvo.codelists.store.codelists_v202 import CURRENCY, ORGANISATION_TYPE
from akvo.codelists.models import Currency

from .country import Country
from .partner_site import PartnerSite
from .partnership import Partnership
from .publishing_status import PublishingStatus
from .project_update import ProjectUpdate

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
        types = dict(zip([int(type) for type, name in ORGANISATION_TYPE[1:]],
            cls.NEW_TO_OLD_TYPES
        ))
        return types[iati_type]

    name = ValidXMLCharField(
        _(u'name'), max_length=40, db_index=True, unique=True,
        help_text=_(u'Short name which will appear in organisation and partner listings '
                    u'(25 characters).')
    )
    long_name = ValidXMLCharField(
        _(u'long name'), max_length=100, db_index=True, unique=True,
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
    currency = ValidXMLCharField(
        _(u'currency'), choices=codelist_choices(CURRENCY), max_length=3, default='EUR',
        help_text=_(u'The default currency for this organisation. Used in all financial '
                    u'aspects of the organisation.')
    )
    new_organisation_type = models.IntegerField(
        _(u'IATI organisation type'), db_index=True,
        choices=[(int(c[0]), c[1]) for c in codelist_choices(ORGANISATION_TYPE)],
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
    # TODO: Should be removed
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
        long_name = self.long_name.strip()
        iati_org_id = self.iati_org_id.strip() if self.iati_org_id else None

        names = Organisation.objects.filter(name__iexact=name)
        long_names = Organisation.objects.filter(long_name__iexact=long_name)
        ids = Organisation.objects.filter(iati_org_id__iexact=iati_org_id)

        if self.pk:
            names = names.exclude(pk=self.pk)
            long_names = long_names.exclude(pk=self.pk)
            ids = ids.exclude(pk=self.pk)

        if name and names.exists():
            validation_errors['name'] = u'{}: {}'.format(
                    _('An Organisation with this name already exists'), name)
        elif not name:
            # This prevents organisation names with only spaces
            validation_errors['name'] = _(u'Organisation name may not be blank')

        if long_name and long_names.exists():
            validation_errors['long_name'] = u'{}: {}'.format(
                _('An Organisation with this long name already exists'), long_name)
        elif not long_name:
            # This prevents organisation long names with only spaces
            validation_errors['long_name'] = _(u'Organisation long name may not be blank')

        if iati_org_id and ids:
            validation_errors['iati_org_id'] = u'{}: {}'.format(
                _('An Organisation with this IATI organisation identifier already exists'), ids[0].name)

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
                partnerships__project__iati_status__in=Project.NOT_SUSPENDED
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
            return Project.objects.filter(partnerships__organisation__in=self).distinct()

        def public_projects(self):
            """
            Returns a queryset with all public projects that has self as any kind of partner.
            """
            return self.all_projects().public()

        def users(self):
            "returns a queryset of all users belonging to the organisation(s)"
            from .user import User
            return User.objects.filter(employers__organisation__in=self).distinct()

        def all_updates(self):
            """returns a queryset with all updates of the organisation."""
            return ProjectUpdate.objects.filter(project__partners=self).distinct()

        def employments(self):
            "returns a queryset of all employments belonging to the organisation(s)"
            from .employment import Employment
            return Employment.objects.filter(organisation__in=self).distinct()

        def content_owned_organisations(self):
            """
            Returns a list of Organisations of which these organisations are the content owner.
            Includes self, is recursive.
            """
            queryset = self

            # If one of the organisations is a paying partner, add all implementing partners to
            # the queryset
            if queryset.filter(can_create_projects=True).exists():
                field_partners = queryset.all_projects().field_partners().\
                    exclude(can_create_projects=True)
                queryset = Organisation.objects.filter(
                    Q(pk__in=queryset.values_list('pk', flat=True)) |
                    Q(pk__in=field_partners.values_list('pk', flat=True))
                )

            # If the organisations content own other organisations, add those to the queryset
            kids = Organisation.objects.filter(content_owner__in=self).exclude(organisation=self)
            if kids:
                return Organisation.objects.filter(
                    Q(pk__in=queryset.values_list('pk', flat=True)) |
                    Q(pk__in=kids.content_owned_organisations().values_list('pk', flat=True))
                )

            return queryset

    def __unicode__(self):
        return self.name

    def iati_org_type(self):
        return dict(ORGANISATION_TYPE)[str(self.new_organisation_type)] if \
            self.new_organisation_type else ""

    def iati_org_type_unicode(self):
        return str(self.iati_org_type())

    def partnersites(self):
        "returns the partnersites belonging to the organisation in a PartnerSite queryset"
        return PartnerSite.objects.filter(organisation=self)

    def website(self):
        return '<a href="%s">%s</a>' % (self.url, self.url,)
    website.allow_tags = True

    def all_users(self):
        "returns a queryset of all users belonging to the organisation"
        return self.users.all()

    def published_projects(self):
        "returns a queryset with published projects that has self as any kind of partner"
        return self.projects.published().distinct()

    def all_projects(self):
        """returns a queryset with all projects that has self as any kind of partner."""
        return self.projects.distinct()

    def all_updates(self):
        """returns a queryset with all updates of the organisation."""
        return ProjectUpdate.objects.filter(project__partners=self).distinct()

    def reporting_on_projects(self):
        """returns a queryset with all projects that has self as reporting organisation."""
        return self.projects.filter(
            partnerships__organisation=self,
            partnerships__iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
        )

    def active_projects(self):
        return self.published_projects().status_not_cancelled().status_not_archived()

    def partners(self):
        """
        Returns a queryset of all organisations that self has at least one project
        in common with, excluding self.
        """
        return self.all_projects().all_partners().exclude(id__exact=self.id)

    def support_partners(self):
        """
        Returns a queryset of support partners that self has at least one project
        in common with, excluding self.
        """
        return self.all_projects().support_partners().exclude(id__exact=self.id)

    def field_partners(self):
        """
        Returns an Organisation queryset of field partners of which self has at least
        one project in common with.
        """
        return self.all_projects().field_partners().exclude(id__exact=self.id)

    def has_partner_types(self, project):
        """Return a list of partner types of this organisation to the project"""
        return [
            dict(Partnership.IATI_ROLES)[role] for role in Partnership.objects.filter(
                project=project,
                organisation=self,
                iati_organisation_role__isnull=False
            ).values_list('iati_organisation_role', flat=True)
        ]

    def content_owned_organisations(self):
        """
        Returns a list of Organisations of which this organisation is the content owner.
        Includes self and is recursive.
        """
        return Organisation.objects.filter(pk=self.pk).content_owned_organisations()

    def content_owned_by(self):
        """
        Returns a list of Organisations of which this organisation is content owned by. Basically
        the reverse of content_owned_organisations(). Includes self.
        """
        # Always select the organisation itself and the organisation that is specifically set as
        # content owner of the organisation.
        if self.content_owner:
            queryset = Organisation.objects.filter(pk__in=[self.pk, self.content_owner.pk])
        else:
            queryset = Organisation.objects.filter(pk=self.pk)

        # In case this partner is not a paying partner, find all projects where this partner is
        # implementing partner and add the paying partners of those projects to the queryset.
        if not self.can_create_projects:
            paying_partners = self.all_projects().paying_partners()
            queryset = Organisation.objects.filter(
                Q(pk__in=queryset.values_list('pk', flat=True)) |
                Q(pk__in=paying_partners.values_list('pk', flat=True))
            )

        return queryset.distinct()

    def countries_where_active(self):
        """Returns a Country queryset of countries where this organisation has
        published projects."""
        return Country.objects.filter(
            projectlocation__project__partnerships__organisation=self,
            projectlocation__project__publishingstatus__status=PublishingStatus.STATUS_PUBLISHED
        ).distinct()

    def organisation_countries(self):
        """Returns a list of the organisations countries."""
        countries = []
        for location in self.locations.all():
            if location.iati_country:
                countries.append(location.iati_country_value().name)
        return countries

    def iati_file(self):
        """
        Looks up the latest public IATI file of this organisation.

        :return: String of IATI file or None
        """
        for export in self.iati_exports.all().order_by('-last_modified_at'):
            if export.is_public and export.status == 3 and export.iati_file:
                return export.iati_file
        return None

    def iati_file_unicode(self):
        return str(self.iati_file())

    # New API

    def has_multiple_project_currencies(self):
        "Check if organisation has projects with different currencies"
        if self.published_projects().distinct().count() == self.org_currency_projects_count():
            return False
        else:
            return True

    def currency_label(self):
        return codelist_name(Currency, self, 'currency')

    def amount_pledged(self):
        "How much the organisation has pledged to projects in default currency"
        return self.active_projects().filter(currency=self.currency).filter(
            partnerships__organisation__exact=self,
            partnerships__iati_organisation_role__exact=Partnership.IATI_FUNDING_PARTNER
        ).aggregate(
            amount_pledged=Sum('partnerships__funding_amount')
        )['amount_pledged'] or 0

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

    def org_currency_projects_count(self):
        "How many projects with budget in default currency the organisation is a partner to"
        return self.published_projects().filter(currency=self.currency).distinct().count()

    def euro_projects_count(self):
        "How many projects with budget in € the organisation is a partner to"
        return self.published_projects().euros().distinct().count()

    def dollar_projects_count(self):
        "How many projects with budget in $ the organisation is a partner to"
        return self.published_projects().dollars().distinct().count()

    def _aggregate_funds_needed(self, projects):
        return sum(projects.values_list('funds_needed', flat=True))

    def org_currency_funds_needed(self):
        """How much is still needed to fully fund all projects with default currency budget that the
        organisation is a partner to.

        The ORM aggregate() doesn't work here since we may have multiple partnership relations
        to the same project."""
        return self._aggregate_funds_needed(self.published_projects().filter(currency=self.currency).distinct())

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
