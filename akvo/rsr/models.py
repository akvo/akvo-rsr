# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import urllib2
import string
import re
from datetime import date, datetime

from django import forms
from django.conf import settings
from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
#from django.core import validators
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from registration.models import RegistrationProfile, RegistrationManager

from akvo.settings import MEDIA_ROOT

CONTINENTS = (
    (1, u'Africa'),
    (2, u'Asia'),
    (3, u'Australia'),
    (4, u'Europe'),
    (5, u'North America'),
    (6, u'South America'),
)
class Country(models.Model):
    
    country_name                = models.CharField(_(u'country name'), max_length=50)
    continent                   = models.IntegerField(u'continent', choices=CONTINENTS)

    def __unicode__(self):
        return self.country_name

    class Meta:
        verbose_name = u'country'
        verbose_name_plural = u'countries'

def funding_aggregate(projects, organisation=None):
    '''
    Create funding aggregate data about a collection of projects in a queryset.
    '''
    # calculate sum of all project budgets
    f = Funding.objects.all().filter(project__in = projects)
    funding_total = 0 #total requested funding for projects
    for field in ('employment', 'building', 'training', 'maintenance', 'other', ):
        funding_total += sum(f.values_list(field, flat=True))
    # get all funding partners to the projects
    fp = FundingPartner.objects.all().filter(project__in = projects)
    # how much has ben pledged so far?
    #how much has been pledged in total these projects?
    total_pledged = pledged = sum(fp.values_list('funding_amount', flat=True))
    if organisation:
        #how much has been pledged by a certain org for these projects?
        pledged = sum(fp.filter(funding_organisation__exact = organisation).values_list('funding_amount', flat=True))
    # return sum of funds needed, amount pledged (by the org if supplied), and how much is still needed
    return funding_total, pledged, funding_total - total_pledged


class Organisation(models.Model):
    """
    There are three types of organisations in RSR, called Field partner,
    Support partner and Funding partner respectively.
    """
    ORG_TYPE_NGO = 'N'
    ORG_TYPE_GOV = 'G'
    ORG_TYPE_COM = 'C'
    ORG_TYPE_KNO = 'K'
    ORG_TYPES = (
        (ORG_TYPE_NGO, u'NGO'),
        (ORG_TYPE_GOV, u'Governmental'),
        (ORG_TYPE_COM, u'Commercial'),
        (ORG_TYPE_KNO, u'Knowledge institution'),
    )
    #ORG_TYPES_DICT = dict(ORG_TYPES)

    #type                        = models.CharField(max_length=1, choices=PARNER_TYPES)
    field_partner               = models.BooleanField(_(u'field partner'))
    support_partner             = models.BooleanField(_(u'support partner'))
    funding_partner             = models.BooleanField(_(u'funding partner'))

    name                        = models.CharField(max_length=25)
    long_name                   = models.CharField(blank=True, max_length=75)
    organisation_type           = models.CharField(_(u'organisation type'), max_length=1, choices=ORG_TYPES)
    logo                        = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    city                        = models.CharField(max_length=25)
    state                       = models.CharField(max_length=15)
    country                     = models.ForeignKey(Country, verbose_name=_(u'country'))
    url                         = models.URLField(blank=True, verify_exists = False)
    map                         = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    
    address_1                   = models.CharField(blank=True, max_length=35)
    address_2                   = models.CharField(blank=True, max_length=35)
    postcode                    = models.CharField(blank=True, max_length=10)
    phone                       = models.CharField(blank=True, max_length=20)
    mobile                      = models.CharField(blank=True, max_length=20)
    fax                         = models.CharField(blank=True, max_length=20)
    contact_person              = models.CharField(blank=True, max_length=30)
    contact_email               = models.CharField(blank=True, max_length=50)
    description                 = models.TextField(blank=True)
    
    def __unicode__(self):
        return self.name

    def partner_types(self):
        pt = ""
        if self.field_partner: pt += "F"
        if self.support_partner: pt += "S"
        if self.funding_partner: pt += "M"
        return pt
    
    def website(self):
        return '<a href="%s">%s</a>' % (self.url, self.url,)
    website.allow_tags = True
    
    #def show_organisation_type(self):
    #    return ORG_TYPES_DICT[self.organisation_type]
    
    def projects(self):
        '''
        returns a queryset with all projects that has self as any kind of partner
        '''
        projs = Project.objects.all()
        return (projs.filter(supportpartner__support_organisation=self.id) | \
                 projs.filter(fieldpartner__field_organisation=self.id) | \
                 projs.filter(fundingpartner__funding_organisation=self.id)).distinct()

    def partners(self):
        '''
        returns a queryset of all organisations that self has at least one project in common with, excluding self
        '''
        projects = self.projects()
        all = Organisation.objects.all()
        return (all.filter(field_partners__project__in = projects.values('pk').query) | \
                all.filter(support_partners__project__in = projects.values('pk').query) | \
                all.filter(funding_partners__project__in = projects.values('pk').query)).exclude(id__exact=self.id).distinct()
    
    def funding(self):
        funding_total, funding_pledged, funding_needed = funding_aggregate(self.projects(), organisation=self)
        return {'total': funding_total, 'pledged': funding_pledged, 'still_needed': funding_needed}
    
    class Meta:
        ordering = ['name']


