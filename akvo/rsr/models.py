# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from datetime import date, datetime, timedelta
from textwrap import dedent

import logging
import math

logger = logging.getLogger('akvo.rsr')

import oembed

from django.conf import settings
from django.db import models
from django.db.models import Max, Sum
from django.db.models.query import QuerySet
from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Group, User
from django.utils.safestring import mark_safe
from django.utils.text import capfirst
from django.utils.translation import ugettext, ugettext_lazy as _

from django_counter.models import ViewCounter
from mollie.ideal.utils import get_mollie_banklist
from paypal.standard.ipn.signals import payment_was_flagged
from registration.signals import user_activated
from sorl.thumbnail.fields import ImageWithThumbnailsField

from workflows import WorkflowBase
from permissions import PermissionBase

from akvo.api.models import create_api_key

from akvo.rsr.fields import LatitudeField, LongitudeField, NullCharField, ValidXMLCharField, ValidXMLTextField
from akvo.rsr.fields import ProjectLimitedTextField
from akvo.rsr.iati_code_lists import IATI_LIST_ORGANISATION_TYPE
from akvo.rsr.mixins import TimestampsMixin
from akvo.utils import (
    GROUP_RSR_EDITORS, RSR_LIMITED_CHANGE, GROUP_RSR_PARTNER_ADMINS,
    GROUP_RSR_PARTNER_EDITORS
)
from akvo.utils import (
    PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_VOID,
    PAYPAL_INVOICE_STATUS_COMPLETE, PAYPAL_INVOICE_STATUS_STALE
)
from akvo.utils import (
    groups_from_user, rsr_image_path, to_gmt, rsr_show_keywords
)
from akvo.rsr.signals import (
    change_name_of_file_on_change, change_name_of_file_on_create,
    create_publishing_status, create_organisation_account,
    create_payment_gateway_selector, donation_completed,
    act_on_log_entry, user_activated_callback, update_project_budget,
    update_project_funding
)

from iso3166 import ISO_3166_COUNTRIES, CONTINENTS, COUNTRY_CONTINENTS

from tastypie.models import ApiKey


#Custom manager
#based on http://www.djangosnippets.org/snippets/562/ and
#http://simonwillison.net/2008/May/1/orm/
class QuerySetManager(models.Manager):
    def get_queryset(self):
        return self.model.QuerySet(self.model)

    def __getattr__(self, attr, *args):
        try:
            return getattr(self.__class__, attr, *args)
        except AttributeError:
            return getattr(self.get_queryset(), attr, *args)

OLD_CONTINENTS = (
    ("1", _(u'Africa')),
    ("2", _(u'Asia')),
    ("3", _(u'Australia')),
    ("4", _(u'Europe')),
    ("5", _(u'North America')),
    ("6", _(u'South America')),
)


class Country(models.Model):

    name = ValidXMLCharField(_(u'country name'), max_length=50, unique=True, db_index=True,)
    iso_code = ValidXMLCharField(_(u'ISO 3166 code'), max_length=2, unique=True, db_index=True, choices=ISO_3166_COUNTRIES,)
    continent = ValidXMLCharField(_(u'continent name'), max_length=20, db_index=True,)
    continent_code = ValidXMLCharField(_(u'continent code'), max_length=2, db_index=True, choices=CONTINENTS)

    def __unicode__(self):
        return self.name

    @classmethod
    def fields_from_iso_code(cls, iso_code):
        continent_code = COUNTRY_CONTINENTS[iso_code]
        name = dict(ISO_3166_COUNTRIES)[iso_code]
        continent = dict(CONTINENTS)[continent_code]
        return dict(
            iso_code=iso_code, name=name, continent=continent, continent_code=continent_code,
        )

    class Meta:
        verbose_name = _(u'country')
        verbose_name_plural = _(u'countries')
        ordering = ['name']


class BaseLocation(models.Model):
    _help_text = _(u"Go to <a href='http://mygeoposition.com/' target='_blank'>http://mygeoposition.com/</a> "
                   u'to get the decimal coordinates of your project.')
    latitude = LatitudeField(_(u'latitude'), db_index=True, default=0, help_text=_help_text)
    longitude = LongitudeField(_(u'longitude'), db_index=True, default=0, help_text=_help_text)
    city = ValidXMLCharField(_(u'city'), blank=True, max_length=255, help_text=_('(255 characters).'))
    state = ValidXMLCharField(_(u'state'), blank=True, max_length=255, help_text=_('(255 characters).'))
    country = models.ForeignKey(Country, verbose_name=_(u'country'))
    address_1 = ValidXMLCharField(_(u'address 1'), max_length=255, blank=True, help_text=_('(255 characters).'))
    address_2 = ValidXMLCharField(_(u'address 2'), max_length=255, blank=True, help_text=_('(255 characters).'))
    postcode = ValidXMLCharField(_(u'postcode'), max_length=10, blank=True, help_text=_('(10 characters).'))
    primary = models.BooleanField(_(u'primary location'), db_index=True, default=False)

    def delete(self, *args, **kwargs):
        location_target = self.location_target
        other_locations = [loc for loc in location_target.locations.exclude(pk__exact=self.pk)]

        if self.primary and len(other_locations) > 0:
            primary_loc = other_locations.pop(0)
            primary_loc.primary = True
            primary_loc.save()
            location_target.locations.exclude(pk__exact=primary_loc.pk).update(primary=False)
            location_target.primary_location = primary_loc
            location_target.save()

        super(BaseLocation, self).delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        location_target = self.location_target
        primaries = [loc for loc in location_target.locations.exclude(pk__exact=self.pk) if loc.primary]

        if self.primary:
            primary_loc = self
        else:
            if len(primaries) == 0:
                self.primary = True
                primary_loc = self
            elif len(primaries) > 0:
                primary_loc = primaries.pop(0)

        location_target.locations.exclude(pk__exact=primary_loc.pk).update(primary=False)
        location_target.primary_location = primary_loc
        location_target.save()

        super(BaseLocation, self).save(*args, **kwargs)

    class Meta:
        abstract = True
        ordering = ['-primary', ]


class OrganisationLocation(BaseLocation):
    # the organisation that's related to this location
    location_target = models.ForeignKey('Organisation', null=True, related_name='locations')


class ProjectLocation(BaseLocation):
    # the project that's related to this location
    location_target = models.ForeignKey('Project', null=True, related_name='locations')



class PartnerType(models.Model):
    id = ValidXMLCharField(max_length=8, primary_key=True, unique=True)
    label = ValidXMLCharField(max_length=30, unique=True)

    def __unicode__(self):
        return self.label

    class Meta:
        ordering = ('label',)


