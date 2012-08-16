# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date, datetime, timedelta
from decimal import Decimal
from textwrap import dedent

import logging
logger = logging.getLogger('akvo.rsr')

import oembed
import re
from moka import List

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Max, Sum
from django.db.models.query import QuerySet
from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Group, User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.contrib.sites.models import Site
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
from permissions.models import Role

from akvo.gateway.models import GatewayNumber, Gateway

from akvo.rsr.fields import LatitudeField, LongitudeField, NullCharField, ProjectLimitedTextField
from akvo.rsr.utils import (
    GROUP_RSR_EDITORS, RSR_LIMITED_CHANGE, GROUP_RSR_PARTNER_ADMINS,
    GROUP_RSR_PARTNER_EDITORS
)
from akvo.rsr.utils import (
    PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_VOID,
    PAYPAL_INVOICE_STATUS_COMPLETE, PAYPAL_INVOICE_STATUS_STALE
)
from akvo.rsr.utils import (
    groups_from_user, rsr_image_path,
    who_am_i, send_now, state_equals, to_gmt
)
from akvo.rsr.signals import (
    change_name_of_file_on_change, change_name_of_file_on_create,
    create_publishing_status, create_organisation_account,
    create_payment_gateway_selector, donation_completed,
    act_on_log_entry, user_activated_callback, update_project_budget,
    update_project_funding
)

from iso3166 import ISO_3166_COUNTRIES, CONTINENTS


#Custom manager
#based on http://www.djangosnippets.org/snippets/562/ and
#http://simonwillison.net/2008/May/1/orm/
class QuerySetManager(models.Manager):
    def get_query_set(self):
        return self.model.QuerySet(self.model)

    def __getattr__(self, attr, *args):
        try:
            return getattr(self.__class__, attr, *args)
        except AttributeError:
            return getattr(self.get_query_set(), attr, *args)

OLD_CONTINENTS = (
    ("1", _(u'Africa')),
    ("2", _(u'Asia')),
    ("3", _(u'Australia')),
    ("4", _(u'Europe')),
    ("5", _(u'North America')),
    ("6", _(u'South America')),
)


def validate_iati_id(iati_id):
    """Validates that the iati_id string follows the guide lines at
    http://iatistandard.org/guides/organisation-data/organisation-identifiers

    For example "SE-FKR-QWERTY" where:
    "SE-FKR" is the namespace code given by IATI supporrt
    "-QWERTY" is the organisations own identifier

    Validation is not very strict since information about the rules where
    not easy to find.

    >>> validate_iati_id("NL-AKV-123")
    >>>

    >>> validate_iati_id("NL-AKV-1234_ALLOWED_CHARACTERS_A-Z_0-9_DASH_UNDERSCORE")
    >>>

    >>> validate_iati_id("")
    Traceback (most recent call last):
        ...
    ValidationError: [u' is not a valid IATI identifier']

    >>> validate_iati_id("nl-fkr-non-caps")
    Traceback (most recent call last):
        ...
    ValidationError: [u'nl-fkr-non-caps is not a valid IATI identifier']

    >>> validate_iati_id("SE-FKR-???")
    Traceback (most recent call last):
        ...
    ValidationError: [u'SE-FKR-??? is not a valid IATI identifier']
    """
    pattern = r'(^[A-Z]{2}\-[A-Z]{3}\-[A-Z0-9_\-]{2,}$)'
    if not re.match(pattern, iati_id):
        raise ValidationError(u'%s is not a valid IATI identifier' % iati_id)


class Country(models.Model):

    name = models.CharField(_(u'country name'), max_length=50, unique=True, db_index=True,)
    iso_code = models.CharField(_(u'ISO 3166 code'), max_length=2, unique=True, choices=ISO_3166_COUNTRIES,)
    continent = models.CharField(_(u'continent name'), max_length=20, db_index=True,)
    continent_code = models.CharField(_(u'continent code'), max_length=2, choices=CONTINENTS,)

#    name = models.CharField(_(u'country name'), max_length=50,)
#    iso_code = models.CharField(_(u'ISO 3166 code'), max_length=2,  choices=ISO_3166_COUNTRIES, null=True, blank=True,)
#    continent = models.CharField(_(u'continent name'), max_length=20, choices=OLD_CONTINENTS, null=True, blank=True)
#    continent_code = models.CharField(_(u'continent code'), max_length=2, choices=CONTINENTS, null=True, blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = _(u'country')
        verbose_name_plural = _(u'countries')
        ordering = ['name']


#class Location(models.Model):
#    _help_text = _(u"Go to <a href='http://itouchmap.com/latlong.html' target='_blank'>iTouchMap.com</a> "
#                   u'to get the decimal coordinates of your project.')
#    latitude = LatitudeField(_(u'latitude'), default=0, help_text=_help_text)
#    longitude = LongitudeField(_(u'longitude'), default=0, help_text=_help_text)
#    city = models.CharField(_(u'city'), blank=True, max_length=255, help_text=_('(255 characters).'))
#    state = models.CharField(_(u'state'), blank=True, max_length=255, help_text=_('(255 characters).'))
#    country = models.ForeignKey(Country, verbose_name=_(u'country'))
#    address_1 = models.CharField(_(u'address 1'), max_length=255, blank=True, help_text=_('(255 characters).'))
#    address_2 = models.CharField(_(u'address 2'), max_length=255, blank=True, help_text=_('(255 characters).'))
#    postcode = models.CharField(_(u'postcode'), max_length=10, blank=True, help_text=_('(10 characters).'))
#    content_type = models.ForeignKey(ContentType)
#    object_id = models.PositiveIntegerField()
#    content_object = generic.GenericForeignKey('content_type', 'object_id')
#    primary = models.BooleanField(_(u'primary location'), default=True)
#
#    def __unicode__(self):
#        return u'%s, %s (%s)' % (self.city, self.state, self.country)
#
#    def save(self, *args, **kwargs):
#        if self.primary:
#            qs = Location.objects.filter(content_type=self.content_type,
#                                         object_id=self.object_id, primary=True)
#            if self.pk:
#                qs = qs.exclude(pk=self.pk)
#                if qs.count() != 0:
#                    self.primary = False
#        super(Location, self).save(*args, **kwargs)
#
#    class Meta:
#        ordering = ['-primary',]


class BaseLocation(models.Model):
    _help_text = _(u"Go to <a href='http://itouchmap.com/latlong.html' target='_blank'>iTouchMap.com</a> "
                   u'to get the decimal coordinates of your project.')
    latitude = LatitudeField(_(u'latitude'), default=0, help_text=_help_text)
    longitude = LongitudeField(_(u'longitude'), default=0, help_text=_help_text)
    city = models.CharField(_(u'city'), blank=True, max_length=255, help_text=_('(255 characters).'))
    state = models.CharField(_(u'state'), blank=True, max_length=255, help_text=_('(255 characters).'))
    country = models.ForeignKey(Country, verbose_name=_(u'country'))
    address_1 = models.CharField(_(u'address 1'), max_length=255, blank=True, help_text=_('(255 characters).'))
    address_2 = models.CharField(_(u'address 2'), max_length=255, blank=True, help_text=_('(255 characters).'))
    postcode = models.CharField(_(u'postcode'), max_length=10, blank=True, help_text=_('(10 characters).'))
    primary = models.BooleanField(_(u'primary location'), default=True)

    def __unicode__(self):
        return u'%s, %s (%s)' % (self.city, self.state, self.country)

    def save(self, *args, **kwargs):
        super(BaseLocation, self).save(*args, **kwargs)
        if self.primary:
            location_target = self.location_target
            # this is probably redundant since the admin form saving should handle this
            # but if we ever save a location from other code it's an extra safety
            location_target.locations.exclude(pk__exact=self.pk).update(primary=False)
            location_target.primary_location = self
            location_target.save()

    class Meta:
        abstract = True
        ordering = ['-primary', ]


