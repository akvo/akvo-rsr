# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date, datetime, timedelta
from decimal import Decimal

import logging
logger = logging.getLogger('akvo.rsr')

import oembed

from django.conf import settings
from django.db import models
from django.db.models import Max, Sum
from django.db.models.query import QuerySet
from django.db.models.signals import pre_save, post_save
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Group, User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.contrib.sites.models import Site
from django.core.urlresolvers import reverse
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

from akvo.rsr.fields import LatitudeField, LongitudeField, NullCharField
from akvo.rsr.utils import (
    GROUP_RSR_EDITORS, RSR_LIMITED_CHANGE, GROUP_RSR_PARTNER_ADMINS,
    GROUP_RSR_PARTNER_EDITORS
)
from akvo.rsr.utils import (
    PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_VOID,
    PAYPAL_INVOICE_STATUS_COMPLETE, PAYPAL_INVOICE_STATUS_STALE
)
from akvo.rsr.utils import (
    groups_from_user, rsr_image_path, qs_column_sum,
    who_am_i, send_now, state_equals, to_gmt
)
from akvo.rsr.signals import (
    change_name_of_file_on_change, change_name_of_file_on_create,
    create_publishing_status, create_organisation_account,
    create_payment_gateway_selector, donation_completed,
    act_on_log_entry, user_activated_callback
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
    ("1", _('Africa')),
    ("2", _('Asia')),
    ("3", _('Australia')),
    ("4", _('Europe')),
    ("5", _('North America')),
    ("6", _('South America')),
)

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
        verbose_name = _('country')
        verbose_name_plural = _('countries')
        ordering = ['name']


