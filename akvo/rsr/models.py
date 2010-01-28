# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import urllib2
import string
import re
import os
from datetime import date, datetime, timedelta
from decimal import Decimal

from django import forms
from django.conf import settings
from django.db import models
from django.db.models import Sum, F
from django.db.models.query import QuerySet
from django.db.models.signals import pre_save, post_save
from django.contrib import admin
from django.contrib.auth.models import Group, User
from django.contrib.sites.models import Site
#from django.core import validators
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.template import loader, Context
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from mollie.ideal.utils import get_mollie_banklist
from paypal.standard.ipn.signals import payment_was_flagged
from registration.models import RegistrationProfile, RegistrationManager
from sorl.thumbnail.fields import ImageWithThumbnailsField
from akvo.settings import MEDIA_ROOT

from utils import (GROUP_RSR_EDITORS, RSR_LIMITED_CHANGE, GROUP_RSR_PARTNER_ADMINS,
				   GROUP_RSR_PARTNER_EDITORS)
from utils import (PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_VOID,
				   PAYPAL_INVOICE_STATUS_COMPLETE, PAYPAL_INVOICE_STATUS_STALE)
from utils import groups_from_user, rsr_image_path, rsr_send_mail_to_users, qs_column_sum
from signals import (change_name_of_file_on_change, change_name_of_file_on_create,
    create_publishing_status, create_organisation_account,
    create_payment_gateway_selector, donation_completed)

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
            