class OrganisationLocation(BaseLocation):
    # the organisation that's related to this location
    location_target = models.ForeignKey('Organisation', null=True, related_name='locations')


class ProjectLocation(BaseLocation):
    # the project that's related to this location
    location_target = models.ForeignKey('Project', null=True, related_name='locations')


class Partnership(models.Model):
    FIELD_PARTNER = u'field'
    FUNDING_PARTNER = u'funding'
    SPONSOR_PARTNER = u'sponsor'
    SUPPORT_PARTNER = u'support'

    PARTNER_TYPE_LIST = [FIELD_PARTNER, FUNDING_PARTNER, SPONSOR_PARTNER, SUPPORT_PARTNER, ]
    PARTNER_LABELS = [_(u'Field partner'), _(u'Funding partner'), _(u'Sponsor partner'), _(u'Support partner'), ]
    PARTNER_TYPES = zip(PARTNER_TYPE_LIST, PARTNER_LABELS)

    organisation = models.ForeignKey('Organisation', verbose_name=_(u'organisation'))
    project = models.ForeignKey('Project', verbose_name=_(u'project'),)
    partner_type = models.CharField(_(u'partner type'), max_length=8, choices=PARTNER_TYPES,)
    funding_amount = models.DecimalField(
        _(u'funding amount'),
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    iati_id = models.CharField(_(u'IATI ID'),
        max_length=75,
        blank=True,
        null=True,
        help_text=_(u'IATI ID format e.g. have to start with the following format "SE-FKR-"'),
        validators=[validate_iati_id])

    class Meta:
        verbose_name = _(u'project partner')
        verbose_name_plural = _(u'project partners')
        ordering = ['partner_type']

    def __unicode__(self):
        return self.organisation.name


class ProjectsQuerySetManager(QuerySetManager):
    def get_query_set(self):
        return self.model.ProjectsQuerySet(self.model)


class Organisation(models.Model):
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

    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/org/%(instance_pk)s/%(file_name)s')

    #type = models.CharField(max_length=1, choices=PARNER_TYPES)
#    field_partner = models.BooleanField(_(u'field partner'))
#    support_partner = models.BooleanField(_(u'support partner'))
#    funding_partner = models.BooleanField(_(u'funding partner'))
#    sponsor_partner = models.BooleanField(_(u'sponsor partner'))

    name = models.CharField(_(u'name'), max_length=25, help_text=_(u'Short name which will appear in organisation and partner listings (25 characters).'))
    long_name = models.CharField(_(u'long name'), blank=True, max_length=75, help_text=_(u'Full name of organisation (75 characters).'))
    organisation_type = models.CharField(_(u'organisation type'), max_length=1, choices=ORG_TYPES)
    iati_id = models.CharField(_(u'IATI ID'),
        max_length=75,
        blank=True,
        null=True,
        help_text=_(u'IATI ID format e.g. have to start with the following format "SE-FKR-"'),
        validators=[validate_iati_id]
        )

    logo = ImageWithThumbnailsField(_(u'logo'),
                                    blank=True,
                                    upload_to=image_path,
                                    thumbnail={'size': (360, 270)},
                                    help_text=_(u'Logos should be approximately 360x270 pixels (approx. 100-200kB in size) on a white background.'),
                                   )

    url = models.URLField(blank=True, verify_exists=False, help_text=_(u'Enter the full address of your web site, beginning with http://.'))

    phone = models.CharField(_(u'phone'), blank=True, max_length=20, help_text=_(u'(20 characters).'))
    mobile = models.CharField(_(u'mobile'), blank=True, max_length=20, help_text=_(u'(20 characters).'))
    fax = models.CharField(_(u'fax'), blank=True, max_length=20, help_text=_(u'(20 characters).'))
    contact_person = models.CharField(_(u'contact person'), blank=True, max_length=30, help_text=_(u'Name of external contact person for your organisation (30 characters).'))
    contact_email = models.CharField(_(u'contact email'), blank=True, max_length=50, help_text=_(u'Email to which inquiries about your organisation should be sent (50 characters).'))
    description = models.TextField(_(u'description'), blank=True, help_text=_(u'Describe your organisation.'))

    # old_locations = generic.GenericRelation(Location)
    primary_location = models.ForeignKey('OrganisationLocation', null=True, on_delete=models.SET_NULL)

    # Managers, one default, one custom
    # objects = models.Manager()
    objects = QuerySetManager()
    # projects = ProjectsQuerySetManager()

    @models.permalink
    def get_absolute_url(self):
        return ('organisation_main', (), {'org_id': self.pk})

    # @property
    # def primary_location(self):
    #     '''Returns an organisations's primary location'''
    #     qs = self.locations.filter(primary=True)
    #     qs = qs.exclude(latitude=0, longitude=0)
    #     if qs:
    #         location = qs[0]
    #         return location
    #     return

    class QuerySet(QuerySet):
        def has_location(self):
            return self.filter(primary_location__isnull=False)

        def partners(self, partner_type):
            "return the organisations in the queryset that are partners of type partner_type"
            return self.filter(partnership__partner_type__exact=partner_type).distinct()

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
        return self.partnership_set.filter(partner_type__exact=partner_type).count() > 0

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

    # New API

    def euros_pledged(self):
        "How much € the organisation has pledged to projects it is a partner to"
        return self.active_projects().euros().filter(
            partnership__organisation__exact=self, partnership__partner_type__exact=Partnership.FUNDING_PARTNER
        ).aggregate(
            euros_pledged=Sum('partnership__funding_amount')
        )['euros_pledged'] or 0

    def dollars_pledged(self):
        "How much $ the organisation has pledged to projects"
        return self.active_projects().dollars().filter(
            partnership__organisation__exact=self, partnership__partner_type__exact=Partnership.FUNDING_PARTNER
        ).aggregate(
            dollars_pledged=Sum('partnership__funding_amount')
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


class OrganisationAccount(models.Model):
    """
    This model keps track of organisation account levels and other relevant data.
    The reason for having this in a separate model form Organisation is to hide
    it from the org admins.
    """
    ACCOUNT_LEVEL = (
        ('free', u'Free'),
        ('plus', u'Plus'),
        ('premium', u'Premium'),
    )
    organisation    = models.OneToOneField(Organisation, verbose_name=u'organisation', primary_key=True)
    account_level   = models.CharField(u'account level', max_length=12, choices=ACCOUNT_LEVEL, default='free')

    class Meta:
        verbose_name = u'organisation account'
        verbose_name_plural = u'organisation accounts'


class FocusArea(models.Model):
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/focus_area/%(file_name)s')
    name        = models.CharField(u'focus area name', max_length=50, help_text=_(u'The name of the focus area. This will show as the title of the focus area project listing page. (30 characters).'))
    slug        = models.SlugField(u'slug', max_length=50, help_text=_(u'Enter the "slug" i.e. a short word or hyphenated-words. This will be used in the URL of the focus area project listing page. (20 characters, only lower case letters, numbers, hyphen and underscore allowed.).'))
    description = models.TextField(u'description', max_length=500, help_text=_(u'Enter the text that will appear on the focus area project listing page. (500 characters).'))
    image       = ImageWithThumbnailsField(
                    _(u'focus area image'),
                    upload_to=image_path,
                    thumbnail={'size': (20, 20), 'options': ('crop', )},
                    help_text=_(u'The image that will appear on the focus area project listing page.'),
                )
    link_to     = models.URLField(_(u'accordion link'), max_length=200, blank=True, help_text=_(u'Where the link in the accordion for the focus area points if other than the focus area project listing.'))

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
        ordering = ['name',]


class Benchmarkname(models.Model):
    name    = models.CharField(_(u'benchmark name'), max_length=50, help_text=_(u'Enter a name for the benchmark. (50 characters).'))
    order   = models.IntegerField(_(u'order'), default=0, help_text=_(u'Used to order the benchmarks when displayed. Larger numbers sink to the bottom of the list.'))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['order', 'name',]
        verbose_name = _(u'benchmark name')
        verbose_name_plural = _(u'benchmark names')


class Category(models.Model):
    #def image_path(instance, file_name):
    #    return rsr_image_path(instance, file_name, 'db/category/%(file_name)s')

    name = models.CharField(_(u'category name'), max_length=50, help_text=_(u'Enter a name for the category. (50 characters).'))
    #icon                    = ImageWithThumbnailsField(
    #                            _('category icon'),
    #                            blank=True,
    #                            upload_to=image_path,
    #                            thumbnail={'size': (20, 20), 'options': ('crop', )},
    #                            help_text=_('Icon size must 20 pixels square, preferably a .png or .gif'),
    #                        )
    focus_area = models.ManyToManyField(FocusArea, verbose_name=_(u'focus area'), related_name='categories', help_text=_(u'Select the Focus area(s) the category belongs to.'), )
    benchmarknames = models.ManyToManyField(Benchmarkname, verbose_name=_(u'benchmark names'), blank=True, help_text=_(u'Select the benchmark names for the category.'), )

    class Meta:
        verbose_name=_(u'category')
        verbose_name_plural=_(u'categories')
        ordering = ['name',]

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
STATUSES_COLORS = {'N':'black', 'A':'#AFF167', 'H':'orange', 'C':'grey', 'R':'grey', 'L':'red', }


class MiniCMS(models.Model):
    '''
    A model that holds a bunch of fields for editable text on the home page and the project listing page.
    '''
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/home_page/%(file_name)s')

    label = models.CharField(u'label', max_length=50, help_text=u'The label is used for identification only', )
    feature_box = models.TextField(
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
    top_right_box = models.TextField(
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
    def get_query_set(self):
        return self.model.OrganisationsQuerySet(self.model)


class Project(models.Model):
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/project/%(instance_pk)s/%(file_name)s')

    title = models.CharField(_(u'title'), max_length=45, help_text=_(u'A short descriptive title for your project (45 characters).'))
    subtitle = models.CharField(_(u'subtitle'), max_length=75, help_text=_(u'A subtitle with more information on the project (75 characters).'))
    status = models.CharField(_(u'status'), max_length=1, choices=STATUSES, default='N', help_text=_(u'Current project state.'))
    categories = models.ManyToManyField(Category, verbose_name=_(u'categories'), related_name='projects',)
    partners = models.ManyToManyField(Organisation, verbose_name=_(u'partners'), through=Partnership, related_name='projects',)
    project_plan_summary = ProjectLimitedTextField(_(u'summary of project plan'), max_length=400, help_text=_(u'Briefly summarize the project (400 characters).'))
    current_image = ImageWithThumbnailsField(
                        _(u'project photo'),
                        blank=True,
                        upload_to=image_path,
                        thumbnail={'size': (240, 180), 'options': ('autocrop', 'detail', )},  # detail is a mild sharpen
                        help_text=_(u'The project image looks best in landscape format (4:3 width:height ratio), and should be less than 3.5 mb in size.'),
                    )
    current_image_caption = models.CharField(_(u'photo caption'), blank=True, max_length=50, help_text=_(u'Enter a caption for your project picture (50 characters).'))
    goals_overview = ProjectLimitedTextField(_(u'overview of goals'), max_length=600, help_text=_(u'Describe what the project hopes to accomplish (600 characters).'))

    # goal_1 = models.CharField(_('goal 1'), blank=True, max_length=60, help_text=_('(60 characters)'))
    # goal_2 = models.CharField(_('goal 2'), blank=True, max_length=60)
    # goal_3 = models.CharField(_('goal 3'), blank=True, max_length=60)
    # goal_4 = models.CharField(_('goal 4'), blank=True, max_length=60)
    # goal_5 = models.CharField(_('goal 5'), blank=True, max_length=60)

    current_status = ProjectLimitedTextField(_(u'current status'), blank=True, max_length=600, help_text=_(u'Description of current phase of project. (600 characters).'))
    project_plan = models.TextField(_(u'project plan'), blank=True, help_text=_(u'Detailed information about the project and plans for implementing: the what, how, who and when. (unlimited).'))
    sustainability = models.TextField(_(u'sustainability'), help_text=_(u'Describe plans for sustaining/maintaining results after implementation is complete (unlimited).'))
    background = ProjectLimitedTextField(_(u'background'), blank=True, max_length=1000, help_text=_(u'Relevant background information, including geographic, political, environmental, social and/or cultural issues (1000 characters).'))

    project_rating = models.IntegerField(_(u'project rating'), default=0)
    notes = models.TextField(_(u'notes'), blank=True, help_text=_(u'(Unlimited number of characters).'))

    # budget
    currency = models.CharField(_(u'currency'), choices=CURRENCY_CHOICES, max_length=3, default='EUR')
    date_request_posted = models.DateField(_(u'date request posted'), default=date.today)
    date_complete = models.DateField(_(u'date complete'), null=True, blank=True)

    # old_locations = generic.GenericRelation(Location)
    primary_location = models.ForeignKey(ProjectLocation, null=True, on_delete=models.SET_NULL)

    # denormalized data
    # =================
    budget = models.DecimalField(_('project budget'), max_digits=10, decimal_places=2, blank=True, null=True, default=0)
    funds = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0)
    funds_needed = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0)

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

    def anonymous_donations_amount_received(self):
        amount = Invoice.objects.filter(project__exact=self.id).exclude(is_anonymous=False)
        amount = amount.filter(status__exact=3).aggregate(sum=Sum('amount_received'))['sum']
        return amount or 0

    # New API, de-normalized fields support

    def get_budget(self):
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

#    @property
#    def primary_location(self, location=None):
#        '''Return a project's primary location'''
#        qs = self.locations.filter(primary=True)
#        qs = qs.exclude(latitude=0, longitude=0)
#        if qs:
#            location = qs[0]
#            return location
#        return

    class QuerySet(QuerySet):

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

        #
        def budget(self):
            ''' aggregates the budgets of all the projects in the QS
                n.b. non-chainable, doesn't return a QS
            '''
            return self.aggregate(budget=Sum('budget'),)

#        def pledged(self, org=None):
#            if org:
#                self.filter(funding_organisation__exact=org)
#            return self.annotate(pledged=Sum('fundingpartner__funding_amount'),)

#        def funding(self, organisation=None):
#            '''create extra columns "funds_needed", "pledged" and "donated"
#            that calculate the respective values for each project in the queryset
#            '''
#            funding_queries = {
#                #how much money does the project need to be fully funded, given that all pending donations complete
#                'funds_needed':
#                    ''' (SELECT DISTINCT (
#                            SELECT CASE
#                                WHEN Sum(amount) IS NULL THEN 0
#                                ELSE Sum(amount)
#                            END
#                            FROM  rsr_budgetitem
#                            WHERE rsr_budgetitem.project_id = rsr_project.id
#                        ) - (
#                            SELECT CASE
#                                WHEN Sum(funding_amount) IS NULL THEN 0
#                                ELSE Sum(funding_amount)
#                            END
#                            FROM  rsr_partnership
#                            WHERE rsr_partnership.project_id = rsr_project.id
#                            AND   rsr_partnership.partner_type = '%s'
#                        ) - (
#                            SELECT CASE
#                                WHEN Sum(amount) IS NULL THEN 0
#                                ELSE Sum(amount)
#                            END
#                            FROM  rsr_invoice
#                            WHERE rsr_invoice.project_id = rsr_project.id
#                            AND   rsr_invoice.status = %d
#                        ) - (
#                            SELECT CASE
#                                WHEN Sum(amount_received) IS NULL THEN 0
#                                ELSE Sum(amount_received)
#                            END
#                            FROM  rsr_invoice
#                            WHERE rsr_invoice.project_id = rsr_project.id
#                            AND   rsr_invoice.status = %d
#                        ))
#                        ''' % (
#                            Partnership.FUNDING_PARTNER,
#                            PAYPAL_INVOICE_STATUS_PENDING,
#                            PAYPAL_INVOICE_STATUS_COMPLETE
#                        ),
#                    #how much money has been donated by individual donors, including pending donations
#                    'donated':
#                        ''' (SELECT DISTINCT (
#                                SELECT CASE
#                                    WHEN Sum(amount) IS NULL THEN 0
#                                    ELSE Sum(amount)
#                                END
#                                FROM rsr_invoice
#                                WHERE rsr_invoice.project_id = rsr_project.id
#                                AND rsr_invoice.status = %d
#                            ) + (
#                                SELECT CASE
#                                    WHEN Sum(amount_received) IS NULL THEN 0
#                                    ELSE Sum(amount_received)
#                                END
#                                FROM rsr_invoice
#                                WHERE rsr_invoice.project_id = rsr_project.id
#                                AND rsr_invoice.status = %d
#                            ))
#                        ''' % (PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_COMPLETE),
#                    #how much donated money from individuals is pending
#                    'pending':
#                        ''' (SELECT CASE
#                                WHEN Sum(amount) IS NULL THEN 0
#                                ELSE Sum(amount)
#                            END
#                            FROM rsr_invoice
#                            WHERE rsr_invoice.project_id = rsr_project.id
#                                AND rsr_invoice.status = %d
#                            )
#                        ''' % PAYPAL_INVOICE_STATUS_PENDING,
#                    #the total budget for the project as per the budgetitems
#                    'total_budget':
#                        ''' (SELECT CASE
#                                WHEN SUM(amount) IS NULL THEN 0
#                                ELSE SUM(amount)
#                            END
#                            FROM rsr_budgetitem
#                            WHERE rsr_budgetitem.project_id = rsr_project.id)
#                        ''',
#                }
#                #how much has been pledged by organisations. if an org param is supplied
#                #this is modified to show huw much _that_ org has pledged to each project
#            pledged = {
#                'pledged':
#                    ''' (SELECT CASE
#                            WHEN Sum(funding_amount) IS NULL THEN 0
#                            ELSE Sum(funding_amount)
#                        END
#                        FROM rsr_partnership
#                        WHERE rsr_partnership.project_id = rsr_project.id
#                        AND   rsr_partnership.partner_type = '%s'
#                    ''' % (Partnership.FUNDING_PARTNER,)
#            }
#            if organisation:
#                pledged['pledged'] = '''%s
#                    AND rsr_partnership.organisation_id = %d''' % (
#                        pledged['pledged'], organisation.pk
#                    )
#            pledged['pledged'] = "%s)" % pledged['pledged']
#            funding_queries.update(pledged)
#            return self.extra(select=funding_queries)

#        def need_funding(self):
#            "projects that projects need funding"
#            #this hack is needed because mysql doesn't allow WHERE clause to refer to a calculated column, in this case funds_needed
#            #so instead we order by funds_needed and create a list of pk:s from all projects with funds_needed > 0 and filter on those
#            return self.filter(pk__in=[pk for pk, fn in self.funding().extra(order_by=['-funds_needed']).values_list('pk', 'funds_needed') if fn > 0])

#        def need_funding_count(self):
#            "how many projects need funding"
#            return len(self.need_funding())
#
#        def total_funds_needed(self):
#            "how much money the projects still need"
#            return qs_column_sum(self.funding(), 'funds_needed')
#
#        def total_total_budget(self):
#            "how much money the projects still need"
#            return qs_column_sum(self.funding(), 'total_budget')
#
#        def total_pledged(self, org=None):
#            '''
#            how much money has been commited to the projects
#            if org is supplied, only money pledeg by that org is calculated
#            '''
#            return qs_column_sum(self.funding(org), 'pledged')
#
#        def total_donated(self):
#            "how much money has bee donated by individuals"
#            return qs_column_sum(self.funding(), 'donated')
#
#        def total_pending(self):
#            "individual donations still pending"
#            return qs_column_sum(self.funding(), 'pending')
#
#        def total_pending_negative(self):
#            "individual donations still pending NEGATIVE (used by akvo at a glance)"
#            return -qs_column_sum(self.funding(), 'pending')

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
            return self.annotate(latest_update_id=Max('project_updates__id'), latest_update_date=Max('project_updates__time'))

        #the following 6 methods return organisation querysets!
        def _partners(self, partner_type=None):
            orgs = Organisation.objects.filter(partnership__project__in=self)
            if partner_type:
                orgs = orgs.filter(partnership__partner_type=partner_type)
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
        return self.project_updates.all().order_by('-time')

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
            update_info = '<a href="%s">%s</a><br/>' % (update.get_absolute_url(), update.time,)
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
            is_connected = self in UserProfile.objects.get(user=user).organisation.published_projects()
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

#    #shortcuts to funding/budget data for a single project
#    def funding_pledged(self, organisation=None):
#        return Project.objects.funding(organisation).get(pk=self.pk).pledged
#
#    def funding_donated(self):
#        return Project.objects.funding().get(pk=self.pk).donated
#
#    def funding_total_given(self):
#        # Decimal(str(result)) conversion is necessary
#        # because SQLite doesn't handle decimals natively
#        # See item 16 here: http://www.sqlite.org/faq.html
#        # MySQL and PostgreSQL are not affected by this limitation
#        result = self.funding_pledged() + self.funding_donated()
#        decimal_result = Decimal(str(result))
#        return decimal_result
#
#    def funding_still_needed(self):
#        result =  Project.objects.funding().get(pk=self.pk).funds_needed
#        decimal_result = Decimal(str(result))
#        return decimal_result

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
            return orgs.filter(partnership__partner_type=partner_type).distinct()
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

    def all_partnerships(self):
        return self.partnership_set.all().order_by('organisation')

    def funding_partner_info(self):
        "Return the Partnership objects associated with the project that have funding information"
        return self.partnership_set.filter(partner_type=Partnership.FUNDING_PARTNER)

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
    text = models.CharField(_(u'goal'), blank=True, max_length=100, help_text=_(u'(100 characters)'))


class Benchmark(models.Model):
    project = models.ForeignKey(Project, verbose_name=_(u'project'), related_name=_(u'benchmarks'), )
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
    label = models.CharField(_(u'label'), max_length=20, unique=True)

    def __unicode__(self):
        return self.label

    class Meta:
        ordering = ('label',)
        verbose_name = _(u'budget item label')
        verbose_name_plural = _(u'budget item labels')


class BudgetItem(models.Model):
    # DON'T translate. Need model translations for this to work
    OTHER_LABELS = [u'other 1', u'other 2', u'other 3']

    project = models.ForeignKey(Project, verbose_name=_(u'project'), related_name='budget_items')
    label = models.ForeignKey(BudgetItemLabel, verbose_name=_(u'label'),)
    other_extra = models.CharField(
        max_length=20, null=True, blank=True, verbose_name=_(u'"Other" labels extra info'),
        help_text=_(u'Extra information about the exact nature of an "other" budget item.'),
    )
    # Translators: This is the amount of an budget item in a currancy (€ or $)
    amount = models.DecimalField(_(u'amount'), max_digits=10, decimal_places=2,)

    def __unicode__(self):
        return self.label.__unicode__()

    def get_label(self):
        "Needed since we have to have a vanilla __unicode__() method for the admin"
        if self.label.label in self.OTHER_LABELS:
            # display "other" if other_extra is empty. Translating here without translating the other labels seems corny
            return self.other_extra.strip() or u"other"
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
    status = models.CharField(max_length=30, choices=PUBLISHING_STATUS, default='unpublished')

    class Meta:
        verbose_name = _(u'publishing status')
        verbose_name_plural = _(u'publishing statuses')
        ordering = ('-status', 'project')

    def project_info(self):
        return self.project


class Link(models.Model):
    LINK_KINDS = (
        ('A', _(u'Akvopedia entry')),
        ('E', _(u'External link')),
    )
    kind = models.CharField(_(u'kind'), max_length=1, choices=LINK_KINDS)
    url = models.URLField(_(u'URL'))
    caption = models.CharField(_(u'caption'), max_length=50)
    project = models.ForeignKey(Project, verbose_name=u'project', related_name='links')

    def __unicode__(self):
        return self.url

    def show_link(self):
        return u'<a href="%s">%s</a>' % (self.url, self.caption,)

    class Meta:
        verbose_name = _(u'link')
        verbose_name_plural = _(u'links')


PHOTO_LOCATIONS = (
    ('B', _(u'At the beginning of the update')),
    ('E', _(u'At the end of the update')),
)
UPDATE_METHODS = (
    ('W', _(u'web')),
    ('E', _(u'e-mail')),
    ('S', _(u'SMS')),
)


class UserProfileManager(models.Manager):
    def process_sms(self, mo_sms):
        try:
            profile = self.get(phone_number__exact=mo_sms.sender)  # ??? reporter instead ???
            #state = get_state(profile)
            #if state:
            if state_equals(profile, profile.STATE_PHONE_NUMBER_ADDED):
                logger.debug("%s: state is %s." % (who_am_i(), profile.STATE_PHONE_NUMBER_ADDED))
                # look for validation code
                if profile.validation == mo_sms.message.strip().upper():
                    profile.confirm_validation(mo_sms)
                else:
                    logger.error('Error in UserProfileManager.process_sms: "%s" is not the correct validation code expected "%s". Locals:\n %s\n\n' % (mo_sms.message, profile.validation, locals()))
            #elif state_equals(profile, profile.STATE_PHONE_NUMBER_VALIDATED):
            #    # we shouldn't be here...phone ok, but no project selected :(
            #    logger.error('Error in UserProfileManager.process_sms: workflow in state "%s" meaning phone is validated, but no project has been selected. Locals:\n %s\n\n' % (profile.STATE_PHONE_NUMBER_VALIDATED, locals()))
            elif state_equals(profile, profile.STATE_UPDATES_ENABLED):
                logger.debug("%s: state is %s." % (who_am_i(), profile.STATE_UPDATES_ENABLED))
                # time to make an SMS update!
                try:
                    reporter = profile.reporters.get(gw_number=GatewayNumber.objects.get(number=mo_sms.receiver))
                    reporter.create_sms_update(mo_sms)
                except Exception, e:
                    logger.error("Error in UserProfileManager.process_sms: %s. Locals:\n %s\n\n" % (e.message, locals()))
            else:
                logger.error('Error in UserProfileManager.process_sms: workflow disabled or in an unknown state. Locals:\n %s\n\n' % (locals()))
        except Exception, e:
            logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), ))