class Location(models.Model):
    latitude = LatitudeField(_('latitude'), default=0,
        help_text='Go to <a href="http://itouchmap.com/latlong.html"'
                  'target="_blank">iTouchMap.com</a> '
                  'to get the decimal coordinates of your project')
    longitude = LongitudeField(_('longitude'), default=0,
        help_text='Go to <a href="http://itouchmap.com/latlong.html"'
                  'target="_blank">iTouchMap.com</a> '
                  'to get the decimal coordinates of your project')
    city = models.CharField(_('city'), blank=True, max_length=255)
    state = models.CharField(_('state'), blank=True, max_length=255)
    country = models.ForeignKey(Country)
    address_1 = models.CharField(_('address 1'), max_length=255, blank=True)
    address_2 = models.CharField(_('address 2'), max_length=255, blank=True)
    postcode = models.CharField(_('postcode'), max_length=10, blank=True)
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    primary = models.BooleanField(_('primary location'), default=True)

    def __unicode__(self):
        return u'%s, %s (%s)' % (self.city, self.state, self.country)

    def save(self, *args, **kwargs):
        if self.primary:
            qs = Location.objects.filter(content_type=self.content_type,
                    object_id=self.object_id, primary=True)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
                if qs.count() != 0:
                    self.primary = False
        super(Location, self).save(*args, **kwargs)


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
        (ORG_TYPE_NGO, _('NGO')),
        (ORG_TYPE_GOV, _('Governmental')),
        (ORG_TYPE_COM, _('Commercial')),
        (ORG_TYPE_KNO, _('Knowledge institution')),
    )

    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/org/%(instance_pk)s/%(file_name)s')

    #type = models.CharField(max_length=1, choices=PARNER_TYPES)
    field_partner = models.BooleanField(_(u'field partner'))
    support_partner = models.BooleanField(_(u'support partner'))
    funding_partner = models.BooleanField(_(u'funding partner'))
    sponsor_partner = models.BooleanField(_(u'sponsor partner'))

    name = models.CharField(_('name'), max_length=25, help_text=_('Short name which will appear in organisation and partner listings (25 characters).'))
    long_name = models.CharField(_('long name'), blank=True, max_length=75, help_text=_('Full name of organisation (75 characters).'))
    organisation_type = models.CharField(_('organisation type'), max_length=1, choices=ORG_TYPES)

    logo = ImageWithThumbnailsField(_('logo'),
                                    blank=True,
                                    upload_to=image_path,
                                    thumbnail={'size': (360,270)},
                                    help_text=_('Logos should be approximately 360x270 pixels (approx. 100-200kb in size) on a white background.'),
                                   )
    
    url = models.URLField(blank=True, verify_exists = False, help_text=_('Enter the full address of your web site, beginning with http://.'))

    phone = models.CharField(_('phone'), blank=True, max_length=20, help_text=_('(20 characters).'))
    mobile = models.CharField(_('mobile'), blank=True, max_length=20, help_text=_('(20 characters).'))
    fax = models.CharField(_('fax'), blank=True, max_length=20, help_text=_('(20 characters).'))
    contact_person = models.CharField(_('contact person'), blank=True, max_length=30, help_text=_('Name of external contact person for your organisation.'))
    contact_email = models.CharField(_('contact email'), blank=True, max_length=50, help_text=_('Email to which inquiries about your organisation should be sent.'))
    description = models.TextField(_('description'), blank=True, help_text=_('Describe your organisation.') )

    locations = generic.GenericRelation(Location)

    #Managers, one default, one custom
    #objects = models.Manager()
    objects = QuerySetManager()
    projects = ProjectsQuerySetManager()

    @models.permalink
    def get_absolute_url(self):
        return ('organisation_main', (), {'org_id': self.pk})

    @property
    def primary_location(self):
        '''Returns an organisations's primary location'''
        qs = self.locations.filter(primary=True)
        qs = qs.exclude(latitude=0, longitude=0)
        if qs:
            location = qs[0]
            return location
        return


    class QuerySet(QuerySet):
        def has_primary_location(self):
            content_type = ContentType.objects.get_for_model(Organisation)
            locations = Location.objects.filter(content_type=content_type,
                primary=True)
            locations = locations.exclude(latitude=0, longitude=0)
            project_ids = [location.object_id for location in locations]
            return self.filter(id__in=project_ids)

        def fieldpartners(self):
            return self.filter(field_partner__exact=True)

        def supportpartners(self):
            return self.filter(support_partner__exact=True)

        def sponsorpartners(self):
            return self.filter(sponsor_partner__exact=True)

        def fundingpartners(self):
            return self.filter(funding_partner__exact=True)

        def ngos(self):
            return self.filter(organisation_type__exact='N')

        def governmental(self):
            return self.filter(organisation_type__exact='G')

        def commercial(self):
            return self.filter(organisation_type__exact='C')

        def knowledge(self):
            return self.filter(organisation_type__exact='K')

    class ProjectsQuerySet(QuerySet):
        """
        used for the projects manager on the Organisation
        returns querysets of projects
        Usage:
        orgs = Organisation.projects.filter(filter_criteria)
        orgs.published() -> all projects "belonging to the orgs" returned from
        the first statement
        Note: Organisation.projects.all() returns all orgs!
        To get all projects you need to write Organisation.projects.all().all() ;-)
        """
        def published(self):
            '''
            returns a queryset with published projects that has self as any kind of partner
            note that self is a queryset of orgs
            '''
            projs = Project.objects.published()
            return (projs.filter(supportpartner__support_organisation__in=self) | \
                    projs.filter(fieldpartner__field_organisation__in=self) | \
                    projs.filter(sponsorpartner__sponsor_organisation__in=self) | \
                    projs.filter(fundingpartner__funding_organisation__in=self)).distinct()

        def all(self):
            '''
            returns a queryset with all projects that has self as any kind of partner
            note that self is a queryset of orgs
            '''
            projs = Project.objects.all()
            return (projs.filter(supportpartner__support_organisation__in=self) | \
                    projs.filter(fieldpartner__field_organisation__in=self) | \
                    projs.filter(sponsorpartner__sponsor_organisation__in=self) | \
                    projs.filter(fundingpartner__funding_organisation__in=self)).distinct()

    def __unicode__(self):
        return self.name

    #def partner_types(self):
    #    pt = ""
    #    if self.field_partner: pt += "F"
    #    if self.support_partner: pt += "S"
    #    if self.sponsor_partner: pt += "P"
    #    if self.funding_partner: pt += "M"
    #    return pt

    #def has_water_projects(self):
    #    if self.all_projects().filter(category_water__exact=True):
    #        return True
    #    else:
    #        return False
    #
    #def has_sanitation_projects(self):
    #    if self.all_projects().filter(category_sanitation__exact=True):
    #        return True
    #    else:
    #        return False
    #
    #def has_training_projects(self):
    #    if self.all_projects().filter(category_training__exact=True):
    #        return True
    #    else:
    #        return False
    #
    #def has_maintenance_projects(self):
    #    if self.all_projects().filter(category_maintenance__exact=True):
    #        return True
    #    else:
    #        return False
    #
    #def has_education_projects(self):
    #    if self.all_projects().filter(category_education__exact=True):
    #        return True
    #    else:
    #        return False
    #
    #def has_product_development_projects(self):
    #    if self.all_projects().filter(category_product_development__exact=True):
    #        return True
    #    else:
    #        return False
    #
    #def has_other_projects(self):
    #    if self.all_projects().filter(category_other__exact=True):
    #        return True
    #    else:
    #        return False

    def website(self):
        return '<a href="%s">%s</a>' % (self.url, self.url,)
    website.allow_tags = True

    def published_projects(self):
        '''
        returns a queryset with published projects that has self as any kind of partner
        '''
        return Organisation.projects.filter(pk=self.pk).published()

    def all_projects(self):
        '''
        returns a queryset with all projects that has self as any kind of partner
        '''
        return Organisation.projects.filter(pk=self.pk).all()

    def active_projects(self):
        return self.published_projects().status_not_cancelled().status_not_archived()

    def partners(self):
        '''
        returns a queryset of all organisations that self has at least one project in common with, excluding self
        '''
        return Project.organisations.filter(pk__in=self.published_projects()).all_partners().exclude(id__exact=self.id)

    def funding(self):
        my_projs = self.published_projects().status_not_cancelled().status_not_archived()
        # Fix for problem with pledged. my_projs.euros().total_pledged(self) won't
        # work because values_list used in qs_column_sum will not return more
        # than one of the same value. This leads to the wrong sum when same amount
        # has been pledged to multiple projects
        all_active = Project.objects.published().status_not_cancelled().status_not_archived()
        return {
            'total_euros': my_projs.euros().total_total_budget(),
            'donated_euros': my_projs.euros().total_donated(),
            'pledged_euros': all_active.euros().total_pledged(self),
            'still_needed_euros': my_projs.euros().total_funds_needed(),
            'total_dollars': my_projs.dollars().total_total_budget(),
            'donated_dollars': my_projs.dollars().total_donated(),
            'pledged_dollars': all_active.dollars().total_pledged(self),
            'still_needed_dollars': my_projs.dollars().total_funds_needed()
        }

    # rewrite of funding, not currently used since we're mimmicing 0.9.xx behaviour regarding funding info on the org page:
    #def funding(self):
    #    my_projs = self.published_projects().status_not_cancelled().status_not_archived()
    #    return {
    #        'total_euros': my_projs.euros().total_total_budget(),
    #        'donated_euros': my_projs.euros().total_donated() - my_projs.euros().total_pending(),
    #        'pledged_euros': my_projs.euros().total_pledged(self),
    #        'total_pledged_euros': my_projs.euros().total_pledged(),
    #        'total_raised_euros': my_projs.euros().total_pledged() + my_projs.euros().total_donated() - my_projs.euros().total_pending(),
    #        'still_needed_euros': my_projs.euros().total_funds_needed(),
    #
    #        'total_dollars': my_projs.dollars().total_total_budget(),
    #        'donated_dollars': my_projs.dollars().total_donated() - my_projs.dollars().total_pending(),
    #        'pledged_dollars': my_projs.dollars().total_pledged(self),
    #        'total_pledged_dollars': my_projs.dollars().total_pledged(),
    #        'total_raised_dollars': my_projs.dollars().total_pledged() + my_projs.dollars().total_donated() - my_projs.dollars().total_pending(),
    #        'still_needed_dollars': my_projs.dollars().total_funds_needed()
    #    }

    class Meta:
        verbose_name=_('Organisation')
        verbose_name_plural=_('Organisations')
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
        ('free', _('Free')),
        ('plus', _('Plus')),
        ('premium', _('Premium')),
    )
    organisation    = models.OneToOneField(Organisation, primary_key=True)
    account_level   = models.CharField(_('account level'), max_length=12, choices=ACCOUNT_LEVEL, default='free')

    class Meta:
        verbose_name = _('organisation account')
        verbose_name_plural = _('organisation accounts')