CONTINENTS = (
    (1, _('Africa')),
    (2, _('Asia')),
    (3, _('Australia')),
    (4, _('Europe')),
    (5, _('North America')),
    (6, _('South America')),
)
class Country(models.Model):
    
    country_name                = models.CharField(_(u'country name'), max_length=50, unique=True,)
    continent                   = models.IntegerField(_(u'continent'), choices=CONTINENTS)

    def __unicode__(self):
        return self.country_name

    class Meta:
        verbose_name = _('country')
        verbose_name_plural = _('countries')
        ordering = ['country_name']


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
        return rsr_image_path(instance, file_name, 'db/org/%s/%s')

    #type                        = models.CharField(max_length=1, choices=PARNER_TYPES)
    field_partner               = models.BooleanField(_(u'field partner'))
    support_partner             = models.BooleanField(_(u'support partner'))
    funding_partner             = models.BooleanField(_(u'funding partner'))
    sponsor_partner             = models.BooleanField(_(u'sponsor partner'))

    name                        = models.CharField(_('name'), max_length=25, help_text=_('Short name which will appear in organisation and partner listings (25 characters).')
    							)
    long_name                   = models.CharField(_('long name'), blank=True, max_length=75, help_text=_('Full name of organisation (75 characters).')
    							)
    organisation_type           = models.CharField(_('organisation type'), max_length=1, choices=ORG_TYPES)

    logo                        = ImageWithThumbnailsField(
    								_('logo'),
                                    blank=True,
                                    upload_to=image_path,
                                    thumbnail={'size': (360,270)},
                                    help_text=_('Logos should be approximately 360x270 pixels (approx. 100-200kb in size) on a white background.'),
                                )
    city                        = models.CharField(_('city'), max_length=25)
    state                       = models.CharField(_('state'), max_length=15)
    country                     = models.ForeignKey(Country)
    url                         = models.URLField(blank=True, verify_exists = False, help_text=_('Enter the full address of your web site, beginning with http://.'))
    map                         = models.ImageField(
                                    _('map'),
                                    blank=True,
                                    upload_to=image_path,
                                    help_text=_('The map image should be roughly square and no larger than 240x240 pixels (approx. 100-200kb in size).'),
                                )
    address_1                   = models.CharField(_('address 1'), blank=True, max_length=35, help_text=_('Street address (35 characters).'))
    address_2                   = models.CharField(_('address 2'), blank=True, max_length=35, help_text=_('Street address 2 (35 characters).'))
    postcode                    = models.CharField(_('post code'), blank=True, max_length=10, help_text=_('Postcode, zip code, etc. (10 characters).'))
    phone                       = models.CharField(_('phone'), blank=True, max_length=20, help_text=_('(20 characters).'))
    mobile                      = models.CharField(_('mobile'), blank=True, max_length=20, help_text=_('(20 characters).'))
    fax                         = models.CharField(_('fax'), blank=True, max_length=20, help_text=_('(20 characters).'))
    contact_person              = models.CharField(_('contact person'), blank=True, max_length=30, help_text=_('Name of external contact person for your organisation.'))
    contact_email               = models.CharField(_('contact email'), blank=True, max_length=50, help_text=_('Email to which inquiries about your organisation should be sent.'))
    description                 = models.TextField(_('description'), blank=True, help_text=_('Describe what your organisation does in the water and sanitation sector.') )

    #Managers, one default, one custom
    #objects = models.Manager()    
    objects     = QuerySetManager()
    projects    = ProjectsQuerySetManager()

    def get_absolute_url(self):
        return '/rsr/organisation/%d/' % self.id
    
    class QuerySet(QuerySet):
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

    def partner_types(self):
        pt = ""
        if self.field_partner: pt += "F"
        if self.support_partner: pt += "S"
        if self.sponsor_partner: pt += "P"
        if self.funding_partner: pt += "M"
        return pt
    
    def has_water_projects(self):
        if self.all_projects().filter(category_water__exact=True):
            return True
        else:
            return False

    def has_sanitation_projects(self):
        if self.all_projects().filter(category_sanitation__exact=True):
            return True
        else:
            return False
    
    def has_training_projects(self):
        if self.all_projects().filter(category_training__exact=True):
            return True
        else:
            return False
            
    def has_maintenance_projects(self):
        if self.all_projects().filter(category_maintenance__exact=True):
            return True
        else:
            return False
    
    def has_education_projects(self):
        if self.all_projects().filter(category_education__exact=True):
            return True
        else:
            return False

    def has_product_development_projects(self):
        if self.all_projects().filter(category_product_development__exact=True):
            return True
        else:
            return False

    def has_other_projects(self):
        if self.all_projects().filter(category_other__exact=True):
            return True
        else:
            return False
    
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

    def partners(self):
        '''
        returns a queryset of all organisations that self has at least one project in common with, excluding self
        '''
        return Project.organisations.filter(pk__in=self.published_projects()).all_partners().exclude(id__exact=self.id)
   
    def funding(self):
        my_projs = self.published_projects().status_not_cancelled()
        # Fix for problem with pledged. my_projs.euros().total_pledged(self) won't
        # work because values_list used in qs_column_sum will not return more
        # than one of the same value. This leads to the wrong sum when same amount
        # has been pledged to multiple projects
        all_active = Project.objects.published().status_not_cancelled()
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
)
#STATUSES_DICT = dict(STATUSES) #used to output STATUSES text
STATUSES_COLORS = {'N':'black', 'A':'green', 'H':'orange', 'C':'grey', 'L':'red', }


class OrganisationsQuerySetManager(QuerySetManager):
    def get_query_set(self):
        return self.model.OrganisationsQuerySet(self.model)

