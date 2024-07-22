# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum, Q, signals
from django.dispatch import receiver
from django.urls import reverse
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _
from django_q.tasks import async_task

from sorl.thumbnail.fields import ImageField
from akvo.password_policy.models import PolicyConfig

from akvo.utils import codelist_choices, codelist_name, rsr_image_path
from akvo.rsr.usecases.toggle_org_enforce_2fa import toggle_enfore_2fa

from ..mixins import TimestampsMixin
from ..fields import ValidXMLCharField, ValidXMLTextField
from akvo.codelists.store.default_codelists import CURRENCY, ORGANISATION_TYPE
from akvo.codelists.models import Currency

from .country import Country
from .model_querysets.organisation import OrgManager
from .partner_site import PartnerSite
from .partnership import Partnership
from .publishing_status import PublishingStatus
from .project_update import ProjectUpdate

ORG_TYPE_NGO = 'N'
ORG_TYPE_GOV = 'G'
ORG_TYPE_COM = 'C'
ORG_TYPE_KNO = 'K'
ORG_TYPES = (
    (ORG_TYPE_NGO, _('NGO')),
    (ORG_TYPE_GOV, _('Governmental')),
    (ORG_TYPE_COM, _('Commercial')),
    (ORG_TYPE_KNO, _('Knowledge institution')),
)


def image_path(instance, file_name):
    return rsr_image_path(instance, file_name, 'db/org/%(instance_pk)s/%(file_name)s')