class UserProfile(models.Model, PermissionBase, WorkflowBase):
    '''
    Extra info about a user.
    '''
    user = models.OneToOneField(User)
    organisation = models.ForeignKey(Organisation)
    phone_number = models.CharField(max_length=50, blank=True)  # TODO: check uniqueness if non-empty
    validation = models.CharField(_('validation code'), max_length=20, blank=True)

    objects = UserProfileManager()

    # "constants" for use with SMS updating workflow
    VALIDATED = u'IS_VALID' # _ in IS_VALID guarantees validation code will never be generated to equal VALIDATED
    WORKFLOW_SMS_UPDATE = u'SMS update' #Name of workflow for SMS updating
    STATE_PHONE_NUMBER_ADDED = u'Phone number added' #Phone number has been added to the profile
    #STATE_PHONE_NUMBER_VALIDATED = u'Phone number validated' #The phone has been validated with a validation code SMS
    STATE_UPDATES_ENABLED = u'Updates enabled' #The phone is enabled, registered reporters will create updates on respective project
    STATE_PHONE_DISABLED = u'Phone disabled' #The phone is disabled, preventing the processing of incoming SMSs
    TRANSITION_ADD_PHONE_NUMBER = u'Add phone number'
    TRANSITION_VALIDATE_PHONE_NUMBER = u'Validate phone number'
    TRANSITION_ENABLE_UPDATING = u'Enable updating'
    TRANSITION_DISABLE_UPDATING = u'Disable updating'
    GROUP_SMS_UPDATER = u'SMS updater'
    GROUP_SMS_MANAGER = u'SMS manager'
    ROLE_SMS_UPDATER = u'SMS updater'
    ROLE_SMS_MANAGER = u'SMS manager'
    PERMISSION_ADD_SMS_UPDATES = 'add_sms_updates'
    PERMISSION_MANAGE_SMS_UPDATES = 'manage_sms_updates'
    GATEWAY_42IT = '42it'

    class Meta:
        verbose_name = _(u'user profile')
        verbose_name_plural = _(u'user profiles')
        ordering = ['user__username',]

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
        return ProjectUpdate.objects.filter(user=self.user).order_by('-time')

    def latest_update_date(self):
        updates = self.updates()
        if updates:
            return updates[0].time
        else:
            return None

    #methods that insteract with the User model
    def get_is_active(self):
        return self.user.is_active
    get_is_active.boolean = True #make pretty icons in the admin list view
    get_is_active.short_description = _(u'user is activated (may log in)')

    def set_is_active(self, set_it):
        self.user.is_active = set_it
        self.user.save()

    def get_is_staff(self):
        return self.user.is_staff
    get_is_staff.boolean = True #make pretty icons in the admin list view

    def set_is_staff(self, set_it):
        self.user.is_staff = set_it
        self.user.save()

    def get_is_rsr_admin(self):
        return GROUP_RSR_EDITORS in groups_from_user(self.user)

    def get_is_org_admin(self):
        return GROUP_RSR_PARTNER_ADMINS in groups_from_user(self.user)
    get_is_org_admin.boolean = True #make pretty icons in the admin list view
    get_is_org_admin.short_description = _(u'user is an organisation administrator')

    def set_is_org_admin(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_ADMINS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_ADMINS)

    def get_is_org_editor(self):
        return GROUP_RSR_PARTNER_EDITORS in groups_from_user(self.user)
    get_is_org_editor.boolean = True #make pretty icons in the admin list view
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

    def my_unreported_projects(self):
        """
        Projects I may do SMS updates for that aren't linked through an SmsReporter yet, filtering out reporters that have no project set
        """
        return self.my_projects().exclude(pk__in=[r.project.pk for r in self.reporters.exclude(project=None)])

    def available_gateway_numbers(self):
        # TODO: user selectable gateways
        gw = Gateway.objects.get(name=self.GATEWAY_42IT)
        # find all "free" numbers
        numbers = GatewayNumber.objects.filter(gateway=gw).exclude(number__in=[r.gw_number.number for r in self.reporters.exclude(project=None)])
        return numbers

    def create_reporter(self, project=None):
        """
        Create a new SMSReporter object with a gateway number that is currently not in use
        """
        logger.debug("Entering: %s()" % who_am_i())
        try:
            #do we have a reporter without a project? Then we' use it to set the project
            reporter = self.reporters.get(project=None)
            if project:
                reporter.project = project
                reporter.save()
                self.enable_reporting(reporter)
                logger.info(u'%s(): SMS updating set up for project %s, user %s.' % (who_am_i(), project, self.user))
            logger.debug("Exiting: %s()" % who_am_i())
            return reporter
        except:
            numbers = self.available_gateway_numbers()
            if numbers:
                new_number = numbers[0]
                reporter = SmsReporter.objects.create(userprofile=self, project=project, gw_number=new_number)
                if project:
                    self.enable_reporting(reporter)
                    logger.info(u'%s(): SMS updating set up for project %s, user %s.' % (who_am_i(), project, self.user))
                logger.debug("Exiting: %s()" % who_am_i())
                return reporter
            else:
                logger.error(u"%s(): No numbers defined for gateway. Can't create a reporter for user %s ." % (who_am_i(), self.user))
                logger.debug("Exiting: %s()" % who_am_i())
                return None

    def find_reporter(self):
        """
        Find or create a reporter to validate phone number
        """
        logger.debug("Entering: %s()" % who_am_i())
        reporters = self.reporters.all()
        if reporters:
            logger.debug("Exiting: %s()" % who_am_i())
            return reporters[0]
        else:
            logger.debug("Exiting: %s()" % who_am_i())
            return self.create_reporter()

    def disable_reporting(self, reporter=None):
        """
        Disable SMS reporting for one or all projects linked to a userprofile
        """
        logger.debug("Entering: %s()" % who_am_i())
        if reporter and reporter.project:
            reporters = [reporter]
        else:
            reporters = self.reporters.exclude(project=None) #exclude reporter that's not set up with a project
        for sms_reporter in reporters:
            try:
                sms_reporter.reporting_cancelled()
                logger.info(u'SMS updating cancelled for project: %s Locals:\n %s\n\n' % (sms_reporter.project, locals(), ))
            except Exception, e:
                logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), ))
        #if self.validation == self.VALIDATED and self.reporters.count() < 1:
        #    try:
        #        user = self.user
        #        do_transition(self, self.TRANSITION_VALIDATE_PHONE_NUMBER, user)
        #    except Exception, e:
        #        logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), user))
        logger.debug("Exiting: %s()" % who_am_i())

    def disable_all_reporters(self):
        self.disable_reporting()

    def destroy_reporter(self, reporter=None):
        logger.debug("Entering: %s()" % who_am_i())
        if reporter:
            reporters = [reporter]
        else:
            reporters = self.reporters.all()
        for reporter in reporters:
            self.disable_reporting(reporter)
            reporter.delete()
        logger.debug("Exiting: %s()" % who_am_i())

    def disable_sms_update_workflow(self, admin_user=None):
        logger.debug("Entering: %s()" % who_am_i())
        # this profile's user
        user = self.user
        # user calling disable_sms_update_workflow
        admin_user = admin_user or user
        try:
            if (
                self.state_equals(UserProfile.STATE_PHONE_DISABLED) or
                Role.objects.get(name=self.ROLE_SMS_UPDATER) not in self.get_roles(user)
            ):
                logger.debug("Exiting: %s()" % who_am_i())
                return
            else:
                trans_ok = self.do_transition(self.TRANSITION_DISABLE_UPDATING, admin_user)
            if not trans_ok:
                logger.error('Error in UserProfileManager.disable_sms_update_workflow: Locals:\n %s\n\n' % (locals(),))
                logger.debug("Exiting: %s()" % who_am_i())
                return
            send_now([user], 'phone_disabled', extra_context={'phone_number':self.phone_number}, on_site=True)
            self.disable_all_reporters()
            logger.info('SMS updating disabled for user %s' % user.username)
        except Exception, e:
            logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), ))
        logger.debug("Exiting: %s()" % who_am_i())

    def confirm_validation(self, mo_sms):
        logger.debug("Entering: %s()" % who_am_i())
        try:
            logger.debug("Trying to find a reporter with number %s for user %s." % (mo_sms.receiver, self.user))
            reporter = self.reporters.get(gw_number=GatewayNumber.objects.get(number=mo_sms.receiver))
            if self.do_transition(self.TRANSITION_ENABLE_UPDATING, self.user):
                reporter.phone_confirmation()
                self.validation = self.VALIDATED
                self.save()
                logger.info("%s: transition to %s for user %s." % (who_am_i(), self.TRANSITION_ENABLE_UPDATING, self.user))
            else:
                logger.error('Error in UserProfile  Manager.process_sms: Not allowed to do transition %s for user %s. Locals:\n %s\n\n' % (self.TRANSITION_VALIDATE_PHONE_NUMBER, self.user, locals()))
            self.enable_reporting()
        except Exception, e:
            logger.exception('Error in %s(): %s Locals:\n %s\n\n' % (who_am_i(), e.message, locals(), ))
        logger.debug("Exiting: %s()" % who_am_i())

    def enable_reporting(self, reporter=None):
        """
        Check for correct state and send email and SMS notifying the user about the enabled project
        If reporters=None we try to enable all reporters
        """
        logger.debug("Entering: %s()" % who_am_i())
        if reporter and reporter.project:
            reporters = [reporter]
        else:
            reporters = self.reporters.exclude(project=None)
        #if state_equals(self, [self.STATE_UPDATES_ENABLED, self.STATE_PHONE_NUMBER_VALIDATED]):
        if self.state_equals(self.STATE_UPDATES_ENABLED):
            for sms_reporter in reporters:
                #if state_equals(self, self.STATE_PHONE_NUMBER_VALIDATED):
                #    try:
                #        enabled = self.do_transition(self.TRANSITION_ENABLE_UPDATING, self.user)
                #    except Exception, e:
                #        logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(),))
                try:
                    sms_reporter.reporting_enabled()
                    logger.info('Project enabled for updating: %s Locals:\n %s\n\n' % (sms_reporter.project.pk, locals(), ))
                except Exception, e:
                    logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), ))
        else:
            logger.error('UserProfile.enable_reporting() called with bad State: %s Locals:\n %s\n\n' % (self.get_state(), locals(), ))
        logger.debug("Exiting: %s()" % who_am_i())

    def enable_all_reporters(self):
        self.enable_reporting()

    def init_sms_update_workflow(self):
        '''
        Check that workflow exists ie the DB is setup correctly
        Disable reporters if we have any
        (Re)set state to STATE_PHONE_DISABLED
        '''
        logger.debug("Entering: %s()" % who_am_i())
        workflow = self.get_workflow()
        #in case of DB config bork:
        if not workflow:
            logger.error('Error in %s. Workflow not defined for %s. Locals: %s' % (who_am_i(), self.user.username, locals()))
            return
        #set up current UserProfile with the workflow
        #this creates the WorkflowObjectRelation, sets initial State and
        #assigns permissions for the state (ObjectPermission)
        self.set_workflow(workflow)
        if state_equals(self, self.STATE_UPDATES_ENABLED):
            self.disable_all_reporters()
        self.set_initial_state() #Phone disabled
        logger.debug("Exiting: %s()" % who_am_i())

    def add_phone_number(self, phone_number):
        """
        Set up workflow
        Transit to STATE_PHONE_NUMBER_ADDED
        Save phone number and generated validation code
        Get or create a Reporter
        Send a validation request
        """
        logger.debug("Entering: %s()" % who_am_i())
        user = self.user
        self.init_sms_update_workflow()
        #get workflow from model relation
        #check that we're allowed to do SMS updates
        if self.do_transition(self.TRANSITION_ADD_PHONE_NUMBER, user):
            self.validation = User.objects.make_random_password(length=6).upper()
            self.phone_number = phone_number
            self.save()
            # TODO: gateway selection!
            #gw_number = Gateway.objects.get(name=self.GATEWAY_42IT).gatewaynumber_set.all()[0]
            # Setup an initial SmsReporter for handling of registration SMSs so no project assigned to reporter yet.
            reporter = self.find_reporter()
            reporter.create_validation_request()
            logger.info('UserProfile.%s(): successfully set up workflow "%s" for user %s' % (who_am_i(), self.WORKFLOW_SMS_UPDATE, user.username, ))
        else:
            logger.info('UserProfile.%s(): user %s not allowed to set up workflow "%s"' % (who_am_i(), user.username, self.WORKFLOW_SMS_UPDATE, ))
        logger.debug("Exiting: %s()" % who_am_i())

    def has_permission(self, user, permission, roles=[]):
        """Grant SMS manager role if we're doing this for ourselves
        """
        #TODO: check that we have SMS updater role, if not we shouldn't get SMS manager role either :-p
        if self == user.get_profile() and Role.objects.get(name=self.ROLE_SMS_UPDATER) in self.get_roles(user):
            roles.append(Role.objects.get(name=self.ROLE_SMS_MANAGER))
        return super(UserProfile, self).has_permission(user, permission, roles)

    def has_perm_add_sms_updates(self):
        """used in myakvo navigation template to determin what links to show
        """
        return (
            self.has_permission(self.user, UserProfile.PERMISSION_ADD_SMS_UPDATES, []) or
            self.has_permission(self.user, UserProfile.PERMISSION_MANAGE_SMS_UPDATES, [])
        )
    has_perm_add_sms_updates.boolean = True #make pretty icons in the admin list view
    has_perm_add_sms_updates.short_description = _('may create SMS project updates')


    #def phone_number_changed(self, phone_number):
    #    logger.debug("Entering: %s()" % who_am_i())
    #    #sanity check, if number are the same we shouldn't do anything
    #    if self.phone_number != phone_number:
    #
    #
    #    logger.debug("Exiting: %s()" % who_am_i())