class OrganisationMeta(models.Model):
    ACCOUNT_LEVEL = (
        ('free', _('Free')),
        ('plus', _('Plus')),
        ('premium', _('Premium')),
    )
    organisation    = models.OneToOneField(Organisation, primary_key=True)
    account_level   = models.CharField(max_length=12, choices=ACCOUNT_LEVEL, default='free')

CURRENCY_CHOICES = (
    #('USD', 'US dollars'),
    ('EUR', '&#8364;'),
    #('GBP', 'British pounds'),
)

STATUSES = (
    ('N', _('None')),
    ('A', _('Active')),
    ('H', _('Need funding')),
    ('C', _('Complete')),
    ('L', _('Cancelled')),
)
#STATUSES_DICT = dict(STATUSES) #used to output STATUSES text
STATUSES_COLORS = {'N':'black', 'A':'green', 'H':'orange', 'C':'grey', 'L':'red', }

class Project(models.Model):
    name                        = models.CharField(max_length=45, help_text='')
    subtitle                    = models.CharField(max_length=75)
    status                      = models.CharField(_('status'), max_length=1, choices=STATUSES, default='N')
    city                        = models.CharField(max_length=25)
    state                       = models.CharField(max_length=15)
    country                     = models.ForeignKey(Country)
    map                         = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    #Project categories
    category_water              = models.BooleanField()
    category_sanitation         = models.BooleanField()
    category_maintenance        = models.BooleanField()
    category_training           = models.BooleanField()
    category_education          = models.BooleanField()
    category_product_development= models.BooleanField()
    category_other              = models.BooleanField()
    
    #current_status_summary = models.TextField()
    project_plan_summary        = models.TextField(max_length=220, )
    current_image               = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    current_image_caption       = models.CharField(blank=True, max_length=50)
    goals_overview              = models.TextField(max_length=500)
    goal_1                      = models.CharField(blank=True, max_length=60)
    goal_2                      = models.CharField(blank=True, max_length=60)
    goal_3                      = models.CharField(blank=True, max_length=60)
    goal_4                      = models.CharField(blank=True, max_length=60)
    goal_5                      = models.CharField(blank=True, max_length=60)
    #Project target benchmarks
    water_systems               = models.IntegerField(default=0)
    sanitation_systems          = models.IntegerField(default=0)
    hygiene_facilities          = models.IntegerField(default=0)
    improved_water              = models.IntegerField(default=0)
    improved_water_years        = models.IntegerField(default=0)
    improved_sanitation         = models.IntegerField(default=0)
    improved_sanitation_years   = models.IntegerField(default=0)
    trainees                    = models.IntegerField(default=0)
    #mdg_count_water             = models.IntegerField(default=0)
    #mdg_count_sanitation        = models.IntegerField(default=0)

    location_1                  = models.CharField(blank=True, max_length=50)
    location_2                  = models.CharField(blank=True, max_length=50)
    postcode                    = models.CharField(blank=True, max_length=10)
    longitude                   = models.CharField(blank=True, max_length=20)
    latitude                    = models.CharField(blank=True, max_length=20)
    current_status_detail       = models.TextField(blank=True, max_length=600)

    project_plan_detail         = models.TextField(blank=True)
    sustainability              = models.TextField()
    context                     = models.TextField(blank=True, max_length=500)

    project_rating              = models.IntegerField(default=0)
    notes                       = models.TextField(blank=True)
    
    def __unicode__(self):
        return self.name
        
    def project_type(self):
        return "%s project" % (self.get_category_display(),)        

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
            return '<img src="%s" />' % (self.current_image.url,)
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
            is_connected = self in user.userprofile_set.filter(user__exact = user)[0].organisation.projects()
        except:
            pass
        return is_connected

    def organisations(self):
        orgs = Organisation.objects.all()
        return (orgs.filter(support_partners__project__exact=self.id) | \
                orgs.filter(field_partners__project__exact=self.id) | \
                orgs.filter(funding_partners__project__exact=self.id)).distinct()
         
    class Meta:
        pass
    