class Partnership(models.Model):
    FIELD_PARTNER = u'field'
    FUNDING_PARTNER = u'funding'
    SPONSOR_PARTNER = u'sponsor'
    SUPPORT_PARTNER = u'support'

    PARTNER_TYPE_LIST = [FIELD_PARTNER, FUNDING_PARTNER, SPONSOR_PARTNER, SUPPORT_PARTNER, ]
    PARTNER_LABELS = [_(u'Field partner'), _(u'Funding partner'), _(u'Sponsor partner'), _(u'Support partner'), ]
    PARTNER_TYPES = zip(PARTNER_TYPE_LIST, PARTNER_LABELS)

    ALLIANCE_PARTNER = u'alliance'
    KNOWLEDGE_PARTNER = u'knowledge'
    NETWORK_PARTNER = u'network'
    PARTNER_TYPE_EXTRAS_LIST = (ALLIANCE_PARTNER, KNOWLEDGE_PARTNER, NETWORK_PARTNER)
    PARTNER_TYPE_EXTRA_LABELS = (_(u'Alliance'), _(u'Knowledge'), _(u'Network'),)
    PARTNER_TYPE_EXTRAS = zip(PARTNER_TYPE_EXTRAS_LIST, PARTNER_TYPE_EXTRA_LABELS)

    organisation = models.ForeignKey('Organisation', verbose_name=_(u'organisation'), related_name='partnerships')
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='partnerships')
    partner_type = ValidXMLCharField(_(u'partner type'), max_length=8, db_index=True, choices=PARTNER_TYPES,)
    funding_amount = models.DecimalField(
        _(u'funding amount'), max_digits=10, decimal_places=2,
        blank=True, null=True, db_index=True
    )
    partner_type_extra = ValidXMLCharField(
        _(u'partner type extra'), max_length=30,
        blank=True, null=True, choices=PARTNER_TYPE_EXTRAS,
    )
    iati_activity_id = ValidXMLCharField(_(u'IATI activity ID'), max_length=75, blank=True, null=True, db_index=True,)
    internal_id = ValidXMLCharField(
        _(u'Internal ID'), max_length=75, blank=True, null=True, db_index=True,
        help_text=_(u"The organisation's internal ID for the project"),
    )
    iati_url = models.URLField(
        blank=True,
        help_text=_(u'Please enter the URL for where the IATI Activity Id Funding details are published. For projects directly or indirectly funded by the Dutch Government, this should be the OpenAid.nl page. For other projects, an alternative URL can be used.')
    )

    class Meta:
        verbose_name = _(u'project partner')
        verbose_name_plural = _(u'project partners')
        ordering = ['partner_type']

    def __unicode__(self):
        return self.organisation.name


class ProjectsQuerySetManager(QuerySetManager):
    def get_queryset(self):
        return self.model.ProjectsQuerySet(self.model)


class Organisation(TimestampsMixin, models.Model):
    """
    There are four types of organisations in RSR, called Field,
    Support, Funding and Sponsor partner respectively.
    """
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
    NEW_TO_OLD_TYPES = [ORG_TYPE_GOV, ORG_TYPE_GOV, ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_NGO,
                        ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_COM, ORG_TYPE_KNO]

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
    iati_org_id = ValidXMLCharField(_(u'IATI organisation ID'), max_length=75, blank=True, null=True, db_index=True, unique=True)
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
        help_text=_(u'When manual edits are disallowed, partner admins and editors of other organisations are also not '
                    u'allowed to edit these projects.'),
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
            return self.filter(partnerships__partner_type=Partnership.SUPPORT_PARTNER,
                               partnerships__project__publishingstatus__status='published',
                               partnerships__project__status__in=['A','C','H','L']).distinct()

        def ngos(self):
            return self.filter(organisation_type__exact=Organisation.ORG_TYPE_NGO)

        def governmental(self):
            return self.filter(organisation_type__exact=Organisation.ORG_TYPE_GOV)

        def commercial(self):
            return self.filter(organisation_type__exact=Organisation.ORG_TYPE_COM)

        def knowledge(self):
            return self.filter(organisation_type__exact=Organisation.ORG_TYPE_KNO)

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
            projectlocation__project__publishingstatus__status='published'
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
        verbose_name = _(u'organisation')
        verbose_name_plural = _(u'organisations')
        ordering = ['name']
        permissions = (
            ("%s_organisation" % RSR_LIMITED_CHANGE, u'RSR limited change organisation'),
        )


class InternalOrganisationID(models.Model):
    " Model allowing organisations to record their internal references to other organisations"
    recording_org = models.ForeignKey(Organisation,
                                      verbose_name=u'recording organisation', related_name='internal_ids')
    referenced_org = models.ForeignKey(Organisation,
                                       verbose_name=u'referenced organisation', related_name='reference_ids',)
    #TODO: add index
    identifier = ValidXMLCharField(max_length=200, verbose_name=u'internal ID of referenced organisation',)

    def __unicode__(self):
        return u"{rec_org_name}'s internal ID for {ref_org_name}: {identifier}".format(
            rec_org_name=self.recording_org.name,
            ref_org_name=self.referenced_org.name,
            identifier=self.identifier,
        )

    class Meta:
        unique_together = ('recording_org', 'referenced_org',)


class OrganisationAccount(models.Model):
    """
    This model keeps track of organisation account levels and other relevant data.
    The reason for having this in a separate model form Organisation is to hide
    it from the org admins.
    """

    ACCOUNT_LEVEL = (
        ('free', u'Free'),
        ('freemium', u'Freemium'),
        ('premium', u'Premium'),
        ('plus', u'Premium Plus'),
        ('archived', u'Archived'),
    )
    organisation = models.OneToOneField(Organisation, verbose_name=u'organisation', primary_key=True)
    account_level = ValidXMLCharField(u'account level', max_length=12, choices=ACCOUNT_LEVEL, default='free')

    class Meta:
        verbose_name = u'organisation account'
        verbose_name_plural = u'organisation accounts'


class FocusArea(models.Model):
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/focus_area/%(file_name)s')
    name = ValidXMLCharField(u'focus area name', max_length=50, help_text=_(u'The name of the focus area. This will show as the title of the focus area project listing page. (30 characters).'))
    slug = models.SlugField(u'slug', max_length=50, db_index=True, help_text=_(u'Enter the "slug" i.e. a short word or hyphenated-words. This will be used in the URL of the focus area project listing page. (20 characters, only lower case letters, numbers, hyphen and underscore allowed.).'))
    description = ValidXMLTextField(u'description', max_length=500, help_text=_(u'Enter the text that will appear on the focus area project listing page. (500 characters).'))
    image = ImageWithThumbnailsField(
                    _(u'focus area image'),
                    upload_to=image_path,
                    thumbnail={'size': (20, 20), 'options': ('crop', )},
                    help_text=_(u'The image that will appear on the focus area project listing page.'),
                )
    link_to = models.URLField(
        _(u'accordion link'),
        max_length=200,
        blank=True,
        help_text=_(u'Where the link in the accordion for the focus area points if other than the focus area project listing.')
    )

    @models.permalink
    def get_absolute_url(self):
        return ('project_list', (), {'slug': self.slug})

    def projects(self):
        'return all projects that "belong" to the FA through the Categories it links to'
        return Project.objects.filter(categories__in=self.categories.all())

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'focus area'
        verbose_name_plural = u'focus areas'
        ordering = ['name', ]


class Benchmarkname(models.Model):
    name = ValidXMLCharField(_(u'benchmark name'), max_length=80, help_text=_(u'Enter a name for the benchmark. (80 characters).'))
    order = models.IntegerField(_(u'order'), default=0, help_text=_(u'Used to order the benchmarks when displayed. Larger numbers sink to the bottom of the list.'))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['order', 'name', ]
        verbose_name = _(u'benchmark name')
        verbose_name_plural = _(u'benchmark names')


class Category(models.Model):
    name = ValidXMLCharField(
        _(u'category name'), max_length=50, db_index=True,
        help_text=_(u'Enter a name for the category. (50 characters).')
    )
    focus_area = models.ManyToManyField(
        FocusArea, verbose_name=_(u'focus area'), related_name='categories',
        help_text=_(u'Select the Focus area(s) the category belongs to.')
    )
    benchmarknames = models.ManyToManyField(
        Benchmarkname, verbose_name=_(u'benchmark names'),
        blank=True, help_text=_(u'Select the benchmark names for the category.')
    )

    class Meta:
        verbose_name = _(u'category')
        verbose_name_plural = _(u'categories')
        ordering = ['name', ]

    def __unicode__(self):
        return '%s (%s)' % (self.name, self.focus_areas())

    def category_benchmarks_html(self):
        return "<br/>".join([b.name for b in self.benchmarknames.all()])
    category_benchmarks_html.allow_tags = True

    def focus_areas(self):
        return ', '.join([capfirst(area.name) for area in self.focus_area.all()])
    focus_areas.allow_tags = True

    def focus_areas_html(self):
        return '<br/>'.join([capfirst(area.name) for area in self.focus_area.all()])
    focus_areas_html.allow_tags = True


CURRENCY_CHOICES = (
    ('USD', '$'),
    ('EUR', '€'),
)