class SmsReporterManager(models.Manager):
    def select(self, profile=None, gw_number=None, project=None):
        #need either gw_number or project
        if gw_number or project:
            if gw_number:
                return self.get(userprofile=profile, gw_number=gw_number)
            else:
                return self.get(userprofile=profile, project=project)
        raise SmsReporter.DoesNotExists

class SmsReporter(models.Model):
    """
    Mapping between projects, gateway phone numbers and users phones
    """
    userprofile = models.ForeignKey(UserProfile, related_name='reporters')
    gw_number = models.ForeignKey(GatewayNumber)
    project = models.ForeignKey(Project, null=True, blank=True, )

    objects = SmsReporterManager()

    class Meta:
        unique_together = ('userprofile', 'gw_number', 'project',)
        permissions = (
            ("%s_smsreporter" % RSR_LIMITED_CHANGE, u'RSR limited change sms reporter'),
        )

    def __unicode__(self):
        if self.project:
            return "%s:%s:%s" % (self.userprofile.user.username, self.gw_number, self.project)
        else:
            return "%s:%s" % (self.userprofile.user.username, self.gw_number)

    def create_sms_update(self, mo_sms):
        """
        Create a project update from an incoming SMS
        """
        logger.debug("Entering: %s()" % who_am_i())
        if not self.project:
            logger.error("No project defined for SmsReporter %s. Locals:\n %s\n\n" % (self.__unicode__, locals()))
            return False
        update_data = {
            'project': self.project,
            'user': self.userprofile.user,
            'title': 'SMS update',
            'update_method': 'S',
            'text': mo_sms.message,
            'time': mo_sms.saved_at,
        }
        try:
            update = ProjectUpdate.objects.create(**update_data)
            logger.info("Created new project update from sms. ProjectUpdate.id: %d" % update.pk)
            self.update_received(update)
            logger.debug("Exiting: %s()" % who_am_i())
            return update
        except Exception, e:
            logger.exception("Exception when creating an sms project update. Error: %s Locals:\n %s\n\n" % (e.message, locals(), ))
            logger.debug("Exiting: %s()" % who_am_i())
            return False

    def update_received(self, update):
        profile = self.userprofile
        extra_context = {
            'gw_number'     : self.gw_number,
            'phone_number'  : profile.phone_number,
            'project'       : self.project,
            'update'        : update,
            'domain'        : Site.objects.get_current().domain,
        }
        send_now([profile.user], 'update_received', extra_context=extra_context, on_site=True)

    def reporting_cancelled(self, set_delete=False):
        profile = self.userprofile
        #self.delete = set_delete
        extra_context = {
            'gw_number'     : self.gw_number,
            'phone_number'  : profile.phone_number,
            'project'       : self.project,
        }
        send_now([profile.user], 'reporting_cancelled', extra_context=extra_context, on_site=True)

    def reporting_enabled(self):
        profile = self.userprofile
        extra_context = {
            'gw_number'     : self.gw_number,
            'phone_number'  : profile.phone_number,
            'project'       : self.project,
        }
        send_now([profile.user], 'reporting_enabled', extra_context=extra_context, on_site=True)

    def create_validation_request(self):
        """
        send validation code through email and an SMS that the user can easily
        reply to with the code to validate the phone number
        """
        # check we aren't already validated
        profile = self.userprofile
        if profile.validation != profile.VALIDATED:
            extra_context = {
                'gw_number'     : self.gw_number,
                'validation'    : profile.validation,
                'phone_number'  : profile.phone_number,
            }
            send_now([profile.user], 'phone_added', extra_context=extra_context, on_site=True)

    def phone_confirmation(self):
        profile = self.userprofile
        extra_context = {
            'gw_number'     : self.gw_number,
            'phone_number'  : profile.phone_number,
            'domain'        : Site.objects.get_current().domain,
        }
        send_now([profile.user], 'phone_confirmed', extra_context=extra_context, on_site=True)