class FocusArea(models.Model):
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/focus_area/%(file_name)s')
    name        = models.CharField(_('focus area name'), max_length=50, help_text=_('The name of the focus area. This will show as the title of the focus area project listing page. (30 characters).'))
    slug        = models.SlugField(_('slug'), max_length=50, help_text=_('Enter the "slug" i.e. a short word or hyphenated-words. This will be used in the URL of the focus area project listing page. (20 characters, only lower case letters, numbers, hyphen and underscore allowed.).'))
    description = models.TextField(_('description'), max_length=500, help_text=_('Enter the text that will appear on the focus area project listing page. (500 characters).'))
    image       = ImageWithThumbnailsField(
                    _('focus area image'),
                    upload_to=image_path,
                    thumbnail={'size': (20, 20), 'options': ('crop', )},
                    help_text=_('The image that will appear on the focus area project listing page.'),
                )
    link_to     = models.URLField(_('accordion link'), max_length=200, blank=True, help_text=_('Where the link in the accordion for the focus area points if other than the focus area project listing.'))

    @models.permalink
    def get_absolute_url(self):
        return ('project_list', (), {'slug': self.slug})

    def projects(self):
        """
        return all projects that "belong" to the FA through the Categories it links to
        """
        return Project.objects.filter(categories__in=self.categories.all())

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name=_('focus area')
        verbose_name_plural=_('focus areas')

class Benchmarkname(models.Model):
    name    = models.CharField(_('benchmark name'), max_length=50, help_text=_('Enter a name for the benchmark. (50 characters).'))
    order   = models.IntegerField(_(u'order'), default=0, help_text=_('Used to order the benchmarks when displayed. Larger numbers sink to the bottom of the list.'))

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['order', 'name',]
        verbose_name = _('benchmark name')
        verbose_name_plural = _('benchmark names')


class Category(models.Model):
    #def image_path(instance, file_name):
    #    return rsr_image_path(instance, file_name, 'db/category/%(file_name)s')

    name = models.CharField(_('category name'), max_length=50, help_text=_('Enter a name for the category. (50 characters).'))
    #icon                    = ImageWithThumbnailsField(
    #                            _('category icon'),
    #                            blank=True,
    #                            upload_to=image_path,
    #                            thumbnail={'size': (20, 20), 'options': ('crop', )},
    #                            help_text=_('Icon size must 20 pixels square, preferably a .png or .gif'),
    #                        )
    focus_area = models.ManyToManyField(FocusArea, verbose_name=_(u'focus area'), related_name='categories', help_text=_('Select the Focus area(s) the category belongs to.'), )
    benchmarknames = models.ManyToManyField(Benchmarkname, verbose_name=_(u'benchmark names'), blank=True, help_text=_('Select the benchmark names for the category.'), )

    class Meta:
        verbose_name=_('category')
        verbose_name_plural=_('categories')

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
    ('N', _('None')),
    ('H', _('Needs funding')),
    ('A', _('Active')),
    ('C', _('Complete')),
    ('L', _('Cancelled')),
    ('R', _('Archived')),
)
#STATUSES_DICT = dict(STATUSES) #used to output STATUSES text
STATUSES_COLORS = {'N':'black', 'A':'#AFF167', 'H':'orange', 'C':'grey', 'R':'grey', 'L':'red', }


class OrganisationsQuerySetManager(QuerySetManager):
    def get_query_set(self):
        return self.model.OrganisationsQuerySet(self.model)


class MiniCMS(models.Model):
    '''
    A model that holds a bunch of fields for editable text on the home page and the project listing page.
    '''
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/home_page/%(file_name)s')

    label = models.CharField(_(u'label'), max_length=50, help_text=_(u'The label is used for identification only'), )
    feature_box = models.TextField(_(_(u'feature box text'), ), max_length=350, help_text=_(
        '''Enter the text that will appear in the feature box of the home page. (350 characters)
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
        <p>Use the <code>serif</code> class to get a serif font (Georgia).</p>
        '''
    ))
    feature_image = models.ImageField(_('feature image'),
                                      blank=True,
                                      upload_to=image_path,
                                      help_text=_('Ideally the image should be 645x363 pixels in size.'))
    top_right_box = models.TextField(_(_(u'top right box text'), ), max_length=350, help_text=_('Enter the text that will appear in the top right box of the home page. (350 characters)'))
    lower_height = models.IntegerField(_(u'accordion height'), default=500, )
    active = models.BooleanField(_(u'currently active home page'), default=False)

    def __unicode__(self):
        return self.label

    class Meta:
        verbose_name = _('MiniCMS')
        verbose_name_plural = _('MiniCMS')