class Project(models.Model):
    def image_path(instance, file_name):
        return rsr_image_path(instance, file_name, 'db/project/%s/%s')

    name                        = models.CharField(_('name'), max_length=45, help_text=_('A short descriptive name for your project (45 characters).'))
    subtitle                    = models.CharField(_('subtitle'), max_length=75, help_text=_('A subtitle with more information on the project (75 characters).'))
    status                      = models.CharField(_('status'), max_length=1, choices=STATUSES, default='N', help_text=_('Current project state.'))
    city                        = models.CharField(_('city'), max_length=25, help_text=_('Name of city, village, town, slum, etc. (25 characters).'))
    state                       = models.CharField(_('state'), max_length=15, help_text=_('Name of state, province, county, region, etc. (15 characters).'))
    country                     = models.ForeignKey(Country, help_text=_('Country where project is taking place.'))
    map                         = models.ImageField(
                                    _('map'),
                                    blank=True,
                                    upload_to=image_path,
                                    help_text=_('The map image should be roughly square and no larger than 240x240 pixels (approx. 100-200kb in size).')
                                )
    #Project categories
    category_water              = models.BooleanField(_('water'))
    category_sanitation         = models.BooleanField(_('sanitation'))
    category_maintenance        = models.BooleanField(_('maintenance'))
    category_training           = models.BooleanField(_('training'))
    category_education          = models.BooleanField(_('education'))
    category_product_development= models.BooleanField(_('product development'))
    category_other              = models.BooleanField(_('other'))
    
    #current_status_summary = models.TextField()
    project_plan_summary        = models.TextField(_('summary of project plan'), max_length=220, help_text=_('Briefly summarize the project (220 characters).'))
    current_image               = ImageWithThumbnailsField(
                                    _('project photo'),
                                    blank=True,
                                    upload_to=image_path,
                                    thumbnail={'size': (240, 180), 'options': ('autocrop', 'detail', )}, #detail is a mild sharpen
                                    help_text=_('The project image looks best in landscape format (4:3 width:height ratio), and should be less than 3.5 mb in size.'),
                                )
    current_image_caption       = models.CharField(_('photo caption'), blank=True, max_length=50, help_text=_('Enter a caption for your project picture (50 characters).'))
    goals_overview              = models.TextField(_('overview'), max_length=500, help_text=_('Describe what the project hopes to accomplish (500 characters).'))
    goal_1                      = models.CharField(_('goal 1'), blank=True, max_length=60, help_text=_('(60 characters)'))
    goal_2                      = models.CharField(_('goal 2'), blank=True, max_length=60)
    goal_3                      = models.CharField(_('goal 3'), blank=True, max_length=60)
    goal_4                      = models.CharField(_('goal 4'), blank=True, max_length=60)
    goal_5                      = models.CharField(_('goal 5'), blank=True, max_length=60)
    #Project target benchmarks
    water_systems               = models.IntegerField(_('water systems'), default=0)
    sanitation_systems          = models.IntegerField(_('sanitation systems'), default=0)
    hygiene_facilities          = models.IntegerField(_('hygiene facilities'), default=0)
    improved_water              = models.IntegerField(_('water: # people affected'), default=0)
    improved_water_years        = models.IntegerField(_('for # years'), default=0)
    improved_sanitation         = models.IntegerField(_('sanitation: # people affected'), default=0)
    improved_sanitation_years   = models.IntegerField(_('for # years'), default=0)
    trainees                    = models.IntegerField(_('# people trained'), default=0)
    #mdg_count_water             = models.IntegerField(default=0)
    #mdg_count_sanitation        = models.IntegerField(default=0)

    location_1                  = models.CharField(_('location 1'), blank=True, max_length=50, help_text=_('Street address (50 characters).'))
    location_2                  = models.CharField(_('location 2'), blank=True, max_length=50, help_text=_('Street address 2 (50 characters).'))
    postcode                    = models.CharField(_('post code'), blank=True, max_length=10, help_text=_('Postcode, zip code, etc. (10 characters).'))
    longitude                   = models.CharField(_('longitude'), blank=True, max_length=20, help_text=_(u'East/west measurement(λ) in degrees/minutes/seconds, for example 23° 27′ 30" E.'))
    latitude                    = models.CharField(_('latitude'), blank=True, max_length=20, help_text=_(u'North/south measurement(ϕ) in degrees/minutes/seconds, for example 23° 26′ 21″ N.'))
    current_status_detail       = models.TextField(_('Current status detail'), blank=True, max_length=600, help_text=_('Description of current phase of project. (600 characters).'))
    project_plan_detail         = models.TextField(_('Project plan detail'), blank=True, help_text=_('Detailed information about the project and plans for implementing: the what, how, who and when. (unlimited).'))
    sustainability              = models.TextField(_('sustainability'), help_text=_('Describe plans for sustaining/maintaining results after implementation is complete (unlimited).'))
    context                     = models.TextField(_('context'), blank=True, max_length=500, help_text=_('Relevant background information, including geographic, political, environmental, social and/or cultural issues (500 characters).'))

    project_rating              = models.IntegerField(_('Project rating'), default=0)
    notes                       = models.TextField(_('notes'), blank=True, help_text=_('(Unlimited number of characters).'))

    #budget    
    currency            = models.CharField(_('currency'), choices=CURRENCY_CHOICES, max_length=3, default='EUR')
    date_request_posted = models.DateField(_('Date request posted'), default=date.today)
    date_complete       = models.DateField(_('Date complete'), null=True, blank=True)

    #Custom manager
    #based on http://www.djangosnippets.org/snippets/562/ and
    #http://simonwillison.net/2008/May/1/orm/
    objects = QuerySetManager()
    organisations = OrganisationsQuerySetManager()

    @models.permalink
    def get_absolute_url(self):
        return ('project_main', (), {'project_id': self.pk})
    
    class QuerySet(QuerySet):
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
    
        def status_cancelled(self):
            return self.filter(status__exact='L')
        
        def status_not_cancelled(self):
            return self.exclude(status__exact='L')
      
        def euros(self):
            return self.filter(currency='EUR')

        def dollars(self):
            return self.filter(currency='USD')

        def budget_employment(self):
            return self.filter(budgetitem__item__exact='employment').annotate(
                budget_employment=Sum('budgetitem__amount'),
            )

        def budget_building(self):
            return self.filter(budgetitem__item__exact='building').annotate(
                budget_building=Sum('budgetitem__amount'),
            )

        def budget_training(self):
            return self.filter(budgetitem__item__exact='training').annotate(
                budget_training=Sum('budgetitem__amount'),
            )

        def budget_maintenance(self):
            return self.filter(budgetitem__item__exact='maintenance').annotate(
                budget_maintenance=Sum('budgetitem__amount'),
            )

        def budget_management(self):
            return self.filter(budgetitem__item__exact='management').annotate(
                budget_management=Sum('budgetitem__amount'),
            )

        def budget_other(self):
            return self.filter(budgetitem__item__exact='other').annotate(
                budget_other=Sum('budgetitem__amount'),
            )

        def budget_total(self):
            return self.annotate(budget_total=Sum('budgetitem__amount'),).distinct()

        def donated(self):
            return self.filter(invoice__status=PAYPAL_INVOICE_STATUS_COMPLETE).annotate(
                donated=Sum('invoice__amount_received'),
            ).distinct()

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
                    ''' SELECT DISTINCT (
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
                        )
                    ''' % (PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_COMPLETE),
                #how much money has been donated by individual donors, including pending donations
                'donated':
                    ''' SELECT DISTINCT (
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
                        )
                    ''' % (PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_COMPLETE),
                #how much donated money from individuals is pending
                'pending':
                    ''' SELECT CASE
                            WHEN Sum(amount) IS NULL THEN 0
                            ELSE Sum(amount)
                        END
                        FROM rsr_invoice
                        WHERE rsr_invoice.project_id = rsr_project.id
                            AND rsr_invoice.status = %d
                    ''' % PAYPAL_INVOICE_STATUS_PENDING,
                #the total budget for the project as per the budgetitems
                'total_budget':
                    ''' SELECT CASE
                            WHEN SUM(amount) IS NULL THEN 0
                            ELSE SUM(amount)
                        END
                        FROM rsr_budgetitem
                        WHERE rsr_budgetitem.project_id = rsr_project.id
                    ''',
            }
            #how much has been pledged by organisations. if an org param is supplied
            #this is modified to show huw much _that_ org has pledged to each project
            pledged = {
                'pledged':
                    ''' SELECT CASE
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
            
        def get_planned_water_calc(self):
            "how many will get improved water"
            return qs_column_sum(self.status_not_cancelled(), 'improved_water') - qs_column_sum(self.status_complete(), 'improved_water')

        def get_planned_sanitation_calc(self):
            "how many will get improved sanitation"
            return qs_column_sum(self.status_not_cancelled(), 'improved_sanitation') - qs_column_sum(self.status_complete(), 'improved_sanitation')

        def get_actual_water_calc(self):
            "how many have gotten improved water"
            return qs_column_sum(self.status_complete(), 'improved_water')

        def get_actual_sanitation_calc(self):
            "how many have gotten improved sanitation"
            return qs_column_sum(self.status_complete(), 'improved_sanitation')

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
        return self.name
        
    def project_type(self):
        pt = ""
        if self.category_water: pt += "W"
        if self.category_sanitation: pt += "S"
        if self.category_maintenance: pt += "M"
        if self.category_training: pt += "T"
        if self.category_education: pt += "E"
        if self.category_product_development: pt += "P"
        if self.category_other: pt += "O"
        return pt
    #project_type.allow_tags = True
    
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

    class Meta:
        permissions = (
            ("%s_project" % RSR_LIMITED_CHANGE, u'RSR limited change project'),
        )

class BudgetItem(models.Model):
    ITEM_CHOICES = (
        ('employment', _('employment')),
        ('building', _('building')),
        ('training', _('training')),
        ('maintenance', _('maintenance')),
        ('management', _('management')),
        ('other', _('other')),
    )
    project             = models.ForeignKey(Project)
    item                = models.CharField(max_length=20, choices=ITEM_CHOICES, verbose_name=_('Item'))
    amount              = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_('Amount'))
    
    class Meta:
    	verbose_name=_('Budget Item')
    	verbose_name_plural=_('Budget Items')
        unique_together     = ('project', 'item')
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
        verbose_name_plural = 'publishing statuses'

    def project_info(self):
        return '%d - %s' % (self.project.pk, self.project,)

    
class Link(models.Model):
    LINK_KINDS = (
        ('A', _('Akvopedia entry')),
        ('E', _('External link')),
    )
    kind    = models.CharField(_('kind'), max_length=1, choices=LINK_KINDS)
    url     = models.URLField(_(u'URL'))
    caption = models.CharField(_('caption'), max_length=50)
    project = models.ForeignKey(Project)
    
    def __unicode__(self):
        return self.url
    
    def show_link(self):
        return '<a href="%s">%s</a>' % (self.url, self.caption,)


class FundingPartner(models.Model):
    funding_organisation    = models.ForeignKey(Organisation, related_name='funding_partners', limit_choices_to = {'funding_partner__exact': True})
    funding_amount          = models.DecimalField(_('funding amount'), max_digits=10, decimal_places=2)
    project                 = models.ForeignKey(Project,)
    
    class Meta:
    	verbose_name=_('Funding partner')
    	verbose_name_plural=_('Funding partners')

    def __unicode__(self):
        return "%s %d %s" % (self.funding_organisation.name, self.funding_amount, self.project.get_currency_display())

class SponsorPartner(models.Model):
    sponsor_organisation    = models.ForeignKey(Organisation, related_name='sponsor_partners', limit_choices_to = {'sponsor_partner__exact': True})
    project                 = models.ForeignKey(Project,)
    
    class Meta:
    	verbose_name=_('Sponsor partner')
    	verbose_name_plural=_('Sponsor partners')

    def __unicode__(self):
        return "%s" % (self.sponsor_organisation.name, )

class SupportPartner(models.Model):
    support_organisation    = models.ForeignKey(Organisation, related_name='support_partners', limit_choices_to = {'support_partner__exact': True})
    project                 = models.ForeignKey(Project,)

    class Meta:
    	verbose_name=_('Support partner')
    	verbose_name_plural=_('Support partners')

    def __unicode__(self):
        return "%s" % (self.support_organisation.name, )

class FieldPartner(models.Model):
    field_organisation      = models.ForeignKey(Organisation, related_name='field_partners', limit_choices_to = {'field_partner__exact': True})
    project                 = models.ForeignKey(Project,)

    class Meta:
    	verbose_name=_('Field partner')
    	verbose_name_plural=_('Field partners')

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
#UPDATE_METHODS_DICT = dict(UPDATE_METHODS) #used to output UPDATE_METHODS text


def isValidGSMnumber(field_data, all_data):
    #TODO: fix for django 1.0
    pass
	#if not field_data.startswith("467"):
	#	raise validators.ValidationError("The phone number must start with 467")
	#if not len(field_data) == 11:
	#	raise validators.ValidationError("The phone number must be 11 digits long.")

class UserProfile(models.Model):
    '''
    Extra info about a user.
    '''
    user            = models.OneToOneField(User)
    organisation    = models.ForeignKey(Organisation)
    phone_number    = models.CharField(
        max_length=50,
        blank=True,
        help_text=_("""Please use the following format: <strong>467XXXXXXXX</strong>.
        <br>Example: the number 070 765 43 21 would be entered as 46707654321"""),
        #TODO: fix to django 1.0
        #validator_list = [isValidGSMnumber]
    )    
    #project         = models.ForeignKey(Project, null=True, blank=True, )
    
    def __unicode__(self):
        return self.user.username

    def user_name(self):
        return self.__unicode__()
    
    def organisation_name(self):
        return self.organisation.name
    
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
    
    #mobile akvo

    def create_sms_update(self, mo_sms_raw):
        # does the user have a project to update? TODO: security!
        if self.project:
            update_data = {
                'project': self.project,
                'user': self.user,
                'title': 'SMS update',
                'update_method': 'S',
                'text': mo_sms_raw.text,
                'time': datetime.fromtimestamp(float(mo_sms_raw.delivered)),
            }
            #update_data.update(sms_data)
            pu = ProjectUpdate.objects.create(**update_data)
            return pu
        return False
        
    def create_mms_update(self, mo_mms_raw):
        # does the user have a project to update? TODO: security!
        if self.project:
            update_data = {
                'project': self.project,
                'user': self.user,
                'title': mo_mms_raw.subject,
                'update_method': 'S',
                'time': datetime.fromtimestamp(float(mo_mms_raw.time)),
            }
            attachements = mo_mms_raw.get_mms_files()
            update_data.update(attachements)
            pu = ProjectUpdate.objects.create(**update_data)
            return pu
        return False

    class Meta:
        permissions = (
            ("%s_userprofile" % RSR_LIMITED_CHANGE, u'RSR limited change user profile'),
        )

def user_activated_callback(sender, **kwargs):
    user = kwargs.get("user", False)
    if user:
        org = user.get_profile().organisation
        users = User.objects.all()
        #find all users that are 1) superusers 2) RSR editors
        #3) org admins for the same org as the just activated user
        notify = (users.filter(is_superuser=True) | users.filter(groups__name__in=[GROUP_RSR_EDITORS]) | \
            users.filter(userprofile__organisation=org, groups__name__in=[GROUP_RSR_PARTNER_ADMINS])).distinct()
        rsr_send_mail_to_users(notify,
                               subject='email/new_user_registered_subject.txt',
                               message='email/new_user_registered_message.txt',
                               subject_context={'organisation': org},
                               msg_context={'user': user, 'organisation': org}
                              )

from registration.signals import user_activated
user_activated.connect(user_activated_callback)

def create_rsr_profile(user, profile):
    return UserProfile.objects.create(user=user, organisation=Organisation.objects.get(pk=profile['org_id']))


class MoMmsRaw(models.Model):
    '''
    base data from an mms callback
    '''
    mmsid           = models.CharField(_('mms id'), max_length=100)
    subject         = models.CharField(_('subject'), max_length=200)
    sender          = models.CharField(_('sender'), max_length=20) #qs variable name is "from" but we can't use that
    to              = models.CharField(_('to'), max_length=20)
    time            = models.CharField(_('time'), max_length=50)
    saved_at        = models.DateTimeField(_('saved at'))
    mmsversion      = models.CharField(_('mms version'), max_length=20)
    messageclass    = models.IntegerField(_('message class'))
    priority        = models.IntegerField(_('priority'))
    filecount       = models.IntegerField(_('file count'))
    
    def get_mms_files(self):
        update_data ={}
        SMS_USERNAME = 'Concinnity'
        SMS_PASSWORD = '9391167'
        url_pattern = 'http://server1.msgtoolbox.com/api/current/mms/getfile.php?username=%s&password=%s&mmsid=%s&filename=%s'
        #try:
        files = MoMmsFile.objects.filter(mms__exact=self)
        for f in files:
            url = url_pattern % (SMS_USERNAME, SMS_PASSWORD, self.mmsid, f.file)
            if string.lower(f.filecontent) in ('image/gif', 'image/jpeg', 'image/png',):
                path = 'db/mmsupdateimages/%d_%s' % (self.id, f.file) #TODO: spread images over folder sub-tree
                img = open('%s%s' % (MEDIA_ROOT, path), 'w')
                img.write(urllib2.urlopen(url).read())
                update_data['photo'] = path
            elif string.lower(f.filecontent) == 'text/plain':
                update_data['text'] = urllib2.urlopen(url).read()
        #except:
        #    pass
        return update_data

class MoMmsFile(models.Model):
    '''
    raw info about an mms file attachement
    '''
    mms             = models.ForeignKey(MoMmsRaw, verbose_name=_('MMS'))
    file            = models.CharField(_('file name'), max_length=200) 
    filecontent     = models.CharField(_('content type'), max_length=50) 
    filecontentid   = models.CharField(_('content ID'), blank=True, max_length=50) 
    filesize        = models.IntegerField(_('file size')) 
    
class MoSmsRaw(models.Model):
    '''
    all request data from an mo-sms callback
    '''
    text        = models.CharField(_('text'), max_length=200)
    sender      = models.CharField(_('sender'), max_length=20)
    to          = models.CharField(_('to'), max_length=20)
    delivered   = models.CharField(_('delivered'), max_length=50)
    saved_at    = models.DateTimeField(_('saved at'))
    incsmsid    = models.CharField(_('incoming sms id'), max_length=100)

class ProjectUpdate(models.Model):
    def image_path(instance, file_name):
        "Create a path like 'db/project/<update.project.id>/update/<update.id>/image_name.ext'"
        path = 'db/project/%d/update/%%s/%%s' % instance.project.pk
        return rsr_image_path(instance, file_name, path)

    project         = models.ForeignKey(Project, related_name='project_updates', verbose_name=_('project'))
    user            = models.ForeignKey(User, verbose_name=_('user'))
    title           = models.CharField(_('title'), max_length=50)
    text            = models.TextField(_('text'), blank=True)
    #status          = models.CharField(max_length=1, choices=STATUSES, default='N')
    photo           = ImageWithThumbnailsField(
                        blank=True,
                        upload_to=image_path,
                        thumbnail={'size': (300, 225), 'options': ('autocrop', 'sharpen', )},
                        help_text = 'The image should have 4:3 height:width ratio for best displaying result',
                    )
    photo_location  = models.CharField(_('photo location'), max_length=1, choices=PHOTO_LOCATIONS, default='B')
    photo_caption   = models.CharField(_('photo caption'), blank=True, max_length=75)
    photo_credit    = models.CharField(_('photo credit'), blank=True, max_length=25)
    update_method   = models.CharField(_('update method'), blank=True, max_length=1, choices=UPDATE_METHODS, default='W')
    time            = models.DateTimeField(_('time'))
    
    class Meta:
        get_latest_by = "time"

    def img(self):
        try:
            return self.photo.thumbnail_tag
        except:
            return ''
    img.allow_tags = True

class ProjectComment(models.Model):
    project         = models.ForeignKey(Project, verbose_name=_('project'))
    user            = models.ForeignKey(User, verbose_name=_('user'))
    comment         = models.TextField(_('comment'))
    time            = models.DateTimeField(_('time'))
        

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
    amount_received = models.DecimalField(max_digits=10, decimal_places=2,
        blank=True, null=True,
        help_text=_('Amount actually received after charges have been applied.'))
    time = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=75, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.PositiveSmallIntegerField(_('status'), choices=STATUS_CHOICES, default=1)
    http_referer = models.CharField(_('HTTP referer'), max_length=255, blank=True)
    is_anonymous = models.BooleanField(_('anonymous donation'))
    # PayPal
    ipn = models.CharField(_('PayPal IPN'), blank=True, null=True, max_length=75)
    # Mollie
    bank = models.CharField(_('mollie.nl bank ID'), max_length=4,
        choices=get_mollie_banklist(), blank=True)
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


# signals!
post_save.connect(create_organisation_account, sender=Organisation)

post_save.connect(create_publishing_status, sender=Project)
post_save.connect(create_payment_gateway_selector, sender=Project)

if settings.DONATION_NOTIFICATION_EMAILS:
    post_save.connect(donation_completed, sender=Invoice)

post_save.connect(change_name_of_file_on_create, sender=Organisation)
post_save.connect(change_name_of_file_on_create, sender=Project)
post_save.connect(change_name_of_file_on_create, sender=ProjectUpdate)

pre_save.connect(change_name_of_file_on_change, sender=Organisation)
pre_save.connect(change_name_of_file_on_change, sender=Project)
pre_save.connect(change_name_of_file_on_change, sender=ProjectUpdate)