class ProjectUpdate(models.Model):
    def image_path(instance, file_name):
        "Create a path like 'db/project/<update.project.id>/update/<update.id>/image_name.ext'"
        path = 'db/project/%d/update/%%(instance_pk)s/%%(file_name)s' % instance.project.pk
        return rsr_image_path(instance, file_name, path)

    project = models.ForeignKey(Project, related_name='project_updates', verbose_name=_(u'project'))
    user = models.ForeignKey(User, verbose_name=_(u'user'))
    title = models.CharField(_(u'title'), max_length=50, help_text=_(u'50 characters'))
    text = models.TextField(_(u'text'), blank=True)
    #status = models.CharField(max_length=1, choices=STATUSES, default='N')
    photo = ImageWithThumbnailsField(
        _(u'photo'),
        blank=True,
        upload_to=image_path,
        thumbnail={'size': (300, 225), 'options': ('autocrop', 'sharpen', )},
        help_text = _(u'The image should have 4:3 height:width ratio for best displaying result'),
    )
    photo_location = models.CharField(_(u'photo location'), max_length=1, choices=PHOTO_LOCATIONS)
    photo_caption = models.CharField(_(u'photo caption'), blank=True, max_length=75, help_text=_(u'75 characters'))
    photo_credit = models.CharField(_(u'photo credit'), blank=True, max_length=25, help_text=_(u'25 characters'))
    video = models.URLField(_(u'video URL'), blank=True, help_text=_(u'Supported providers: Blip, Vimeo, YouTube'), verify_exists=False)
    video_caption = models.CharField(_(u'video caption'), blank=True, max_length=75, help_text=_(u'75 characters'))
    video_credit = models.CharField(_(u'video credit'), blank=True, max_length=25, help_text=_(u'25 characters'))
    update_method = models.CharField(_(u'update method'), blank=True, max_length=1, choices=UPDATE_METHODS, default='W')
    time = models.DateTimeField(_(u'time'), auto_now_add=True)
    time_last_updated = models.DateTimeField(_(u'time last updated'), auto_now=True)
    # featured = models.BooleanField(_(u'featured'))

    class Meta:
        get_latest_by = "time"
        verbose_name = _(u'project update')
        verbose_name_plural = _(u'project updates')
        ordering = ['-id',]

    def img(self, value=''):
        try:
            return self.photo.thumbnail_tag
        except:
            return value
    img.allow_tags = True

    # def get_is_featured(self):
    #     return self.featured
    # get_is_featured.boolean = True #make pretty icons in the admin list view
    # get_is_featured.short_description = _(u'update is featured')

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
            except:
                pass
        return mark_safe(html)

    def edit_window_has_expired(self):
        """Determine whether or not update timeout window has expired.
        The timeout is controlled by settings.PROJECT_UPDATE_TIMEOUT and
        defaults to 30 minutes.
        """
        return (datetime.now() - self.time) > self.edit_timeout

    @property
    def expires_at(self):
        return to_gmt(self.time + self.edit_timeout)

    @property
    def edit_timeout(self):
        timeout_minutes = getattr(settings, 'PROJECT_UPDATE_TIMEOUT', 30)
        return timedelta(minutes=timeout_minutes)

    @property
    def edit_time_remaining(self):
        return self.edit_timeout - self.time

    @property
    def time_gmt(self):
        return to_gmt(self.time)

    @property
    def time_last_updated_gmt(self):
        return to_gmt(self.time_last_updated)

    @property
    def view_count(self):
        counter = ViewCounter.objects.get_for_object(self)
        return counter.count or 0

    @property
    def media_location(self):
        return self.photo_location

    @property
    def text_location(self, location='B'):
        if self.media_location == 'B':
            location = 'E'
        return location

    @models.permalink
    def get_absolute_url(self):
        return ('update_main', (), {'project_id': self.project.pk, 'update_id': self.pk})

    def __unicode__(self):
        return u'Project update for %(project_name)s' % {'project_name': self.project.title}