class Project(models.Model):
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/project/%(instance_pk)s/%(file_name)s')

    name = models.CharField(_('name'), max_length=45, help_text=_('A short descriptive name for your project (45 characters).'))
    subtitle = models.CharField(_('subtitle'), max_length=75, help_text=_('A subtitle with more information on the project (75 characters).'))
    status = models.CharField(_('status'), max_length=1, choices=STATUSES, default='N', help_text=_('Current project state.'))
    categories = models.ManyToManyField(Category, related_name='projects',)

    project_plan_summary = models.TextField(_('summary of project plan'), max_length=220, help_text=_('Briefly summarize the project (220 characters).'))
    current_image = ImageWithThumbnailsField(
                        _('project photo'),
                        blank=True,
                        upload_to=image_path,
                        thumbnail={'size': (240, 180), 'options': ('autocrop', 'detail', )}, #detail is a mild sharpen
                        help_text=_('The project image looks best in landscape format (4:3 width:height ratio), and should be less than 3.5 mb in size.'),
                    )
    current_image_caption = models.CharField(_('photo caption'), blank=True, max_length=50, help_text=_('Enter a caption for your project picture (50 characters).'))
    goals_overview = models.TextField(_('overview'), max_length=500, help_text=_('Describe what the project hopes to accomplish (500 characters).'))
    goal_1 = models.CharField(_('goal 1'), blank=True, max_length=60, help_text=_('(60 characters)'))
    goal_2 = models.CharField(_('goal 2'), blank=True, max_length=60)
    goal_3 = models.CharField(_('goal 3'), blank=True, max_length=60)
    goal_4 = models.CharField(_('goal 4'), blank=True, max_length=60)
    goal_5 = models.CharField(_('goal 5'), blank=True, max_length=60)

    current_status_detail = models.TextField(_('Current status detail'), blank=True, max_length=600, help_text=_('Description of current phase of project. (600 characters).'))
    project_plan_detail = models.TextField(_('Project plan detail'), blank=True, help_text=_('Detailed information about the project and plans for implementing: the what, how, who and when. (unlimited).'))
    sustainability = models.TextField(_('sustainability'), help_text=_('Describe plans for sustaining/maintaining results after implementation is complete (unlimited).'))
    context = models.TextField(_('context'), blank=True, max_length=500, help_text=_('Relevant background information, including geographic, political, environmental, social and/or cultural issues (500 characters).'))

    project_rating = models.IntegerField(_('Project rating'), default=0)
    notes = models.TextField(_('notes'), blank=True, help_text=_('(Unlimited number of characters).'))

    #budget
    currency = models.CharField(_('currency'), choices=CURRENCY_CHOICES, max_length=3, default='EUR')
    date_request_posted = models.DateField(_('Date request posted'), default=date.today)
    date_complete = models.DateField(_('Date complete'), null=True, blank=True)

    locations = generic.GenericRelation(Location)

    #Custom manager
    #based on http://www.djangosnippets.org/snippets/562/ and
    #http://simonwillison.net/2008/May/1/orm/
    objects = QuerySetManager()
    organisations = OrganisationsQuerySetManager()

    @models.permalink
    def get_absolute_url(self):
        return ('project_main', (), {'project_id': self.pk})

    def all_donations(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=3)

    def public_donations(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=3).exclude(is_anonymous=True)

    def all_donations_amount(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=3).aggregate(all_donations_sum=Sum('amount'))['all_donations_sum']

    def all_donations_amount_received(self):
        return Invoice.objects.filter(project__exact=self.id).filter(status__exact=3).aggregate(all_donations_sum=Sum('amount_received'))['all_donations_sum']

    def anonymous_donations_amount_received(self):
        amount = Invoice.objects.filter(project__exact=self.id).exclude(is_anonymous=False)
        amount = amount.filter(status__exact=3).aggregate(sum=Sum('amount_received'))['sum']
        return amount or 0

    @property
    def view_count(self):
        counter = ViewCounter.objects.get_for_object(self)
        return counter.count or 0

    @property
    def primary_location(self, location=None):
        '''Return a project's primary location'''
        qs = self.locations.filter(primary=True)
        qs = qs.exclude(latitude=0, longitude=0)
        if qs:
            location = qs[0]
            return location
        return

    class QuerySet(QuerySet):
        def has_primary_location(self):
            content_type = ContentType.objects.get_for_model(Project)
            locations = Location.objects.filter(content_type=content_type, primary=True)
            locations = locations.exclude(latitude=0, longitude=0)
            project_ids = [location.object_id for location in locations]
            return self.filter(id__in=project_ids)

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

        def budget_employment(self):
            return self.filter(budgetitem__item__exact='employment').annotate(budget_employment=Sum('budgetitem__amount'),)

        def budget_building(self):
            return self.filter(budgetitem__item__exact='building').annotate(budget_building=Sum('budgetitem__amount'),)

        def budget_training(self):
            return self.filter(budgetitem__item__exact='training').annotate(budget_training=Sum('budgetitem__amount'),)

        def budget_maintenance(self):
            return self.filter(budgetitem__item__exact='maintenance').annotate(budget_maintenance=Sum('budgetitem__amount'),)

        def budget_management(self):
            return self.filter(budgetitem__item__exact='management').annotate(budget_management=Sum('budgetitem__amount'),)

        def budget_other(self):
            return self.filter(budgetitem__item__exact='other').annotate(budget_other=Sum('budgetitem__amount'),)

        def budget_total(self):
            return self.annotate(budget_total=Sum('budgetitem__amount'),).distinct()

        def donated(self):
            return self.filter(invoice__status=PAYPAL_INVOICE_STATUS_COMPLETE).annotate(donated=Sum('invoice__amount_received'),).distinct()

        def pledged(self, org=None):
            if org:
                self.filter(funding_organisation__exact=org)
            return self.annotate(pledged=Sum('fundingpartner__funding_amount'),)

        def funding(self, organisation=None):
            '''create extra columns "funds_needed", "pledged" and "donated"
            that calculate the respective values for each project in the queryset
            '''
            funding_queries = {
                #how much money does the project need to be fully funded, given that all pending donations complete
                'funds_needed':
                    ''' (SELECT DISTINCT (
                            SELECT CASE
                                WHEN Sum(amount) IS NULL THEN 0
                                ELSE Sum(amount)
                            END
                            FROM rsr_budgetitem
                            WHERE rsr_budgetitem.project_id = rsr_project.id
                        ) - (
                            SELECT CASE
                                WHEN Sum(funding_amount) IS NULL THEN 0
                                ELSE Sum(funding_amount)
                            END
                            FROM rsr_fundingpartner
                            WHERE rsr_fundingpartner.project_id = rsr_project.id
                        ) - (
                            SELECT CASE
                                WHEN Sum(amount) IS NULL THEN 0
                                ELSE Sum(amount)
                            END
                            FROM rsr_invoice
                            WHERE rsr_invoice.project_id = rsr_project.id
                            AND rsr_invoice.status = %d
                        ) - (
                            SELECT CASE
                                WHEN Sum(amount_received) IS NULL THEN 0
                                ELSE Sum(amount_received)
                            END
                            FROM rsr_invoice
                            WHERE rsr_invoice.project_id = rsr_project.id
                            AND rsr_invoice.status = %d
                        ))
                        ''' % (PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_COMPLETE),
                    #how much money has been donated by individual donors, including pending donations
                    'donated':
                        ''' (SELECT DISTINCT (
                                SELECT CASE
                                    WHEN Sum(amount) IS NULL THEN 0
                                    ELSE Sum(amount)
                                END
                                FROM rsr_invoice
                                WHERE rsr_invoice.project_id = rsr_project.id
                                AND rsr_invoice.status = %d
                            ) + (
                                SELECT CASE
                                    WHEN Sum(amount_received) IS NULL THEN 0
                                    ELSE Sum(amount_received)
                                END
                                FROM rsr_invoice
                                WHERE rsr_invoice.project_id = rsr_project.id
                                AND rsr_invoice.status = %d
                            ))
                        ''' % (PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_COMPLETE),
                    #how much donated money from individuals is pending
                    'pending':
                        ''' (SELECT CASE
                                WHEN Sum(amount) IS NULL THEN 0
                                ELSE Sum(amount)
                            END
                            FROM rsr_invoice
                            WHERE rsr_invoice.project_id = rsr_project.id
                                AND rsr_invoice.status = %d
                            )
                        ''' % PAYPAL_INVOICE_STATUS_PENDING,
                    #the total budget for the project as per the budgetitems
                    'total_budget':
                        ''' (SELECT CASE
                                WHEN SUM(amount) IS NULL THEN 0
                                ELSE SUM(amount)
                            END
                            FROM rsr_budgetitem
                            WHERE rsr_budgetitem.project_id = rsr_project.id)
                        ''',
                }
                #how much has been pledged by organisations. if an org param is supplied
                #this is modified to show huw much _that_ org has pledged to each project
            pledged = {
                'pledged':
                    ''' (SELECT CASE
                            WHEN Sum(funding_amount) IS NULL THEN 0
                            ELSE Sum(funding_amount)
                        END
                        FROM rsr_fundingpartner
                        WHERE rsr_fundingpartner.project_id = rsr_project.id
                    '''
            }
            if organisation:
                pledged['pledged'] = '''%s
                    AND rsr_fundingpartner.funding_organisation_id = %d''' % (
                        pledged['pledged'], organisation.pk
                    )
            pledged['pledged'] = "%s)" % pledged['pledged']
            funding_queries.update(pledged)
            #return self.annotate(budget_total=Sum('budgetitem__amount'),).extra(select=funding_queries).distinct()
            return self.extra(select=funding_queries)

        def need_funding(self):
            "projects that projects need funding"
            #this hack is needed because mysql doesn't allow WHERE clause to refer to a calculated column, in this case funds_needed
            #so instead we order by funds_needed and create a list of pk:s from all projects with funds_needed > 0 and filter on those
            return self.filter(pk__in=[pk for pk, fn in self.funding().extra(order_by=['-funds_needed']).values_list('pk', 'funds_needed') if fn > 0])

        def need_funding_count(self):
            "how many projects need funding"
            return len(self.need_funding())

        def total_funds_needed(self):
            "how much money the projects still need"
            return qs_column_sum(self.funding(), 'funds_needed')

        def total_total_budget(self):
            "how much money the projects still need"
            return qs_column_sum(self.funding(), 'total_budget')

        def total_pledged(self, org=None):
            '''
            how much money has been commited to the projects
            if org is supplied, only money pledeg by that org is calculated
            '''
            return qs_column_sum(self.funding(org), 'pledged')

        def total_donated(self):
            "how much money has bee donated by individuals"
            return qs_column_sum(self.funding(), 'donated')

        def total_pending(self):
            "individual donations still pending"
            return qs_column_sum(self.funding(), 'pending')

        def total_pending_negative(self):
            "individual donations still pending NEGATIVE (used by akvo at a glance)"
            return -qs_column_sum(self.funding(), 'pending')

        def get_largest_value_sum(self, benchmarkname, cats=None):
            if cats:
                result = self.filter( #filter finds largest "benchmarkname" value in benchmarks for categories in cats
                    benchmarks__name__name=benchmarkname,
                    benchmarks__category__name__in=cats
                )
            else:
                result = self.filter( #filter finds largest "benchmarkname" value in benchmarks for all categories
                    benchmarks__name__name=benchmarkname
                )
            return result.annotate( #annotate the greatest of the "benchmarkname" values into max_value
                                   max_value=Max('benchmarks__value')).aggregate( #sum max_value for all projects
                                   Sum('max_value'))['max_value__sum'] or 0 #we want to return 0 instead of an empty QS

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
            return self.annotate(latest_update_id=Max('project_updates__id'),latest_update_date=Max('project_updates__time'))

        #the following 4 return an organisation queryset!
        def support_partners(self):
            o = Organisation.objects.all()
            return o.filter(support_partners__project__in=self)

        def sponsor_partners(self):
            o = Organisation.objects.all()
            return o.filter(sponsor_partners__project__in=self)

        def funding_partners(self):
            o = Organisation.objects.all()
            return o.filter(funding_partners__project__in=self)

        def field_partners(self):
            o = Organisation.objects.all()
            return o.filter(field_partners__project__in=self)

        def all_partners(self):
            return (self.support_partners() | self.sponsor_partners() | self.funding_partners() | self.field_partners()).distinct()


        #TODO: is this relly needed? the default QS has identical methods
    class OrganisationsQuerySet(QuerySet):
        def support_partners(self):
            orgs = Organisation.objects.all()
            return orgs.filter(support_partners__project__in=self)

        def sponsor_partners(self):
            orgs = Organisation.objects.all()
            return orgs.filter(sponsor_partners__project__in=self)

        def funding_partners(self):
            orgs = Organisation.objects.all()
            return orgs.filter(funding_partners__project__in=self)

        def field_partners(self):
            orgs = Organisation.objects.all()
            return orgs.filter(field_partners__project__in=self)

        def all_partners(self):
            orgs = Organisation.objects.all()
            return (orgs.filter(support_partners__project__in=self) | \
                    orgs.filter(sponsor_partners__project__in=self) | \
                    orgs.filter(funding_partners__project__in=self) | \
                    orgs.filter(field_partners__project__in=self)).distinct()
            #return (self.support_partners()|self.funding_partners()|self.field_partners()).distinct()

    def __unicode__(self):
        return u'%s' % self.name

    def updates_desc(self):
        """
        return ProjectUpdates for self, newest first
        """
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
                update_info  = '%s<a href="mailto:%s">%s</a><br/><br/>' % (update_info, update.user.email, update.user.email,)
            else:
                update_info  = '%s<br/>' % update_info
        else:
            update_info = "%s<br/><br/>" % (ugettext(u'No update yet'),)
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
        Test if a user is connected to self through an arganisation
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

    #shortcuts to funding/budget data for a single project
    def funding_pledged(self, organisation=None):
        return Project.objects.funding(organisation).get(pk=self.pk).pledged

    def funding_donated(self):
        return Project.objects.funding().get(pk=self.pk).donated

    def funding_total_given(self):
        # Decimal(str(result)) conversion is necessary
        # because SQLite doesn't handle decimals natively
        # See item 16 here: http://www.sqlite.org/faq.html
        # MySQL and PostgreSQL are not affected by this limitation
        result = self.funding_pledged() + self.funding_donated()
        decimal_result = Decimal(str(result))
        return decimal_result

    def funding_still_needed(self):
        result =  Project.objects.funding().get(pk=self.pk).funds_needed
        decimal_result = Decimal(str(result))
        return decimal_result

    def budget_employment(self):
        return Project.objects.budget_employment().get(pk=self.pk).budget_employment

    def budget_building(self):
        return Project.objects.budget_building().get(pk=self.pk).budget_building

    def budget_training(self):
        return Project.objects.budget_training().get(pk=self.pk).budget_training

    def budget_maintenance(self):
        return Project.objects.budget_maintenance().get(pk=self.pk).budget_maintenance

    def budget_management(self):
        return Project.objects.budget_management().get(pk=self.pk).budget_management

    def budget_other(self):
        return Project.objects.budget_other().get(pk=self.pk).budget_other

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
    def support_partners(self):
        return Project.objects.filter(pk=self.pk).support_partners()

    def sponsor_partners(self):
        return Project.objects.filter(pk=self.pk).sponsor_partners()

    def funding_partners(self):
        return Project.objects.filter(pk=self.pk).funding_partners()

    def field_partners(self):
        return Project.objects.filter(pk=self.pk).field_partners()

    def all_partners(self):
        return Project.objects.filter(pk=self.pk).all_partners()

    def show_status_large(self):
        "Show the current project status with background"
        return mark_safe("<span class='status_large' style='background-color:%s; color:inherit; display:inline-block;'>%s</span>" % (STATUSES_COLORS[self.status], self.get_status_display()))

    class Meta:
        permissions = (
            ("%s_project" % RSR_LIMITED_CHANGE, u'RSR limited change project'),
        )
        verbose_name=_('project')
        verbose_name_plural=_('projects')