LINK_KINDS = (
    ('A', 'Akvopedia entry'),
    ('E', 'External link'),
)
class Link(models.Model):
    kind    = models.CharField(max_length=1, choices=LINK_KINDS)
    url     = models.URLField()
    caption = models.CharField(max_length=50)
    project = models.ForeignKey(Project,)
    
    def __unicode__(self):
        return self.url
    
    def show_link(self):
        return '<a href="%s">%s</a>' % (self.url, self.caption,)
    
class FundingPartner(models.Model):
    funding_organisation =  models.ForeignKey(Organisation, related_name='funding_partners', limit_choices_to = {'funding_partner__exact': True})
    funding_amount = models.IntegerField()
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    project = models.ForeignKey(Project,)
    
    def __unicode__(self):
        return "%s %d %s" % (self.funding_organisation.name, self.funding_amount, self.get_currency_display())
     
class SupportPartner(models.Model):
    support_organisation = models.ForeignKey(Organisation, related_name='support_partners', limit_choices_to = {'support_partner__exact': True})
    project = models.ForeignKey(Project,)

    def __unicode__(self):
        return "%s" % (self.support_organisation.name, )
    
class FieldPartner(models.Model):
    field_organisation = models.ForeignKey(Organisation, related_name='field_partners', limit_choices_to = {'field_partner__exact': True})
    project = models.ForeignKey(Project,)

    def __unicode__(self):
        return "%s" % (self.field_organisation.name, )
    
class Funding(models.Model):
    project = models.OneToOneField(Project, primary_key=True)
    #date_next_milestone = models.DateField(blank=True)
    date_request_posted = models.DateField(default=date.today)
    #date_started = models.DateField(blank=True)
    date_complete = models.DateField(null=True, blank=True)
    employment = models.IntegerField()
    building = models.IntegerField()
    training = models.IntegerField()
    maintenance = models.IntegerField()
    other = models.IntegerField()
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    
    def __unicode__(self):
        return self.project.__unicode__()
    
    def total(self):
        return self.employment + self.building + self.training + self.maintenance + self.other
    
    def pledged(self):
        pledged = 0
        for funder in self.project.fundingpartner_set.all():
            pledged += funder.funding_amount
        return pledged
    
    def still_needed(self):
        return max(self.total() - self.pledged(), 0)
    
    def is_complete(self):
        return self.date_complete < date.today()
        
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
    user            = models.ForeignKey(User, unique=True)
    organisation    = models.ForeignKey(Organisation)
    is_org_admin    = models.BooleanField(_(u'organisation administrator'))
    is_org_editor   = models.BooleanField(_(u'organisation project editor'))
    phone_number    = models.CharField(
        max_length=50,
        blank=True,
        help_text	  = """Please use the following format: <strong>467XXXXXXXX</strong>.
        <br>Example: the number 070 765 43 21 would be entered as 46707654321""",
        #TODO: fix to django 1.0
        #validator_list = [isValidGSMnumber]
    )    
    project         = models.ForeignKey(Project, null=True, blank=True, )
    
    def __unicode__(self):
        return self.user.username

    def user_name(self):
        return self.__unicode__()
    
    def organisation_name(self):
        return self.organisation.name
    
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
                path = 'mmsupdateimages/%d_%s' % (self.id, f.file) #TODO: spread images over folder sub-tree
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
    project         = models.ForeignKey(Project, related_name='project_updates', verbose_name=_('project'))
    user            = models.ForeignKey(User, verbose_name=_('user'))
    title           = models.CharField(_('title'), max_length=50)
    text            = models.TextField(_('text'), blank=True)
    #status          = models.CharField(max_length=1, choices=STATUSES, default='N')
    photo           = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    photo_location  = models.CharField(_('photo location'), max_length=1, choices=PHOTO_LOCATIONS, default='B')
    photo_caption   = models.CharField(_('photo caption'), blank=True, max_length=75)
    photo_credit    = models.CharField(_('photo credit'), blank=True, max_length=25)
    update_method   = models.CharField(_('update method'), blank=True, max_length=1, choices=UPDATE_METHODS, default='W')
    time            = models.DateTimeField(_('time'))
    
    class Meta:
        get_latest_by = "time"

    def img(self):
        try:
            return '<img src="%s" />' % (self.photo.url,)
        except:
            return ''
    img.allow_tags = True
    
    #def show_status(self):
    #    "Show the current project status"
    #    return mark_safe("<span style='color: %s;'>%s</span>" % (STATUSES_COLORS[self.status], STATUSES_DICT[self.status]))
        
    #def show_update_method(self):
    #    "Show the update method for this update"
    #    return UPDATE_METHODS_DICT[self.update_method]

class ProjectComment(models.Model):
    project         = models.ForeignKey(Project, verbose_name=_('project'))
    user            = models.ForeignKey(User, verbose_name=_('user'))
    comment         = models.TextField(_('comment'))
    time            = models.DateTimeField(_('time'))
        