class Organisation(TimestampsMixin):
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
        _('name'), max_length=40, db_index=True, unique=True,
        help_text=_('Short name which will appear in organisation and partner listings '
                    '(25 characters).')
    )
    long_name = ValidXMLCharField(
        _('long name'), max_length=100, db_index=True, unique=True,
        help_text=_('Full name of organisation (75 characters).'),
    )
    language = ValidXMLCharField(
        _('language'), max_length=2, choices=settings.RSR_LANGUAGES, default='en',
        help_text=_('The main language of the organisation'),
    )
    organisation_type = ValidXMLCharField(
        _('organisation type'), max_length=1, db_index=True, choices=ORG_TYPES, blank=True,
        null=True
    )
    currency = ValidXMLCharField(
        _('currency'), choices=codelist_choices(CURRENCY), max_length=3, default='EUR',
        help_text=_('The default currency for this organisation. Used in all financial '
                    'aspects of the organisation.')
    )
    new_organisation_type = models.IntegerField(
        _('IATI organisation type'), db_index=True,
        choices=[(int(c[0]), c[1]) for c in codelist_choices(ORGANISATION_TYPE)],
        default=22, help_text=_('Check that this field is set to an organisation type that '
                                'matches your organisation.'),
    )
    iati_org_id = ValidXMLCharField(
        _('IATI organisation ID'), max_length=75, blank=True, null=True, db_index=True,
        unique=True, default=None
    )
    internal_org_ids = models.ManyToManyField(
        'self', through='InternalOrganisationID', symmetrical=False,
        related_name='recording_organisation'
    )
    logo = ImageField(_('logo'), blank=True, upload_to=image_path,
                      help_text=_('Logos should be approximately 360x270 pixels '
                                  '(approx. 100-200kB in size) on a white background.')
                      )
    url = models.URLField(
        blank=True,
        help_text=_('Enter the full address of your web site, beginning with http://.'),
    )
    facebook = models.URLField(
        blank=True,
        help_text=_('Enter the full address of your Facebook page, beginning with http://.'),
    )
    twitter = models.URLField(
        blank=True,
        help_text=_('Enter the full address of your Twitter feed, beginning with http://.'),
    )
    linkedin = models.URLField(
        blank=True,
        help_text=_('Enter the full address of your LinkedIn page, beginning with http://.'),
    )
    phone = ValidXMLCharField(
        _('phone'), blank=True, max_length=20, help_text=_('(20 characters).')
    )
    mobile = ValidXMLCharField(
        _('mobile'), blank=True, max_length=20, help_text=_('(20 characters).')
    )
    fax = ValidXMLCharField(
        _('fax'), blank=True, max_length=20, help_text=_('(20 characters).')
    )
    contact_person = ValidXMLCharField(
        _('contact person'), blank=True, max_length=30,
        help_text=_('Name of external contact person for your organisation (30 characters).'),
    )
    contact_email = ValidXMLCharField(
        _('contact email'), blank=True, max_length=50,
        help_text=_('Email to which inquiries about your organisation should be sent '
                    '(50 characters).'),
    )
    description = ValidXMLTextField(
        _('description'), blank=True, help_text=_('Describe your organisation.')
    )
    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')
    primary_location = models.ForeignKey(
        'OrganisationLocation', null=True, on_delete=models.SET_NULL
    )
    can_create_projects = models.BooleanField(
        default=False,
        help_text=_('Partner editors of this organisation can create new projects, and publish '
                    'projects it is a partner of.')
    )
    enforce_program_projects = models.BooleanField(
        default=False,
        help_text=_('Enforce creation of projects only under programs. If the organisation has '
                    'explicitly set a content owner, this flag remains in sync with the content owner'))
    use_project_roles = models.BooleanField(
        verbose_name=_(u"use project roles"),
        default=False,
        help_text=_(u'Projects with this organisation as reporting partner will use project'
                    u'roles for permissions instead of employment based permissions'))
    content_owner = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL,
        help_text=_('Organisation that maintains content for this organisation through the API.')
    )
    original = models.OneToOneField('self', related_name='shadow', null=True, blank=True,
                                    on_delete=models.SET_NULL,
                                    help_text='Pointer to original organisation if this is a '
                                              'shadow. Used by EUTF')
    public_iati_file = models.BooleanField(
        _('Show latest exported IATI file on organisation page.'), default=True
    )
    enforce_2fa = models.BooleanField(
        _('Enforce 2-Factor-Authentication'), default=False,
        help_text=_('Enfore related users (through employment or project access) to enable their 2FA'),
    )
    password_policy = models.ForeignKey(
        PolicyConfig, null=True, blank=True, on_delete=models.SET_NULL,
        help_text='Password policies config for employees of this organization.'
    )
    # TODO: Should be removed
    can_become_reporting = models.BooleanField(
        _('Reportable'),
        help_text=_('Organisation is allowed to become a reporting organisation. '
                    'Can be set by superusers.'),
        default=False)
    iati_prefixes = ValidXMLCharField(
        _('IATI identifier prefixes'), max_length=2000, blank=True, null=True,
        help_text=_('This is a ; separated list of IATI identifier prefixes used by projects'
                    'where the organisation is a reporting partner.')
    )
    codelist = models.ForeignKey(
        'OrganisationCodelist', null=True, blank=True, on_delete=models.SET_NULL
    )
    objects = OrgManager()

    def get_absolute_url(self):
        return reverse('organisation-main', kwargs={'organisation_id': self.pk})

    @cached_property
    def cacheable_url(self):
        return self.get_absolute_url()

    @property
    def canonical_name(self):
        return self.long_name or self.name

    __original_enforce_2fa = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__original_enforce_2fa = self.enforce_2fa

    def save(self, *args, **kwargs):
        if self.enforce_2fa != self.__original_enforce_2fa:
            async_task(toggle_enfore_2fa, self)
        super().save(*args, **kwargs)
        self.__original_enforce_2fa = self.enforce_2fa

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
            validation_errors['name'] = '{}: {}'.format(
                _('An Organisation with this name already exists'), name)
        elif not name:
            # This prevents organisation names with only spaces
            validation_errors['name'] = _('Organisation name may not be blank')

        if long_name and long_names.exists():
            validation_errors['long_name'] = '{}: {}'.format(
                _('An Organisation with this long name already exists'), long_name)
        elif not long_name:
            # This prevents organisation long names with only spaces
            validation_errors['long_name'] = _('Organisation long name may not be blank')

        if iati_org_id and ids:
            validation_errors['iati_org_id'] = '{}: {}'.format(
                _('An Organisation with this IATI organisation identifier already exists'), ids[0].name)

        if validation_errors:
            raise ValidationError(validation_errors)

    def __str__(self):
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

    def published_projects(self, only_public=True):
        "returns a queryset with published projects that has self as any kind of partner"
        projects = self.projects.published().distinct()
        return projects.public() if only_public else projects

    def all_projects(self):
        """returns a queryset with all projects that has self as any kind of partner."""
        return self.projects.distinct()

    @staticmethod
    def all_updates_filter(org_id):
        """Returns a Q object for filtering updates for an organisation."""
        return Q(user__organisations__id=org_id, project__partners__id=org_id)

    def all_updates(self):
        """Returns a queryset with all updates of the organisation.

        Updates of the organisation are updates which have been:

        1. Posted by users employed by the organisation AND
        2. Posted on projects where the organisation is a partner.

        """
        return ProjectUpdate.objects.filter(Organisation.all_updates_filter(self.id)).distinct()

    def public_updates(self):
        """Returns a queryset with public updates of the organisation."""
        all_updates = self.all_updates()
        return all_updates.filter(project__in=self.published_projects()).distinct()

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

    def content_owned_organisations(self, exclude_orgs=None):
        """
        Returns a list of Organisations of which this organisation is the content owner.
        Includes self and is recursive.
        """
        org = Organisation.objects.get(pk=self.pk)
        queryset = Organisation.objects.filter(pk=org.pk)
        # If the organisation is a paying partner, add all implementing
        # partners to the queryset
        if org.can_create_projects:
            field_partners = org.all_projects().field_partners().exclude(can_create_projects=True)
            queryset = Organisation.objects.filter(
                Q(pk=org.id) | Q(pk__in=field_partners.values_list('pk', flat=True))
            )

        kids = Organisation.objects.filter(content_owner_id=org.id).exclude(id=org.id)
        if exclude_orgs is not None:
            kids = kids.exclude(pk__in=exclude_orgs)
        if kids.exists():
            exclude_orgs = Organisation.objects.filter(Q(pk=self.pk) | Q(pk__in=kids))
            grand_kids = kids.content_owned_organisations(exclude_orgs=exclude_orgs)
            kids_content_owned_orgs = Organisation.objects.filter(
                Q(pk__in=queryset.values_list('pk', flat=True))
                | Q(pk__in=kids.values_list('pk', flat=True))
                | Q(pk__in=grand_kids.values_list('pk', flat=True))
            ).distinct()
            return kids_content_owned_orgs

        return queryset

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
            from akvo.rsr.models import Project

            implementing_partnerships = Partnership.objects.filter(
                iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER, organisation=self)
            implementing_ids = implementing_partnerships.values_list('project', flat=True)
            projects = Project.objects.filter(id__in=implementing_ids)
            paying_partners = projects.paying_partners()
            queryset = Organisation.objects.filter(
                Q(pk__in=queryset.values_list('pk', flat=True))
                | Q(pk__in=paying_partners.values_list('pk', flat=True))
            )

        return queryset.distinct()

    def get_original(self):
        "Returns the original org if self is a shadow org"
        return self.original if self.original else self

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
        for export in self.iati_exports.filter(latest=True, status=3).order_by('-last_modified_at'):
            if export.iati_file:
                return export.iati_file
        return None

    def iati_file_unicode(self):
        return str(self.iati_file())

    # New API

    def has_multiple_project_currencies(self):
        "Check if organisation has projects with different currencies"
        if self.active_projects().distinct().count() == self.org_currency_projects_count():
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

    def org_currency_projects_count(self):
        "How many projects with budget in default currency the organisation is a partner to"
        return self.active_projects().filter(currency=self.currency).distinct().count()

    def _aggregate_funds_needed(self, projects):
        return sum(projects.values_list('funds_needed', flat=True))

    def org_currency_funds_needed(self):
        """How much is still needed to fully fund all projects with default currency budget that the
        organisation is a partner to.

        The ORM aggregate() doesn't work here since we may have multiple partnership relations
        to the same project."""
        return self._aggregate_funds_needed(self.active_projects().filter(currency=self.currency).distinct())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation')
        verbose_name_plural = _('organisations')
        permissions = (
            ('user_management', 'Can manage users'),
        )


@receiver(signals.post_save, sender=Organisation)
def enforce_projects_creation_under_programs(sender, **kwargs):
    """Keep the flag enforce_program_projects in sync for content owned orgs.

    *NOTE*: We only change the flag for organisations that directly set this
    organisation as a content owner explicitly. Implicit content owned
    organisations are not touched.

    """

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    org = kwargs['instance']

    Organisation.objects.filter(content_owner=org).update(
        enforce_program_projects=org.enforce_program_projects)

    # Organisation with content_owner is always in sync with the content_owner,
    # if they have one set explicitly.
    if org.content_owner and org.enforce_program_projects != org.content_owner.enforce_program_projects:
        org.enforce_program_projects = org.content_owner.enforce_program_projects
        org.save(update_fields=['enforce_program_projects'])