class Benchmark(models.Model):
    project = models.ForeignKey(Project, related_name=_(u'benchmarks'), )
    category = models.ForeignKey(Category, verbose_name=_(u'category'), )
    name = models.ForeignKey(Benchmarkname, verbose_name=_(u'benchmark name'), )
    value = models.IntegerField(_(u'benchmark value'), )

    def __unicode__(self):
        return _(u'Category: %s, Benchmark: %d %s') % (self.category, self.value, self.name, )

    class Meta:
        ordering=['category__name', 'name__order']
        verbose_name=_('benchmark')
        verbose_name_plural=_('benchmarks')


class BudgetItem(models.Model):
    ITEM_CHOICES = (
        ('employment', _('employment')),
        ('building', _('building')),
        ('training', _('training')),
        ('maintenance', _('maintenance')),
        ('management', _('management')),
        ('other', _('other')),
    )
    project = models.ForeignKey(Project,)
    item = models.CharField(max_length=20, choices=ITEM_CHOICES, verbose_name=_('Item'))
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_('Amount'))

    class Meta:
        verbose_name = _('Budget item')
        verbose_name_plural = _('Budget items')
        unique_together= ('project', 'item')
        permissions = (
            ("%s_budget" % RSR_LIMITED_CHANGE, u'RSR limited change budget'),
        )