STATUSES = (
    ('N', _(u'None')),
    ('H', _(u'Needs funding')),
    ('A', _(u'Active')),
    ('C', _(u'Complete')),
    ('L', _(u'Cancelled')),
    ('R', _(u'Archived')),
)
STATUSES_COLORS = {'N': 'black', 'A': '#AFF167', 'H': 'orange', 'C': 'grey', 'R': 'grey', 'L': 'red', }


class MiniCMS(models.Model):
    '''
    A model that holds a bunch of fields for editable text on the home page and the project listing page.
    '''
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/home_page/%(file_name)s')

    label = ValidXMLCharField(u'label', max_length=50, help_text=u'The label is used for identification only', )
    feature_box = ValidXMLTextField(
        u'feature box text', max_length=350,
        help_text=_(dedent(u'''Enter the text that will appear in the feature box of the home page. (350 characters)
            <p>Text should be wrapped in two &lt;div&gt; tags, one outer specifying position and width and an inner for text formatting.</p>
            <p>The outer &lt;div&gt; can use the classes<br/>
            <code>quarter, half, three_quarters and full</code><br/>
            to specify the width of the text and
            <code>bottom and right</code><br/> if a position other than top left is desired.</p>
            <p>
                The inner &lt;div&gt; should have the class <code>text_bg</code> to create the semi-transparent background and any inline styles you want to apply to the text itself.<br/>
                The last &lt;p&gt; can have the class <code>last</code> to make the bottom margin smaller.
            </p>
            <p>&lt;h1&gt;, &lt;h3&gt;, &lt;h5&gt; and &lt;a&gt; tags are yellow while &lt;p&gt; is black by default.</p>
            <p>
                The following classes can be used to give text "Akvo colors":
                <code>green, red, blue, yellow, grey, black, white, lt_grey, link_blue</code>.
            </p>
            <p>Use the <code>serif</code> class to get a serif font (Georgia).</p>'''
        ))
    )
    feature_image = models.ImageField(
        u'feature image', blank=True, upload_to=image_path,
        help_text=u'Ideally the image should be 645x363 pixels in size.'
    )
    top_right_box = ValidXMLTextField(
        u'top right box text', max_length=350,
        help_text=u'Enter the text that will appear in the top right box of the home page. (350 characters)'
    )
    lower_height = models.IntegerField(u'accordion height', default=500,)
    active = models.BooleanField(u'currently active home page', default=False,)

    def __unicode__(self):
        return '%d: %s' % (self.id, self.label)

    class Meta:
        verbose_name = u'MiniCMS'
        verbose_name_plural = u'MiniCMS'
        ordering = ['-active', '-id', ]


class OrganisationsQuerySetManager(QuerySetManager):
    def get_queryset(self):
        return self.model.OrganisationsQuerySet(self.model)


class Keyword(models.Model):
    label = ValidXMLCharField(_(u'label'), max_length=30, unique=True, db_index=True)

    def __unicode__(self):
        return self.label

    class Meta:
        ordering = ('label',)
        verbose_name = _(u'keyword')
        verbose_name_plural = _(u'keywords')