class ProjectComment(models.Model):
    project = models.ForeignKey(Project, verbose_name=_(u'project'))
    user = models.ForeignKey(User, verbose_name=_(u'user'))
    comment = models.TextField(_(u'comment'))
    time = models.DateTimeField(_(u'time'))

    class Meta:
        verbose_name = _(u'project comment')
        verbose_name_plural = _(u'project comments')
        ordering = ('-id',)


# Payment engines
class PaymentGateway(models.Model):
    name = models.CharField(max_length=255, help_text=u'Use a short, descriptive name.')
    description = models.TextField(blank=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='EUR')
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
    locale = models.CharField(max_length=2, choices=PAYPAL_LOCALE_CHOICES, default='US')

    class Meta:
        verbose_name = u'PayPal gateway'

class MollieGateway(PaymentGateway):
    partner_id = models.CharField(max_length=10)

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
    def get_query_set(self):
        """Returns a queryset of all invoices
        Test invoices are excluded in production mode
        """
        if not settings.DONATION_TEST:
            return super(InvoiceManager, self).get_query_set().exclude(test=True)
        else:
            return super(InvoiceManager, self).get_query_set()

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
    test            = models.BooleanField(u'test donation', help_text=u'This flag is set if the donation was made in test mode.')
    engine          = models.CharField(u'payment engine', choices=PAYMENT_ENGINES, max_length=10, default='paypal')
    user            = models.ForeignKey(User, blank=True, null=True)
    project         = models.ForeignKey(Project)
    # Common
    amount          = models.PositiveIntegerField(help_text=u'Amount requested by user.')
    amount_received = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=u'Amount actually received after charges have been applied.'
    )
    time            = models.DateTimeField(auto_now_add=True)
    name            = models.CharField(max_length=75, blank=True, null=True)
    email           = models.EmailField(blank=True, null=True)
    status          = models.PositiveSmallIntegerField('status', choices=STATUS_CHOICES, default=1)
    http_referer    = models.CharField(u'HTTP referer', max_length=255, blank=True)
    campaign_code   = models.CharField(u'Campaign code', blank=True, max_length=15)
    is_anonymous    = models.BooleanField(u'anonymous donation')
    # PayPal
    ipn             = models.CharField(u'PayPal IPN', blank=True, null=True, max_length=75)
    # Mollie
    bank            = models.CharField(u'mollie.nl bank ID', max_length=4, choices=get_mollie_banklist(), blank=True)
    transaction_id  = models.CharField(u'mollie.nl transaction ID', max_length=100, blank=True)

    admin_objects = models.Manager()
    objects = InvoiceManager()

    def get_favicon(self):
        pass #TODO: @ grab favicon from HTTP_REFERER site

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
            if settings.PAYPAL_TEST:
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
        if self.engine == 'paypal':
            return self.project.paymentgatewayselector.paypal_gateway.notification_email
        elif self.engine == 'ideal':
            return self.project.paymentgatewayselector.mollie_gateway.notification_email

    @property
    def donation_fee(self):
        return (self.amount - self.amount_received)

    def __unicode__(self):
        return u'Invoice %(invoice_id)s (Project: %(project_name)s)' % {
            'invoice_id': self.id, 'project_name':self.project
        }

    class Meta:
        verbose_name = u'invoice'
        ordering = ['-id',]


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