class PublishingStatus(models.Model):
    """
    Keep track of publishing status. Only for projects now, but possible to
    extend to other object types.
    """
    PUBLISHING_STATUS = (
        ('unpublished', 'Unpublished'),
        ('published', 'Published'),
    )
    #TODO: change to a generic relation if we want to have publishing stats on
    #other objects than projects
    project = models.OneToOneField(Project,)
    status  = models.CharField(max_length=30, choices=PUBLISHING_STATUS, default='unpublished')
    class Meta:
        verbose_name        = _('publishing status')
        verbose_name_plural = _('publishing statuses')

    def project_info(self):
        return self.project


class Link(models.Model):
    LINK_KINDS = (
        ('A', _('Akvopedia entry')),
        ('E', _('External link')),
    )
    kind = models.CharField(_('kind'), max_length=1, choices=LINK_KINDS)
    url = models.URLField(_(u'URL'))
    caption = models.CharField(_('caption'), max_length=50)
    project = models.ForeignKey(Project, related_name='links')

    def __unicode__(self):
        return self.url

    def show_link(self):
        return '<a href="%s">%s</a>' % (self.url, self.caption,)

    class Meta:
        verbose_name = _('link')
        verbose_name_plural = _('links')



class FundingPartner(models.Model):
    funding_organisation = models.ForeignKey(Organisation, related_name='funding_partners', limit_choices_to = {'funding_partner__exact': True})
    funding_amount = models.DecimalField(_('funding amount'), max_digits=10, decimal_places=2)
    project = models.ForeignKey(Project,)

    class Meta:
        verbose_name = _('Funding partner')
        verbose_name_plural = _('Funding partners')

    def __unicode__(self):
        return "%s %d %s" % (self.funding_organisation.name, self.funding_amount, self.project.get_currency_display())

class SponsorPartner(models.Model):
    sponsor_organisation = models.ForeignKey(Organisation, related_name='sponsor_partners', limit_choices_to = {'sponsor_partner__exact': True})
    project = models.ForeignKey(Project,)

    class Meta:
        verbose_name = _('Sponsor partner')
        verbose_name_plural = _('Sponsor partners')

    def __unicode__(self):
        return "%s" % (self.sponsor_organisation.name, )

class SupportPartner(models.Model):
    support_organisation = models.ForeignKey(Organisation, related_name='support_partners', limit_choices_to = {'support_partner__exact': True})
    project = models.ForeignKey(Project,)

    class Meta:
        verbose_name = _('Support partner')
        verbose_name_plural = _('Support partners')

    def __unicode__(self):
        return "%s" % (self.support_organisation.name, )

class FieldPartner(models.Model):
    field_organisation = models.ForeignKey(Organisation, related_name='field_partners', limit_choices_to = {'field_partner__exact': True})
    project = models.ForeignKey(Project,)

    class Meta:
        verbose_name = _('Field partner')
        verbose_name_plural = _('Field partners')

    def __unicode__(self):
        return "%s" % (self.field_organisation.name, )