class Project(TimestampsMixin, models.Model):
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/project/%(instance_pk)s/%(file_name)s')

    title = ValidXMLCharField(_(u'title'), max_length=45, db_index=True, help_text=_(u'A short descriptive title for your project (45 characters).'))
    subtitle = ValidXMLCharField(_(u'subtitle'), max_length=75, help_text=_(u'A subtitle with more information on the project (75 characters).'))
    status = ValidXMLCharField(_(u'status'), max_length=1, choices=STATUSES, db_index=True, default='N', help_text=_(u'Current project state.'))
    categories = models.ManyToManyField(Category, verbose_name=_(u'categories'), related_name='projects',)
    partners = models.ManyToManyField(Organisation, verbose_name=_(u'partners'), through=Partnership, related_name='projects',)
    project_plan_summary = ProjectLimitedTextField(_(u'summary of project plan'), max_length=400, help_text=_(u'Briefly summarize the project (400 characters).'))
    current_image = ImageWithThumbnailsField(
                        _(u'project photo'),
                        blank=True,
                        upload_to=image_path,
                        thumbnail={'size': (240, 180), 'options': ('autocrop', 'detail', )},  # detail is a mild sharpen
                        extra_thumbnails={
                            'map_thumb': {'size': (160, 120), 'options': ('autocrop', 'detail', )},  # detail is a mild sharpen
                            'fb_thumb': {'size': (200, 200), 'options': ('pad', )}
                        },
                        help_text=_(u'The project image looks best in landscape format (4:3 width:height ratio), and should be less than 3.5 mb in size.'),
                    )
    current_image_caption = ValidXMLCharField(_(u'photo caption'), blank=True, max_length=50, help_text=_(u'Enter a caption for your project picture (50 characters).'))
    current_image_credit = ValidXMLCharField(_(u'photo credit'), blank=True, max_length=50, help_text=_(u'Enter a credit for your project picture (50 characters).'))
    goals_overview = ProjectLimitedTextField(_(u'overview of goals'), max_length=600, help_text=_(u'Describe what the project hopes to accomplish (600 characters).'))

    current_status = ProjectLimitedTextField(_(u'current status'), blank=True, max_length=600, help_text=_(u'Description of current phase of project. (600 characters).'))
    project_plan = ValidXMLTextField(_(u'project plan'), blank=True, help_text=_(u'Detailed information about the project and plans for implementing: the what, how, who and when. (unlimited).'))
    sustainability = ValidXMLTextField(_(u'sustainability'), help_text=_(u'Describe plans for sustaining/maintaining results after implementation is complete (unlimited).'))
    background = ProjectLimitedTextField(_(u'background'), blank=True, max_length=1000, help_text=_(u'Relevant background information, including geographic, political, environmental, social and/or cultural issues (1000 characters).'))
    target_group = ProjectLimitedTextField(_(u'target group'), blank=True, max_length=600, help_text=_(u'Information about the people, organisations or resources that are being impacted by this project (600 characters).'))

    # project meta info
    language = ValidXMLCharField(max_length=2, choices=settings.LANGUAGES, default='en', help_text=u'The main language of the project')
    project_rating = models.IntegerField(_(u'project rating'), default=0)
    notes = ValidXMLTextField(_(u'notes'), blank=True, default='', help_text=_(u'(Unlimited number of characters).'))
    keywords = models.ManyToManyField(Keyword, verbose_name=_(u'keywords'), related_name='projects', blank=True)

    # budget
    currency = ValidXMLCharField(_(u'currency'), choices=CURRENCY_CHOICES, max_length=3, default='EUR')
    date_request_posted = models.DateField(_(u'start date'), default=date.today)
    date_complete = models.DateField(_(u'date complete'), null=True, blank=True)

    # old_locations = generic.GenericRelation(Location)
    primary_location = models.ForeignKey(ProjectLocation, null=True, on_delete=models.SET_NULL)

    # donate button
    donate_button = models.BooleanField(_(u'donate button'), default=True, help_text=(u'Show donate button for this project.'))

    # synced projects
    sync_owner = models.ForeignKey(Organisation, null=True, on_delete=models.SET_NULL)

    # denormalized data
    # =================
    budget = models.DecimalField(_('project budget'), max_digits=10, decimal_places=2, blank=True, null=True, db_index=True, default=0)
    funds = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_index=True, default=0)
    funds_needed = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_index=True, default=0)

    # Custom manager
    # based on http://www.djangosnippets.org/snippets/562/ and
    # http://simonwillison.net/2008/May/1/orm/
    objects = QuerySetManager()
    organisations = OrganisationsQuerySetManager()

    @models.permalink
    def get_absolute_url(self):
        return ('project_main', (), {'project_id': self.pk})

    def all_donations(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=PAYPAL_INVOICE_STATUS_COMPLETE)

    def public_donations(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=PAYPAL_INVOICE_STATUS_COMPLETE).exclude(is_anonymous=True)

    def all_donations_amount(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=PAYPAL_INVOICE_STATUS_COMPLETE).aggregate(all_donations_sum=Sum('amount'))['all_donations_sum']

    def all_donations_amount_received(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=PAYPAL_INVOICE_STATUS_COMPLETE).aggregate(all_donations_sum=Sum('amount_received'))['all_donations_sum']

    def amount_needed_to_fully_fund_via_paypal(self):
        if self.currency == 'USD':
            PAYPAL_FEE_PCT = getattr(settings, 'PAYPAL_FEE_PCT_USD', 3.9)
            PAYPAL_FEE_BASE = getattr(settings, 'PAYPAL_FEE_BASE_USD', 0.30)
        else:
            PAYPAL_FEE_PCT = getattr(settings, 'PAYPAL_FEE_PCT_EUR', 3.4)
            PAYPAL_FEE_BASE = getattr(settings, 'PAYPAL_FEE_BASE_EUR', 0.35)
        return int(math.ceil(float(self.funds_needed) / (1 - PAYPAL_FEE_PCT/100) + PAYPAL_FEE_BASE))

    def amount_needed_to_fully_fund_via_ideal(self):
        MOLLIE_FEE_BASE = getattr(settings, 'MOLLIE_FEE_BASE', 1.20)
        return int(math.ceil(float(self.funds_needed) + MOLLIE_FEE_BASE))

    def anonymous_donations_amount_received(self):
        amount = Invoice.objects.filter(project__exact=self.id).exclude(is_anonymous=False)
        amount = amount.filter(status__exact=3).aggregate(sum=Sum('amount_received'))['sum']
        return amount or 0

    # New API, de-normalized fields support

    def get_budget(self):
        if 'total' in BudgetItemLabel.objects.filter(budgetitem__project__exact=self):
            return BudgetItem.objects.filter(project__exact=self).filter(label__label='total')[0].amount
        else:
            return BudgetItem.objects.filter(project__exact=self).aggregate(Sum('amount'))['amount__sum'] or 0

    def update_budget(self):
        "Update de-normalized field"
        self.budget = self.get_budget()
        self.save()

    def get_donations(self):
        """ Confirmed donations to the project, after middleman fees"""
        return Invoice.objects.filter(project__exact=self).filter(
            status__exact=PAYPAL_INVOICE_STATUS_COMPLETE
        ).aggregate(Sum('amount_received'))['amount_received__sum'] or 0

    def get_pending_donations(self):
        """ Unconfirmed donations, before middleman fees have been deducted"""
        return Invoice.objects.filter(project__exact=self).filter(
            status__exact=PAYPAL_INVOICE_STATUS_PENDING
        ).aggregate(Sum('amount'))['amount__sum'] or 0

    def get_pledged(self):
        """ How much is pledges by funding organisations"""
        return Partnership.objects.filter(project__exact=self).filter(
            partner_type__exact=Partnership.FUNDING_PARTNER
        ).aggregate(Sum('funding_amount'))['funding_amount__sum'] or 0

    def get_funds(self):
        """ All money given to a project, including pending donations"""
        return self.get_donations() + self.get_pending_donations() + self.get_pledged()

    def update_funds(self):
        "Update de-normalized field"
        self.funds = self.get_funds()
        self.save()

    def get_funds_needed(self):
        """ How much more is needed to fulfill the project's budget needs
            Note that this may be a small negative if there's been an overshooting donation
        """
        return self.get_budget() - self.get_funds()

    def update_funds_needed(self):
        "Update de-normalized field"
        self.funds_needed = self.get_funds_needed()
        self.save()

    # End new API

    @property
    def view_count(self):
        counter = ViewCounter.objects.get_for_object(self)
        return counter.count or 0


    class QuerySet(QuerySet):

        def of_partner(self, organisation):
            "return projects that have organisation as partner"
            return self.filter(partners__exact=organisation)

        def has_location(self):
            return self.filter(primary_location__isnull=False)

        def published(self):
            return self.filter(publishingstatus__status='published')

        def unpublished(self):
            return self.filter(publishingstatus__status='unpublished')

        def status_none(self):
            return self.filter(status__exact='N')

        def status_active(self):
            return self.filter(status__exact='A')

        def status_onhold(self):
            return self.filter(status__exact='H')

        def status_complete(self):
            return self.filter(status__exact='C')

        def status_not_complete(self):
            return self.exclude(status__exact='C')

        def status_cancelled(self):
            return self.filter(status__exact='L')

        def status_not_cancelled(self):
            return self.exclude(status__exact='L')

        def status_archived(self):
            return self.filter(status__exact='R')

        def status_not_archived(self):
            return self.exclude(status__exact='R')

        def active(self):
            """Return projects that are publushed and not cancelled or archived"""
            return self.published().status_not_cancelled().status_not_archived()

        def euros(self):
            return self.filter(currency='EUR')

        def dollars(self):
            return self.filter(currency='USD')

        def donated(self):
            return self.filter(invoice__status=PAYPAL_INVOICE_STATUS_COMPLETE).annotate(donated=Sum('invoice__amount_received'),).distinct()

        # aggregates
        def budget_sum(self):
            ''' aggregates the budgets of all the projects in the QS
                n.b. non-chainable, doesn't return a QS
            '''
            return self.aggregate(budget=Sum('budget'),)['budget'] or 0

        def funds_sum(self):
            ''' aggregates the funds of all the projects in the QS
                n.b. non-chainable, doesn't return a QS
            '''
            return self.aggregate(funds=Sum('funds'),)['funds'] or 0

        def funds_needed_sum(self):
            ''' aggregates the funds of all the projects in the QS
                n.b. non-chainable, doesn't return a QS
            '''
            return self.aggregate(funds_needed=Sum('funds_needed'),)['funds_needed'] or 0

        def get_largest_value_sum(self, benchmarkname, cats=None):
            if cats:
                result = self.filter(  # filter finds largest "benchmarkname" value in benchmarks for categories in cats
                    benchmarks__name__name=benchmarkname,
                    benchmarks__category__name__in=cats
                )
            else:
                result = self.filter(  # filter finds largest "benchmarkname" value in benchmarks for all categories
                    benchmarks__name__name=benchmarkname
                )
            return result.annotate(  # annotate the greatest of the "benchmarkname" values into max_value
                                   max_value=Max('benchmarks__value')).aggregate(  # sum max_value for all projects
                                   Sum('max_value'))['max_value__sum'] or 0  # we want to return 0 instead of an empty QS

        def get_planned_water_calc(self):
            "how many will get improved water"
            return self.status_not_cancelled().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Water']
            ) - self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Water']
            )

        def get_planned_sanitation_calc(self):
            "how many will get improved sanitation"
            return self.status_not_cancelled().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Sanitation']
            ) - self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Sanitation']
            )

        def get_actual_water_calc(self):
            "how many have gotten improved water"
            return self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Water']
            )

        def get_actual_sanitation_calc(self):
            "how many have gotten improved sanitation"
            return self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Sanitation']
            )

        def latest_update_fields(self):
            #used in project_list view
            #cheating slightly, counting on that both id and time are the largest for the latest update
            return self.annotate(latest_update_id=Max('project_updates__id'), latest_update_date=Max('project_updates__created_at'))

        #the following 6 methods return organisation querysets!
        def _partners(self, partner_type=None):
            orgs = Organisation.objects.filter(partnerships__project__in=self)
            if partner_type:
                orgs = orgs.filter(partnerships__partner_type=partner_type)
            return orgs.distinct()

        def field_partners(self):
            return self._partners(Partnership.FIELD_PARTNER)

        def funding_partners(self):
            return self._partners(Partnership.FUNDING_PARTNER)

        def sponsor_partners(self):
            return self._partners(Partnership.SPONSOR_PARTNER)

        def support_partners(self):
            return self._partners(Partnership.SUPPORT_PARTNER)

        def all_partners(self):
                return self._partners()

    def __unicode__(self):
        return u'%s' % self.title

    def updates_desc(self):
        "return ProjectUpdates for self, newest first"
        return self.project_updates.all().order_by('-created_at')

    def latest_update(self):
        """
        for use in the admin
        lists data useful when looking for projects that haven't been updated in a while (or not at all)
        note: it would have been useful to make this column sortable via the admin_order_field attribute, but this results in
        multiple rows shown for the project in the admin change list view and there's no easy way to distinct() them
        TODO: probably this can be solved by customizing ModelAdmin.queryset
        """
        updates = self.updates_desc()
        if updates:
            update = updates[0]
            # date of update shown as link poiting to the update page
            update_info = '<a href="%s">%s</a><br/>' % (update.get_absolute_url(), update.created_at,)
            # if we have an email of the user doing the update, add that as a mailto link
            if update.user.email:
                update_info = '%s<a href="mailto:%s">%s</a><br/><br/>' % (update_info, update.user.email, update.user.email, )
            else:
                update_info = '%s<br/>' % update_info
        else:
            update_info = u'%s<br/><br/>' % (ugettext(u'No update yet'),)
        # links to the project's support partners
        update_info = "%sSP: %s" % (update_info, ", ".join([u'<a href="%s">%s</a>' % (partner.get_absolute_url(), partner.name) for partner in self.support_partners()]))
        # links to the project's field partners
        return "%s<br/>FP: %s" % (update_info, ", ".join([u'<a href="%s">%s</a>' % (partner.get_absolute_url(), partner.name) for partner in self.field_partners()]))

    latest_update.allow_tags = True
    #no go, results in duplicate projects entries in the admin change list
    #latest_update.admin_order_field = 'project_updates__time'

    def show_status(self):
        "Show the current project status"
        return mark_safe("<span style='color: %s;'>%s</span>" % (STATUSES_COLORS[self.status], self.get_status_display()))

    def show_current_image(self):
        try:
            return self.current_image.thumbnail_tag
        except:
            return ''
    show_current_image.allow_tags = True

    def show_keywords(self):
        return rsr_show_keywords(self)
    show_keywords.short_description = 'Keywords'
    show_keywords.allow_tags = True
    show_keywords.admin_order_field = 'keywords'

    def show_map(self):
        try:
            return '<img src="%s" />' % (self.map.url,)
        except:
            return ''
    show_map.allow_tags = True

    def connected_to_user(self, user):
        '''
        Test if a user is connected to self through an organisation
        '''
        is_connected = False
        try:
            is_connected = self in UserProfile.objects.get(user=user).organisation.all_projects()
        except:
            pass
        return is_connected

    def is_published(self):
        if self.publishingstatus:
            return self.publishingstatus.status == 'published'
        return False
    is_published.boolean = True

    def akvopedia_links(self):
        return self.links.filter(kind='A')

    def external_links(self):
        return self.links.filter(kind='E')

    def budget_total(self):
        return Project.objects.budget_total().get(pk=self.pk).budget_total

    def focus_areas(self):
        return FocusArea.objects.filter(categories__in=self.categories.all()).distinct()
    focus_areas.allow_tags = True

    def areas_and_categories(self):
        area_objs = FocusArea.objects.filter(categories__projects__exact=self).distinct().order_by('name')
        areas = []
        for area_obj in area_objs:
            area = {'area': area_obj}
            area['categories'] = []
            for cat_obj in Category.objects.filter(focus_area=area_obj, projects=self).order_by('name'):
                area['categories'] += [cat_obj.name]
            areas += [area]
        return areas

    #shortcuts to linked orgs for a single project
    def _partners(self, partner_type=None):
        """
        Return the partner organisations to the project.
        If partner_type is specified only organisations having that role are returned
        """
        orgs = self.partners.all()
        if partner_type:
            return orgs.filter(partnerships__partner_type=partner_type).distinct()
        else:
            return orgs.distinct()

    def field_partners(self):
        return self._partners(Partnership.FIELD_PARTNER)

    def funding_partners(self):
        return self._partners(Partnership.FUNDING_PARTNER)

    def sponsor_partners(self):
        return self._partners(Partnership.SPONSOR_PARTNER)

    def support_partners(self):
        return self._partners(Partnership.SUPPORT_PARTNER)

    def all_partners(self):
        return self._partners()

    def funding_partnerships(self):
        "Return the Partnership objects associated with the project that have funding information"
        return self.partnerships.filter(partner_type=Partnership.FUNDING_PARTNER)

    def show_status_large(self):
        "Show the current project status with background"
        return mark_safe(
            "<span class='status_large' style='background-color:%s; color:inherit; display:inline-block;'>%s</span>" % (
                STATUSES_COLORS[self.status], self.get_status_display()
            )
        )

    class Meta:
        permissions = (
            ("%s_project" % RSR_LIMITED_CHANGE, u'RSR limited change project'),
        )
        verbose_name = _(u'project')
        verbose_name_plural = _(u'projects')
        ordering = ['-id', ]