class PartnerSite(models.Model):

    def about_image_path(instance, file_name):
        return 'db/partner_sites/%s/image/%s' % (instance.hostname, file_name)

    def custom_css_path(instance, filename):
        return 'db/partner_sites/%s/custom.css' % instance.hostname

    def custom_favicon_path(instance, filename):
        return 'db/partner_sites/%s/favicon.ico' % instance.hostname

    def custom_logo_path(instance, filename):
        return 'db/partner_sites/%s/logo/%s' % (instance.hostname, filename)

    organisation = models.ForeignKey(Organisation, verbose_name=_(u'organisation'),
        help_text=_('Select your organisation from the drop-down list.')
    )
    hostname = models.CharField(_(u'hostname'), max_length=50, unique=True,
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
    custom_css = models.FileField(_(u'stylesheet'), blank=True, upload_to=custom_css_path)
    custom_logo = models.FileField(_(u'organisation banner logo'), blank=True, upload_to=custom_logo_path,
        help_text=_(
            u'<p>Upload a logo file for the banner at the top of the partner site page. '
            u'By default the logo currently used by www.akvo.org will be displayed.</p>'
        )
    )
    custom_favicon = models.FileField(_(u'favicon'), blank=True, upload_to=custom_favicon_path,
        help_text=_(
            u"<p>A favicon (.ico file) is the 16x16 pixel image shown inside the browser's location bar, "
            u'on tabs and in the bookmark menu.</p>'
        )
    )
    about_box = models.TextField(_(u'about box text'), max_length=500, blank=True,
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
    default_language = models.CharField(_(u'language'),
                                        max_length=5,
                                        choices=settings.LANGUAGES,
                                        default=settings.LANGUAGE_CODE)

    def __unicode__(self):
        return u'Partner site for %(organisation_name)s' % {'organisation_name': self.organisation.name}

    @property
    def logo(self):
        return self.custom_logo or None

    @property
    def return_url(self):
        domain_name = 'http://%s' % settings.DOMAIN_NAME
        return self.custom_return_url or self.organisation.url

    @property
    def stylesheet(self):
        return self.custom_css or None

    @property
    def favicon(self):
        return self.custom_favicon or None

    def get_absolute_url(self):
        url = ''
        if self.cname:
            return self.cname
    
        protocol = 'http'
        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = '%ss' % protocol
    
        url = '%s://%s.%s' % (protocol, self.hostname, settings.APP_DOMAIN_NAME)
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

if settings.DONATION_NOTIFICATION_EMAILS:
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

#m2m_changed.connect(manage_workflow_roles, sender=User.groups.through)