# kept for updating database. may be renamed Funding for certain DBs
#class Budget(models.Model):
#    project             = models.OneToOneField(Project, primary_key=True)
#    date_request_posted = models.DateField(default=date.today)
#    date_complete       = models.DateField(null=True, blank=True)
#    # budget itmes
#    employment          = models.IntegerField()
#    building            = models.IntegerField()
#    training            = models.IntegerField()
#    maintenance         = models.IntegerField()
#    other               = models.IntegerField()
#
#
#    def __unicode__(self):
#        return self.project.__unicode__()

PHOTO_LOCATIONS = (
    ('B', _('At the beginning of the update')),
    ('E', _('At the end of the update')),
)
UPDATE_METHODS = (
    ('W', _('web')),
    ('E', _('e-mail')),
    ('S', _('SMS')),
)

class UserProfileManager(models.Manager):
    def process_sms(self, mo_sms):
        try:
            profile = self.get(phone_number__exact=mo_sms.sender) # ??? reporter instead ???
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
    phone_number = models.CharField(max_length=50, blank=True)# TODO: check uniqueness if non-empty
    validation = models.CharField(_('validation code'), max_length=20, blank=True)

    objects = UserProfileManager()

    # "constants" for use with SMS updating workflow
    VALIDATED = 'IS_VALID' # _ in IS_VALID guarantees validation code will never be generated to equal VALIDATED
    WORKFLOW_SMS_UPDATE = 'SMS update' #Name of workflow for SMS updating
    STATE_PHONE_NUMBER_ADDED = 'Phone number added' #Phone number has been added to the profile
    #STATE_PHONE_NUMBER_VALIDATED = 'Phone number validated' #The phone has been validated with a validation code SMS
    STATE_UPDATES_ENABLED = 'Updates enabled' #The phone is enabled, registered reporters will create updates on respective project
    STATE_PHONE_DISABLED = 'Phone disabled' #The phone is disabled, preventing the processing of incoming SMSs
    TRANSITION_ADD_PHONE_NUMBER = 'Add phone number'
    TRANSITION_VALIDATE_PHONE_NUMBER = 'Validate phone number'
    TRANSITION_ENABLE_UPDATING = 'Enable updating'
    TRANSITION_DISABLE_UPDATING = 'Disable updating'
    GROUP_SMS_UPDATER = u'SMS updater'
    GROUP_SMS_MANAGER = u'SMS manager'
    ROLE_SMS_UPDATER = u'SMS updater'
    ROLE_SMS_MANAGER = u'SMS manager'
    PERMISSION_ADD_SMS_UPDATES = 'add_sms_updates'
    PERMISSION_MANAGE_SMS_UPDATES = 'manage_sms_updates'
    GATEWAY_42IT = '42it'

    class Meta:
        verbose_name = _('user profile')
        verbose_name_plural = _('user profiles')

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
    get_is_active.short_description = 'user is activated (may log in)'

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
    get_is_org_admin.short_description = 'user is an organisation administrator'

    def set_is_org_admin(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_ADMINS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_ADMINS)

    def get_is_org_editor(self):
        return GROUP_RSR_PARTNER_EDITORS in groups_from_user(self.user)
    get_is_org_editor.boolean = True #make pretty icons in the admin list view
    get_is_org_editor.short_description = 'user is a project editor'

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
                logger.info('%s(): SMS updating set up for project %s, user %s.' % (who_am_i(), project, self.user))
            logger.debug("Exiting: %s()" % who_am_i())
            return reporter
        except:
            numbers = self.available_gateway_numbers()
            if numbers:
                new_number = numbers[0]
                reporter = SmsReporter.objects.create(userprofile=self, project=project, gw_number=new_number)
                if project:
                    self.enable_reporting(reporter)
                    logger.info('%s(): SMS updating set up for project %s, user %s.' % (who_am_i(), project, self.user))
                logger.debug("Exiting: %s()" % who_am_i())
                return reporter
            else:
                logger.error("%s(): No numbers defined for gateway. Can't create a reporter for user %s ." % (who_am_i(), self.user))
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
                logger.info('SMS updating cancelled for project: %s Locals:\n %s\n\n' % (sms_reporter.project, locals(), ))
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
    has_perm_add_sms_updates.short_description = 'may create SMS project updates'


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

    project = models.ForeignKey(Project, related_name='project_updates', verbose_name=_('project'))
    user = models.ForeignKey(User, verbose_name=_('user'))
    title = models.CharField(_('title'), max_length=50, help_text=_('50 characters'))
    text = models.TextField(_('text'), blank=True)
    #status = models.CharField(max_length=1, choices=STATUSES, default='N')
    photo = ImageWithThumbnailsField(
                blank=True,
                upload_to=image_path,
                thumbnail={'size': (300, 225), 'options': ('autocrop', 'sharpen', )},
                help_text = 'The image should have 4:3 height:width ratio for best displaying result',
            )
    photo_location = models.CharField(_('photo location'), max_length=1,
                                       choices=PHOTO_LOCATIONS)
    photo_caption = models.CharField(_('photo caption'), blank=True, max_length=75, help_text=_('75 characters'))
    photo_credit = models.CharField(_('photo credit'), blank=True, max_length=25, help_text=_('25 characters'))
    video = models.URLField(_('video URL'), blank=True, help_text=_('Supported providers: Blip, Vimeo, YouTube'), verify_exists=False)
    video_caption = models.CharField(_('video caption'), blank=True, max_length=75, help_text=_('75 characters'))
    video_credit = models.CharField(_('video credit'), blank=True, max_length=25, help_text=_('25 characters'))
    update_method = models.CharField(_('update method'), blank=True, max_length=1, choices=UPDATE_METHODS, default='W')
    time = models.DateTimeField(_('time'), auto_now_add=True)
    time_last_updated = models.DateTimeField(_('time last updated'), auto_now=True)
    featured = models.BooleanField(_('featured'))

    class Meta:
        get_latest_by = "time"
        verbose_name = _('project update')
        verbose_name_plural = _('project updates')

    def img(self, value=''):
        try:
            return self.photo.thumbnail_tag
        except:
            return value
    img.allow_tags = True

    def get_is_featured(self):
        return self.featured
    get_is_featured.boolean = True #make pretty icons in the admin list view
    get_is_featured.short_description = 'update is featured'

    def get_video_thumbnail_url(self, url=''):
        if self.video:
            try:
                oembed_resource = oembed.site.embed(self.video)
                data = oembed_resource.get_data()
                url = data.get('thumbnail_url', '')
            except:
                pass
        return url

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
        return u'Project update for %s' % self.project.name