class Goal(models.Model):
    project = models.ForeignKey(Project, verbose_name=u'project', related_name='goals')
    text = ValidXMLCharField(_(u'goal'), blank=True, max_length=100, help_text=_(u'(100 characters)'))


class Benchmark(models.Model):
    project = models.ForeignKey(Project, verbose_name=_(u'project'), related_name='benchmarks', )
    category = models.ForeignKey(Category, verbose_name=_(u'category'), )
    name = models.ForeignKey(Benchmarkname, verbose_name=_(u'benchmark name'), )
    value = models.IntegerField(_(u'benchmark value'), )

    def __unicode__(self):
        return _(
            u'Category: %(category)s, Benchmark: %(value)d %(name)s'
        ) % {
            'category': self.category,
            'value': self.value,
            'name': self.name,
        }

    class Meta:
        ordering = ('category__name', 'name__order')
        verbose_name = _(u'benchmark')
        verbose_name_plural = _(u'benchmarks')


class BudgetItemLabel(models.Model):
    label = ValidXMLCharField(_(u'label'), max_length=20, unique=True, db_index=True)

    def __unicode__(self):
        return self.label

    class Meta:
        ordering = ('label',)
        verbose_name = _(u'budget item label')
        verbose_name_plural = _(u'budget item labels')


class BudgetItem(models.Model):
    # DON'T translate. Need model translations for this to work
    OTHER_LABELS = [u'other 1', u'other 2', u'other 3']

    project     = models.ForeignKey(Project, verbose_name=_(u'project'), related_name='budget_items')
    label       = models.ForeignKey(BudgetItemLabel, verbose_name=_(u'label'),)
    other_extra = ValidXMLCharField(
        max_length=20, null=True, blank=True, verbose_name=_(u'"Other" labels extra info'),
        help_text=_(u'Extra information about the exact nature of an "other" budget item.'),
    )
    # Translators: This is the amount of an budget item in a currency (€ or $)
    amount      = models.DecimalField(_(u'amount'), max_digits=10, decimal_places=2,)

    def __unicode__(self):
        return self.label.__unicode__()

    def get_label(self):
        "Needed since we have to have a vanilla __unicode__() method for the admin"
        if self.label.label in self.OTHER_LABELS:
            # display "other" if other_extra is empty. Translating here without translating the other labels seems corny
            return u"other" if self.other_extra is None else self.other_extra.strip()
        else:
            return self.__unicode__()

    class Meta:
        ordering = ('label',)
        verbose_name = _(u'budget item')
        verbose_name_plural = _(u'budget items')
        unique_together = ('project', 'label')
        permissions = (
            ("%s_budget" % RSR_LIMITED_CHANGE, u'RSR limited change budget'),
        )