class ProjectComment(models.Model):
    project = models.ForeignKey(Project, verbose_name=_('project'))
    user = models.ForeignKey(User, verbose_name=_('user'))
    comment = models.TextField(_('comment'))
    time = models.DateTimeField(_('time'))


# Payment engines
class PaymentGateway(models.Model):
    name = models.CharField(max_length=255, help_text=_(u'Use a short, descriptive name.'))
    description = models.TextField(blank=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='EUR')
    notification_email = models.EmailField(_(u'notification email'),
        help_text=_(u'When a donation is completed successfully, notification emails will be sent to the donor and to this address.'))

    def __unicode__(self):
        return u'%s - %s' % (self.name, self.get_currency_display())

    class Meta:
        abstract = True

class PayPalGateway(PaymentGateway):
    PAYPAL_LOCALE_CHOICES = (
        ('US', _(u'US English')),
    )
    account_email = models.EmailField()
    locale = models.CharField(max_length=2, choices=PAYPAL_LOCALE_CHOICES, default='US')

    class Meta:
        verbose_name = _(u'PayPal gateway')

class MollieGateway(PaymentGateway):
    partner_id = models.CharField(max_length=10)

    class Meta:
        verbose_name = _(u'Mollie/iDEAL gateway')

class PaymentGatewaySelector(models.Model):
    project = models.OneToOneField(Project)
    paypal_gateway = models.ForeignKey(PayPalGateway, default=1)
    mollie_gateway = models.ForeignKey(MollieGateway, default=1)

    def __unicode__(self):
        return u'%s - %s' % (self.project.id, self.project.name)

    class Meta:
        verbose_name = _(u'Project payment gateway configuration')

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
        (PAYPAL_INVOICE_STATUS_PENDING, _('Pending')),
        (PAYPAL_INVOICE_STATUS_VOID, _('Void')),
        (PAYPAL_INVOICE_STATUS_COMPLETE, _('Complete')),
        (PAYPAL_INVOICE_STATUS_STALE, _('Stale')),
    )
    PAYMENT_ENGINES = (
        ('paypal', _('PayPal')),
        ('ideal', _('iDEAL')),
    )
    # Setup
    test = models.BooleanField(_('test donation'),
        help_text=_('This flag is set if the donation was made in test mode.'))
    engine = models.CharField(_('payment engine'), choices=PAYMENT_ENGINES,
        max_length=10, default='paypal')
    user = models.ForeignKey(User, blank=True, null=True)
    project = models.ForeignKey(Project)
    # Common
    amount = models.PositiveIntegerField(help_text=_('Amount requested by user.'))
    amount_received = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                          help_text=_('Amount actually received after charges have been applied.'))
    time = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=75, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.PositiveSmallIntegerField(_('status'), choices=STATUS_CHOICES, default=1)
    http_referer = models.CharField(_('HTTP referer'), max_length=255, blank=True)
    campaign_code = models.CharField(_('Campaign code'), blank=True, max_length=15)
    is_anonymous = models.BooleanField(_('anonymous donation'))
    # PayPal
    ipn = models.CharField(_('PayPal IPN'), blank=True, null=True, max_length=75)
    # Mollie
    bank = models.CharField(_('mollie.nl bank ID'), max_length=4, choices=get_mollie_banklist(), blank=True)
    transaction_id = models.CharField(_('mollie.nl transaction ID'), max_length=100, blank=True)

    admin_objects = models.Manager()
    objects = InvoiceManager()

    def get_favicon(self):
        pass # @ grab favicon from HTTP_REFERER site

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
        return u'Invoice %s (Project: %s)' % (self.id, self.project)

    class Meta:
        verbose_name = _('invoice')


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

    organisation = models.ForeignKey(Organisation, help_text=_('Select your organisation from the drop-down list.'))
    hostname = models.CharField(_('Hostname'), max_length=50, unique=True,
        help_text=_('''
            <p>
                Your hostname is used in the default web address of your partner site.
                The web address created from  the hostname <em>myorganisation</em> would be
                <em>http://myorganisation.akvoapp.org/</em>.
            </p>
        ''')
    )
    cname = NullCharField(_('CNAME'), max_length=100, unique=True, blank=True, null=True,
        help_text=_('''
            <p>
                Enter a custom domain name for accessing the partner site,
                for example <i>projects.mydomain.org</i>. Optional. Requires additional DNS setup.
            </p>
        ''')
    )
    custom_return_url = models.URLField(_('Return URL'), blank=True,
        help_text=_('''
            <p>
                Enter the full URL (including http://) for the page to which users
                should be returned when leaving the partner site.
            </p>
        ''')
    )
    custom_css = models.FileField(_('Stylesheet'), blank=True, upload_to=custom_css_path)
    custom_logo = models.FileField(_('Organisation banner logo'), blank=True, upload_to=custom_logo_path,
        help_text=_('''
            <p>
                Upload a logo file for the banner at the top of the partner site page.
                By default the logo currently used by www.akvo.org will be displayed.
            </p>
        ''')
    )
    custom_favicon = models.FileField(_('favicon'), blank=True, upload_to=custom_favicon_path,
        help_text=_('''
            <p>
                A favicon (.ico file) is the 16x16 pixel image shown inside the browser's location bar,
                on tabs and in the bookmark menu.
            </p>
        ''')
    )
    about_box = models.TextField(_(_(u'about box text'), ), max_length=500, blank=True,
        help_text=_('''
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
        ''')
    )
    about_image = models.ImageField(_('about box image'), blank=True, upload_to=about_image_path,
        help_text=_('''
            <p>
                The background image for the About box <em>must</em> be 470 pixels wide and 250 pixels tall.
                It is however optional.
            </p>
        ''')
    )

    enabled = models.BooleanField(_('enabled'), default=True)

    def __unicode__(self):
        return u'Partner site for %s' % self.organisation.name

    @property
    def logo(self):
        return self.custom_logo or None

    @property
    def return_url(self):
        return self.custom_return_url or self.organisation.url or None

    @property
    def stylesheet(self):
        return self.custom_css or None

    @property
    def favicon(self):
        return self.custom_favicon or None


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

#m2m_changed.connect(manage_workflow_roles, sender=User.groups.through)