class PublishingStatus(models.Model):
    """
    Keep track of publishing status. Only for projects now, but possible to
    extend to other object types.
    """
    PUBLISHING_STATUS = (
        ('unpublished', _(u'Unpublished')),
        ('published', _(u'Published')),
    )
    #TODO: change to a generic relation if we want to have publishing stats on
    #other objects than projects
    project = models.OneToOneField(Project,)
    status = ValidXMLCharField(max_length=30, choices=PUBLISHING_STATUS, default='unpublished')

    class Meta:
        verbose_name = _(u'publishing status')
        verbose_name_plural = _(u'publishing statuses')
        ordering = ('-status', 'project')


class Link(models.Model):
    LINK_KINDS = (
        ('A', _(u'Akvopedia entry')),
        ('E', _(u'External link')),
    )
    kind = ValidXMLCharField(_(u'kind'), max_length=1, choices=LINK_KINDS)
    url = models.URLField(_(u'URL'))
    caption = ValidXMLCharField(_(u'caption'), max_length=50)
    project = models.ForeignKey(Project, verbose_name=u'project', related_name='links')

    def __unicode__(self):
        return self.url

    def show_link(self):
        return u'<a href="%s">%s</a>' % (self.url, self.caption,)

    class Meta:
        verbose_name = _(u'link')
        verbose_name_plural = _(u'links')


class UserProfile(models.Model, PermissionBase, WorkflowBase):
    '''
    Extra info about a user.
    '''
    user = models.OneToOneField(User, related_name='userprofile')
    organisation = models.ForeignKey(Organisation)

    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    class Meta:
        verbose_name = _(u'user profile')
        verbose_name_plural = _(u'user profiles')
        ordering = ['user__username', ]

    def __unicode__(self):
        return self.user.username

    def user_name(self):
        return self.__unicode__()

    def organisation_name(self):
        return self.organisation.name

    def updates(self):
        """
        return all updates created by the user
        """
        return ProjectUpdate.objects.filter(user=self.user).order_by('-created_at')

    def latest_update_date(self):
        updates = self.updates()
        if updates:
            return updates[0].created_at
        else:
            return None

    #methods that interact with the User model
    def get_is_active(self):
        return self.user.is_active
    get_is_active.boolean = True  # make pretty icons in the admin list view
    get_is_active.short_description = _(u'user is activated (may log in)')

    def set_is_active(self, set_it):
        self.user.is_active = set_it
        self.user.save()

    def get_is_staff(self):
        return self.user.is_staff
    get_is_staff.boolean = True  # make pretty icons in the admin list view

    def set_is_staff(self, set_it):
        self.user.is_staff = set_it
        self.user.save()

    def get_is_rsr_admin(self):
        return GROUP_RSR_EDITORS in groups_from_user(self.user)

    def get_is_org_admin(self):
        return GROUP_RSR_PARTNER_ADMINS in groups_from_user(self.user)
    get_is_org_admin.boolean = True  # make pretty icons in the admin list view
    get_is_org_admin.short_description = _(u'user is an organisation administrator')

    def set_is_org_admin(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_ADMINS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_ADMINS)

    def get_is_org_editor(self):
        return GROUP_RSR_PARTNER_EDITORS in groups_from_user(self.user)
    get_is_org_editor.boolean = True  # make pretty icons in the admin list view
    get_is_org_editor.short_description = _(u'user is a project editor')

    def set_is_org_editor(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_EDITORS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_EDITORS)

    def _add_user_to_group(self, group_name):
        group = Group.objects.get(name=group_name)
        user = self.user
        if not group in user.groups.all():
            user.groups.add(group)
            user.save()

    def _remove_user_from_group(self, group_name):
        group = Group.objects.get(name=group_name)
        user = self.user
        if group in user.groups.all():
            user.groups.remove(group)
            user.save()

    def my_projects(self):
        return self.organisation.all_projects()

    def allow_edit(self, project):
        """ Support partner organisations may "take ownership" of projects, meaning that editing of them is restricted
        This method is used "on top" of normal checking for user access to projects since it is only relevant for
        Partner users
        """
        allow_edit = True
        partner_admins_allowed = []
        # compile list of support orgs that limit editing
        for partner in project.support_partners():
            if not partner.allow_edit:
                allow_edit = False
                partner_admins_allowed.append(partner)
        # no-one limits editing, all systems go
        if allow_edit:
            return True
        # Only Partner admins on the list of "limiters" list may edit
        else:
            if self.get_is_org_admin() and self.organisation in partner_admins_allowed:
                return True
        return False

    @property
    def api_key(self, key=""):
        try:
            api_key = ApiKey.objects.get(user=self.user)
            key = api_key.key
        except:
            pass
        return key


class ProjectUpdate(TimestampsMixin, models.Model):
    UPDATE_METHODS = (
        ('W', _(u'web')),
        ('E', _(u'e-mail')),
        ('S', _(u'SMS')),
        ('M', _(u'mobile')),
    )


    def image_path(instance, file_name):
        "Create a path like 'db/project/<update.project.id>/update/<update.id>/image_name.ext'"
        path = 'db/project/%d/update/%%(instance_pk)s/%%(file_name)s' % instance.project.pk
        return rsr_image_path(instance, file_name, path)

    project = models.ForeignKey(Project, related_name='project_updates', verbose_name=_(u'project'))
    user = models.ForeignKey(User, verbose_name=_(u'user'))
    title = ValidXMLCharField(_(u'title'), max_length=50, db_index=True, help_text=_(u'50 characters'))
    text = ValidXMLTextField(_(u'text'), blank=True)
    language = ValidXMLCharField(max_length=2, choices=settings.LANGUAGES, default='en', help_text=u'The language of the update')
    #status = ValidXMLCharField(max_length=1, choices=STATUSES, default='N')
    photo = ImageWithThumbnailsField(
        _(u'photo'),
        blank=True,
        upload_to=image_path,
        thumbnail={'size': (300, 225), 'options': ('autocrop', 'sharpen', )},
        help_text=_(u'The image should have 4:3 height:width ratio for best displaying result'),
    )
    photo_caption = ValidXMLCharField(_(u'photo caption'), blank=True, max_length=75, help_text=_(u'75 characters'))
    photo_credit = ValidXMLCharField(_(u'photo credit'), blank=True, max_length=25, help_text=_(u'25 characters'))
    video = models.URLField(_(u'video URL'), blank=True, help_text=_(u'Supported providers: Blip, Vimeo, YouTube'))
    video_caption = ValidXMLCharField(_(u'video caption'), blank=True, max_length=75, help_text=_(u'75 characters'))
    video_credit = ValidXMLCharField(_(u'video credit'), blank=True, max_length=25, help_text=_(u'25 characters'))
    update_method = ValidXMLCharField(_(u'update method'), blank=True, max_length=1, choices=UPDATE_METHODS, db_index=True, default='W')
    user_agent = ValidXMLCharField(_(u'user agent'), blank=True, max_length=200, default='')
    uuid = ValidXMLCharField(_(u'uuid'), blank=True, max_length=40, default='', db_index=True,
        help_text=_(u'Universally unique ID set by creating user agent'))
    
    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    class Meta:
        get_latest_by = "created_at"
        verbose_name = _(u'project update')
        verbose_name_plural = _(u'project updates')
        ordering = ['-id', ]

    def img(self, value=''):
        try:
            return self.photo.thumbnail_tag
        except:
            return value
    img.allow_tags = True

    def get_video_thumbnail_url(self, url=''):
        if self.video:
            try:
                data = oembed.site.embed(self.video).get_data()
                url = data.get('thumbnail_url', '')
            except:
                pass
        return url

    def get_video_oembed(self, html=''):
        """Render OEmbed HTML for the given video URL.
        This is to workaround a but between Django 1.4 and djangoembed template tags.
        A full solution is required."""
        if self.video:
            try:
                data = oembed.site.embed(self.video).get_data()
                html = data.get('html', '')
                # Add 'rel=0' to the video link for not showing related Youtube videos
                if "youtube" in html:
                    html = html.replace("feature=oembed", "feature=oembed&rel=0")
            except:
                pass
        return mark_safe(html)

    def edit_window_has_expired(self):
        """Determine whether or not update timeout window has expired.
        The timeout is controlled by settings.PROJECT_UPDATE_TIMEOUT and
        defaults to 30 minutes.
        """
        return (datetime.now() - self.created_at) > self.edit_timeout

    @property
    def expires_at(self):
        return to_gmt(self.created_at + self.edit_timeout)

    @property
    def edit_timeout(self):
        timeout_minutes = getattr(settings, 'PROJECT_UPDATE_TIMEOUT', 30)
        return timedelta(minutes=timeout_minutes)

    @property
    def edit_time_remaining(self):
        return self.edit_timeout - self.created_at

    @property
    def time_gmt(self):
        return to_gmt(self.created_at)

    @property
    def time_last_updated_gmt(self):
        return to_gmt(self.last_modified_at)

    @property
    def view_count(self):
        counter = ViewCounter.objects.get_for_object(self)
        return counter.count or 0

    @models.permalink
    def get_absolute_url(self):
        return ('update_main', (), {'project_id': self.project.pk, 'update_id': self.pk})

    def __unicode__(self):
        return u'Project update for %(project_name)s' % {'project_name': self.project.title}


class ProjectComment(models.Model):
    project = models.ForeignKey(Project, verbose_name=_(u'project'), related_name='comments')
    user = models.ForeignKey(User, verbose_name=_(u'user'))
    comment = ValidXMLTextField(_(u'comment'))
    time = models.DateTimeField(_(u'time'), db_index=True)

    class Meta:
        verbose_name = _(u'project comment')
        verbose_name_plural = _(u'project comments')
        ordering = ('-id',)


# Payment engines
class PaymentGateway(models.Model):
    name = ValidXMLCharField(max_length=255, help_text=u'Use a short, descriptive name.')
    description = ValidXMLTextField(blank=True)
    currency = ValidXMLCharField(max_length=3, choices=CURRENCY_CHOICES, default='EUR')
    notification_email = models.EmailField(u'notification email',
        help_text=u'When a donation is completed successfully, notification emails will be sent to the donor and to this address.')

    def __unicode__(self):
        return u'%s - %s' % (self.name, self.get_currency_display())

    class Meta:
        abstract = True


class PayPalGateway(PaymentGateway):
    PAYPAL_LOCALE_CHOICES = (
        ('US', u'US English'),
    )
    account_email = models.EmailField()
    locale = ValidXMLCharField(max_length=2, choices=PAYPAL_LOCALE_CHOICES, default='US')

    class Meta:
        verbose_name = u'PayPal gateway'


class MollieGateway(PaymentGateway):
    partner_id = ValidXMLCharField(max_length=10)

    class Meta:
        verbose_name = u'Mollie/iDEAL gateway'


class PaymentGatewaySelector(models.Model):
    project = models.OneToOneField(Project)
    paypal_gateway = models.ForeignKey(PayPalGateway, default=1)
    mollie_gateway = models.ForeignKey(MollieGateway, default=1)

    def __unicode__(self):
        return u'%s - %s' % (self.project.id, self.project.title)

    class Meta:
        verbose_name = u'Project payment gateway configuration'


class InvoiceManager(models.Manager):
    def get_queryset(self):
        """Returns a queryset of all invoices
        Test invoices are excluded in production mode
        """
        if not settings.DONATION_TEST:
            return super(InvoiceManager, self).get_queryset().exclude(test=True)
        else:
            return super(InvoiceManager, self).get_queryset()

    def stale(self):
        """Returns a queryset of invoices which have been pending
        for longer than settings.PAYPAL_INVOICE_TIMEOUT (60 minutes by default)
        """
        timeout = (datetime.now() - timedelta(minutes=getattr(settings, 'PAYPAL_INVOICE_TIMEOUT', 60)))
        qs = self.filter(status=1, time__lte=timeout)
        return qs

    def complete(self):
        """Returns a queryset of invoices which have
        a status of 'Complete'
        """
        qs = self.filter(status=3)
        return qs


class Invoice(models.Model):
    STATUS_CHOICES = (
        (PAYPAL_INVOICE_STATUS_PENDING, 'Pending'),
        (PAYPAL_INVOICE_STATUS_VOID, 'Void'),
        (PAYPAL_INVOICE_STATUS_COMPLETE, 'Complete'),
        (PAYPAL_INVOICE_STATUS_STALE, 'Stale'),
    )
    PAYMENT_ENGINES = (
        ('paypal', u'PayPal'),
        ('ideal', u'iDEAL'),
    )
    # Setup
    test = models.BooleanField(
        u'test donation',
        help_text=u'This flag is set if the donation was made in test mode.',
        default=False)
    engine = ValidXMLCharField(u'payment engine', choices=PAYMENT_ENGINES, max_length=10, default='paypal')
    user = models.ForeignKey(User, blank=True, null=True)
    project = models.ForeignKey(Project, related_name='invoices')
    # Common
    amount = models.PositiveIntegerField(help_text=u'Amount requested by user.')
    amount_received = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=u'Amount actually received after charges have been applied.'
    )
    time = models.DateTimeField(auto_now_add=True)
    name = ValidXMLCharField(max_length=75, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.PositiveSmallIntegerField('status', choices=STATUS_CHOICES, default=1)
    http_referer = ValidXMLCharField(u'HTTP referer', max_length=255, blank=True)
    campaign_code = ValidXMLCharField(u'Campaign code', blank=True, max_length=15)
    is_anonymous = models.BooleanField(u'anonymous donation', default=False)
    # PayPal
    ipn = ValidXMLCharField(u'PayPal IPN', blank=True, null=True, max_length=75)
    # Mollie
    bank = ValidXMLCharField(u'mollie.nl bank ID', max_length=4, choices=get_mollie_banklist(), blank=True)
    transaction_id = ValidXMLCharField(u'mollie.nl transaction ID', max_length=100, blank=True)

    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    admin_objects = models.Manager()
    objects = InvoiceManager()

    def get_favicon(self):
        pass  # TODO: @ grab favicon from HTTP_REFERER site

    @property
    def get_name(self):
        if self.user:
            return self.user.get_full_name()
        return self.name

    @property
    def get_email(self):
        if self.user:
            return self.user.email
        return self.email

    @property
    def currency(self):
        return self.project.currency

    @property
    def gateway(self):
        if self.engine == 'paypal':
            if settings.DONATION_TEST:
                return settings.PAYPAL_SANDBOX_GATEWAY
            else:
                return self.project.paymentgatewayselector.paypal_gateway.account_email
        elif self.engine == 'ideal':
            return self.project.paymentgatewayselector.mollie_gateway.partner_id

    @property
    def locale(self):
        return self.project.paymentgatewayselector.paypal_gateway.locale

    @property
    def notification_email(self):
        if getattr(settings, "DONATION_TEST", False):
            return "test@akvo.org"
        else:
            if self.engine == "paypal":
                return self.project.paymentgatewayselector.paypal_gateway.notification_email
            elif self.engine == "ideal":
                return self.project.paymentgatewayselector.mollie_gateway.notification_email

    @property
    def donation_fee(self):
        return (self.amount - self.amount_received)

    def __unicode__(self):
        return u'Invoice %(invoice_id)s (Project: %(project_name)s)' % {
            'invoice_id': self.id, 'project_name': self.project
        }

    class Meta:
        verbose_name = u'invoice'
        ordering = ['-id', ]


# PayPal IPN listener
def process_paypal_ipn(sender, **kwargs):
    ipn = sender
    if ipn.payment_status == 'Completed':
        invoice = Invoice.objects.get(pk=int(ipn.invoice))
        invoice.amount_received = invoice.amount - ipn.mc_fee
        invoice.ipn = ipn.txn_id
        invoice.status = 3
        invoice.save()
payment_was_flagged.connect(process_paypal_ipn)


class PartnerSite(TimestampsMixin, models.Model):

    def about_image_path(instance, file_name):
        return 'db/partner_sites/%s/image/%s' % (instance.hostname, file_name)

    def custom_css_path(instance, filename):
        return 'db/partner_sites/%s/custom.css' % instance.hostname

    def custom_favicon_path(instance, filename):
        return 'db/partner_sites/%s/favicon.ico' % instance.hostname

    def custom_logo_path(instance, filename):
        return 'db/partner_sites/%s/logo/%s' % (instance.hostname, filename)

    def show_keywords(self):
        return rsr_show_keywords(self)
    show_keywords.short_description = 'Keywords'
    show_keywords.allow_tags = True
    show_keywords.admin_order_field = 'keywords'

    organisation = models.ForeignKey(Organisation, verbose_name=_(u'organisation'),
        help_text=_('Select your organisation from the drop-down list.')
    )
    notes = ValidXMLTextField(verbose_name=u'Akvo partner site notes', blank=True, default='')
    hostname = ValidXMLCharField(_(u'hostname'), max_length=50, unique=True,
        help_text=_(
            u'<p>Your hostname is used in the default web address of your partner site. '
            u'The web address created from  the hostname <em>myorganisation</em> would be '
            u'<em>http://myorganisation.akvoapp.org/</em>.</p>'
        )
    )
    cname = NullCharField(_(u'CNAME'), max_length=100, unique=True, blank=True, null=True,
        help_text=_(
            u'<p>Enter a custom domain name for accessing the partner site, '
            u'for example <i>projects.mydomain.org</i>. Optional. Requires additional DNS setup.</p>'
        )
    )
    custom_return_url = models.URLField(_(u'Return URL'), blank=True,
        help_text=_(
            u'<p>Enter the full URL (including http://) for the page to which users '
            u'should be returned when leaving the partner site.</p>'
        )
    )
    custom_return_url_text = ValidXMLCharField(_(u'Return URL text'), blank=True, max_length=50, default='',
        help_text=_(
            u'<p>Enter a text for the back button and return URL. '
            u'Leave empty to display "Back to <em>myorganisation</em>".</p>'
        )
    )
    custom_css = models.FileField(_(u'stylesheet'), blank=True, upload_to=custom_css_path)
    custom_logo = models.FileField(_(u'organisation banner logo'), blank=True, upload_to=custom_logo_path,
        help_text=_(
            u'<p>Upload a logo file for the banner at the top of the partner site page. '
            u'By default the logo currently used by akvo.org will be displayed.</p>'
        )
    )
    custom_favicon = models.FileField(_(u'favicon'), blank=True, upload_to=custom_favicon_path,
        help_text=_(
            u"<p>A favicon (.ico file) is the 16x16 pixel image shown inside the browser's location bar, "
            u'on tabs and in the bookmark menu.</p>'
        )
    )
    about_box = ValidXMLTextField(_(u'about box text'), max_length=500, blank=True,
        help_text=_(dedent(u'''
            Enter HTML that will make up the top left box of the home page. (500 characters)
            <p>
                Any text added should be wrapped in 2 &lt;div&gt; tags, an outer one specifying position and width
                of the text, and an inner for formatting of the text .
            </p>
            <p>
                The Outer &lt;div&gt; tag can use the classes <code>quarter, half, three_quarters and full</code> to
                specify the
                width of the text. It can use the classes <code>bottom</code> and <code>right</code> to specify a position other than top left.
            </p>
            <p>
                The Inner &lt;div&gt; tag can use the class <code>text_bg</code> to create a semi-transparent text
                background if a background image will be uploaded. Any other inline styles can also be used within the
                inner &lt;div&gt;. The tags &lt;h1&gt;, &lt;h3&gt;, &lt;h5&gt; and &lt;a&gt; are blue, while &lt;p&gt;
                tags are black by default. Use the classes <code>first</code> and <code>last</code> with &lt;p&gt; tags
                to reduce the margins above or below respectively.
            </p>
            <p>
                Add additional styling inline, or upload a .css stylesheet in the Stylesheet setting above.
                <em>Tip:</em> When using a .css file, use the #about_box ID selector to apply a style only to
                the About box.
            </p>
        '''))
    )
    about_image = models.ImageField(_(u'about box image'), blank=True, upload_to=about_image_path,
        help_text=_(u'''<p>The optional background image for the About box
            <em>must</em> be 470 pixels wide and 250 pixels tall.</p>
        ''')
    )

    enabled = models.BooleanField(_(u'enabled'), default=True)
    default_language = ValidXMLCharField(_(u'Site UI default language'),
                                        max_length=5,
                                        choices=settings.LANGUAGES,
                                        default=settings.LANGUAGE_CODE)

    ui_translation = models.BooleanField(_(u'Translate user interface'), default=False)
    google_translation = models.BooleanField(_(u'Google translation widget'), default=False)
    facebook_button = models.BooleanField(_(u'Facebook Like button'), default=False)
    twitter_button = models.BooleanField(_(u'Twitter button'), default=False)
    facebook_app_id = ValidXMLCharField(_(u'Facebook App Id'), max_length=40, blank=True, null=True,
        help_text=_(
            u'<p>Your FaceBook app id is used when sharing pages from your partner site. '
            u'It can be obtained by creating a Facebook app, which will let you monitor when your pages are referenced. '
            u'Follow the instructions <A href="http://help.yahoo.com/l/us/yahoo/smallbusiness/store/edit/social/social-06.html">here</A>'
        )
    )
    partner_projects = models.BooleanField(_(u'Show only projects of partner'), default=True,
                                           help_text=_(u'Uncheck to list all projects on this partnersite.'))
    keywords = models.ManyToManyField(Keyword, verbose_name=_(u'keywords'), related_name='partnersites', blank=True)


    def __unicode__(self):
        return u'Partner site for %(organisation_name)s' % {'organisation_name': self.organisation.name}

    @property
    def logo(self):
        return self.custom_logo or None

    @property
    def return_url(self):
        return self.custom_return_url or self.organisation.url

    @property
    def stylesheet(self):
        return self.custom_css or None

    @property
    def favicon(self):
        return self.custom_favicon or None

    @property
    def full_domain(self):
        return '%s.%s' % (self.hostname, getattr(settings, 'AKVOAPP_DOMAIN', 'akvoapp.org'))

    def get_absolute_url(self):
        url = ''
        # TODO: consider the ramifications of get_absolute_url using CNAME if available
        if self.cname:
            return self.cname

        protocol = 'http'
        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = '%ss' % protocol

        url = '%s://%s/' % (protocol, self.full_domain)
        return url

    class Meta:
        verbose_name = u'partner site'
        verbose_name_plural = u'partner sites'
        ordering = ('organisation__name',)


# signals!
user_activated.connect(user_activated_callback)

post_save.connect(create_organisation_account, sender=Organisation)

post_save.connect(create_publishing_status, sender=Project)
post_save.connect(create_payment_gateway_selector, sender=Project)

if getattr(settings, "DONATION_NOTIFICATION_EMAILS", True):
    post_save.connect(donation_completed, sender=Invoice)

post_save.connect(change_name_of_file_on_create, sender=Organisation)
post_save.connect(change_name_of_file_on_create, sender=Project)
post_save.connect(change_name_of_file_on_create, sender=ProjectUpdate)
post_save.connect(act_on_log_entry, sender=LogEntry)

pre_save.connect(change_name_of_file_on_change, sender=Organisation)
pre_save.connect(change_name_of_file_on_change, sender=Project)
pre_save.connect(change_name_of_file_on_change, sender=ProjectUpdate)

post_save.connect(update_project_budget, sender=BudgetItem)
post_save.connect(update_project_funding, sender=Invoice)
post_save.connect(update_project_funding, sender=Partnership)

post_delete.connect(update_project_budget, sender=BudgetItem)
post_delete.connect(update_project_funding, sender=Invoice)
post_delete.connect(update_project_funding, sender=Partnership)

post_save.connect(create_api_key, sender=UserProfile)
