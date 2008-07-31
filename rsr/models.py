from datetime import date

from django import newforms as forms
from django.conf import settings
from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.core import validators
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string

from registration.models import RegistrationProfile, RegistrationManager

CONTINENTS = (
    (1, 'Africa'),
    (2, 'Asia'),
    (3, 'Australia'),
    (4, 'Europe'),
    (5, 'North America'),
    (6, 'South America'),
)
class Country(models.Model):
    
    country_name                = models.CharField(max_length=50)
    continent                   = models.IntegerField(choices=CONTINENTS)

    def __unicode__(self):
        return self.country_name
    
    class Admin:
        list_display = ('country_name', 'continent', )
        list_filter  = ('country_name', 'continent', )
        
    class Meta:
        verbose_name_plural = "countries"

def funding_aggregate(projects):
    '''
    Create funding aggregate data about a collection of projects in a queryset.
    '''    
    f = Funding.objects.all().filter(project__in = projects)
    funding_total = 0 #total requested funding for projects
    for field in ('employment', 'building', 'training', 'maintenance', 'other', ):
        funding_total += sum(f.values_list(field, flat=True))
    # how much has ben pledged so far
    funding_pledged = sum(FundingPartner.objects.all().filter(project__in = projects).values_list('funding_amount', flat=True))
    return funding_total, funding_pledged

ORG_TYPES = (
    ('N', 'NGO'),
    ('G', 'Governmental'),
    ('C', 'Commercial'),
    ('K', 'Knowledge institution'),
)
ORG_TYPES_DICT = dict(ORG_TYPES)
class Organization(models.Model):

    #type                        = models.CharField(max_length=1, choices=PARNER_TYPES)
    field_partner               = models.BooleanField()
    support_partner             = models.BooleanField()
    funding_partner             = models.BooleanField()

    name                        = models.CharField(max_length=25)
    long_name                   = models.CharField(blank=True, max_length=75)
    organization_type           = models.CharField(max_length=1, choices=ORG_TYPES)
    logo                        = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    city                        = models.CharField(max_length=25)
    state                       = models.CharField(max_length=15)
    country                     = models.ForeignKey(Country)
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

    class Admin:
        fields = (
            ('Partnership type(s)', {'fields': (('field_partner', 'support_partner', 'funding_partner', ),)}),
            ('General information', {'fields': ('name', 'long_name', 'organization_type', 'logo', 'city', 'state', 'country', 'url', 'map', )}),
            ('Contact information', {'fields': ('address_1', 'address_2', 'postcode', 'phone', 'mobile', 'fax',  'contact_person',  'contact_email',  ), }),
            (None, {'fields': ('description', )}),
        )    
        list_display = ('name', 'long_name', 'website', 'partner_types', )
    
    def partner_types(self):
        pt = ""
        if self.field_partner: pt += "F"
        if self.support_partner: pt += "S"
        if self.funding_partner: pt += "M"
        return pt
    
    def website(self):
        return '<a href="%s">%s</a>' % (self.url, self.url,)
    website.allow_tags = True
    
    def show_organization_type(self):
        return ORG_TYPES_DICT[self.organization_type]
    
    def projects(self):
        '''
        returns a queryset with all projects that has self as any kind of partner
        '''
        projs = Project.objects.all()
        return (projs.filter(supportpartner__support_organization=self.id) | \
                 projs.filter(fieldpartner__field_organization=self.id) | \
                 projs.filter(fundingpartner__funding_organization=self.id)).distinct()

    def partners(self):
        '''
        returns a queryset of all organizations that self has at least one project in common with, excluding self
        '''
        projects = self.projects()
        all = Organization.objects.all()
        return (all.filter(field_partners__project__in = projects.values('pk').query) | \
                all.filter(support_partners__project__in = projects.values('pk').query) | \
                all.filter(funding_partners__project__in = projects.values('pk').query)).exclude(id__exact=self.id).distinct()
    
    def funding(self):
        funding_total, funding_pledged = funding_aggregate(self.projects())
        return {'total': funding_total, 'pledged': funding_pledged, 'still_needed': funding_total - funding_pledged}
    
    class Meta:
        ordering = ['name']


CURRENCY_CHOICES = (
    #('USD', 'US dollars'),
    ('EUR', '&#8364;'),
    #('GBP', 'British pounds'),
)

STATUSES = (
    ('N', 'None'),
    ('A', 'Active'),
    ('H', 'Need funding'),
    ('C', 'Complete'),
)
STATUSES_DICT = dict(STATUSES) #used to output STATUSES text
STATUSES_COLORS = {'N':'black', 'A':'green', 'H':'orange', 'C':'grey', }

class Project(models.Model):
    name                        = models.CharField(max_length=45)
    subtitle                    = models.CharField(max_length=75)
    status                      = models.CharField(max_length=1, choices=STATUSES, default='N')
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
    project_plan_summary        = models.TextField(max_length=220)
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

    class Admin:
        fields = (
            ('Project description', {
                'fields': (
                    'name',
                    'subtitle',
                    'status',
                    ('category_water', 'category_sanitation', 'category_maintenance', 
                        'category_training', 'category_education', 'category_other',
                    ),
                )
            }),
            ('Location', {
                'fields': ('city', 'state', 'country',)
            }),
            ('Location extra', {
                'fields': (('location_1', 'location_2', 'postcode'), ('longitude', 'latitude'), 'map',), #'classes': 'collapse'
            }),
            ('Project info', {
                'fields': ('project_plan_summary', 'current_image', 'current_image_caption', )
            }),
            ('Goals', {
                'fields': ('goals_overview', 'goal_1', 'goal_2', 'goal_3', 'goal_4', 'goal_5', )
            }),
            ('Project target benchmarks', {
                'fields': ('water_systems', 'sanitation_systems', 'hygiene_facilities', ('improved_water', 
                'improved_water_years'), ('improved_sanitation', 'improved_sanitation_years'), 'trainees', )#'mdg_count_water', 'mdg_count_sanitation', )
            }),
            ('Project info details', {
                'fields': ('current_status_detail', 'project_plan_detail', 'sustainability', 'context',), #'classes': 'collapse'
            }),
            ('Project meta info', {
                'fields': ('project_rating', 'notes', ), #'classes': 'collapse'
            }),
        )
        list_display = ('name', 'project_type', 'status', 'country', 'state', 'city', 'project_plan_summary', 'show_current_image', 'show_map', )

    def project_type(self):
        pt = ""
        if self.category_water: pt += "W"
        if self.category_sanitation: pt += "S"
        if self.category_maintenance: pt += "M"
        if self.category_training: pt += "T"
        if self.category_education: pt += "E"
        if self.category_other: pt += "O"
        return pt
    #project_type.allow_tags = True
    
    def show_status(self):
        "Show the current project status"
        return mark_safe("<span style='color: %s;'>%s</span>" % (STATUSES_COLORS[self.status], STATUSES_DICT[self.status]))
    
    def show_current_image(self):
        return '<img src="%s" />' % (self.get_current_image_url(),)
    show_current_image.allow_tags = True
    
    def show_map(self):
        return '<img src="%s" />' % (self.get_map_url(),)
    show_map.allow_tags = True
    
    def connected_to_user(self, user):
        '''
        Test if a user is connected to self through an arganisation
        '''
        return self in user.userprofile_set.filter(user__exact = user)[0].organisation.projects()
        
    class Meta:
        pass
    
LINK_KINDS = (
    ('A', 'Akvopedia entry'),
    ('E', 'External link'),
)
class Link(models.Model):
    kind    = models.CharField(max_length=1, choices=LINK_KINDS)
    url     = models.URLField(core=True)
    caption = models.CharField(max_length=50)
    project = models.ForeignKey(Project, edit_inline = models.TABULAR, num_in_admin=3)
    
    def __unicode__(self):
        return self.url
    
    def show_link(self):
        return '<a href="%s">%s</a>' % (self.url, self.caption,)
    
    class Admin:
        list_display = ('url', 'caption', 'show_link', )

class FundingPartner(models.Model):
    funding_organization =  models.ForeignKey(Organization, related_name='funding_partners', limit_choices_to = {'funding_partner__exact': True})
    funding_amount = models.IntegerField(core=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, core=True)
    project = models.ForeignKey(Project, edit_inline = models.TABULAR, num_in_admin=1)
    
    def __unicode__(self):
        return "%s %d %s" % (self.funding_organization.name, self.funding_amount, self.get_currency_display())
     
class SupportPartner(models.Model):
    support_organization = models.ForeignKey(Organization, related_name='support_partners', limit_choices_to = {'support_partner__exact': True}, core=True)
    project = models.ForeignKey(Project, edit_inline = models.TABULAR, num_in_admin=1)

    def __unicode__(self):
        return "%s" % (self.support_organization.name, )
    
class FieldPartner(models.Model):
    field_organization = models.ForeignKey(Organization, related_name='field_partners', limit_choices_to = {'field_partner__exact': True}, core=True)
    project = models.ForeignKey(Project, edit_inline = models.TABULAR, num_in_admin=1)

    def __unicode__(self):
        return "%s" % (self.field_organization.name, )
    
class Funding(models.Model):
    project = models.OneToOneField(Project)
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
        return self.total() - self.pledged()
    
    def is_complete(self):
        return self.date_complete < date.today()
    
    class Admin:
        list_display = ('project', 'employment', 'building', 'training', 'maintenance', 'other', 'total', ) 
        
PHOTO_LOCATIONS = (
    ('B', 'At the beginning of the update'),
    ('E', 'At the end of the update'),
)
UPDATE_METHODS = (
    ('W', 'web'),
    ('E', 'e-mail'),
    ('S', 'SMS'),
)
UPDATE_METHODS_DICT = dict(UPDATE_METHODS) #used to output UPDATE_METHODS text

class RSR_RegistrationManager(RegistrationManager):
    '''
    Customized registration manager modifying create_inactive_user() to take a
    callback profile_callback() that takes two arguments, a user and a userprofile.
    Used by RSR_RegistrationProfile.
    '''
    def create_inactive_user(self, username, password, email, first_name='',
                             last_name='', send_email=True, profile_callback=None, profile_data=None):
        """
        Create a new, inactive ``User``, generates a
        ``RegistrationProfile`` and email its activation key to the
        ``User``, returning the new ``User``.
        
        To disable the email, call with ``send_email=False``.
        
        To enable creation of a custom user profile along with the
        ``User`` (e.g., the model specified in the
        ``AUTH_PROFILE_MODULE`` setting), define a function which
        knows how to create and save an instance of that model and
        pass it as the keyword argument ``profile_callback``.
        This function should accept two keyword arguments:

        ``user``
            The ``User`` to relate the profile to.
        
        ``profile``
            The data from which to create a ``UserProfile`` instance
        
        
        """
        #from dbgp.client import brk
        #brk(host="192.168.1.123", port=9000)
        new_user = User.objects.create_user(username, email, password)
        new_user.is_active = False
        new_user.first_name = first_name
        new_user.last_name = last_name
        new_user.save()
        
        registration_profile = self.create_profile(new_user)
        
        if profile_callback is not None:
            profile_callback(user=new_user, profile=profile_data)
        
        if send_email:
            from django.core.mail import send_mail
            current_site = Site.objects.get_current()
            
            subject = render_to_string('registration/activation_email_subject.txt',
                                       { 'site': current_site })
            # Email subject *must not* contain newlines
            subject = ''.join(subject.splitlines())
            
            message = render_to_string('registration/activation_email.txt',
                                       { 'activation_key': registration_profile.activation_key,
                                         'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS,
                                         'site': current_site })
            
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [new_user.email])
        return new_user
    
    def update_active_user(self, user, first_name, last_name):
        user.first_name = first_name
        user.last_name  = last_name
        user.save()        
        return user
        
class RSR_RegistrationProfile(RegistrationProfile):
    '''
    customized registration profile allowing us to create a user profile at the same time a user is registered.
    '''
    objects = RSR_RegistrationManager()

def isValidGSMnumber(field_data, all_data):
	if not field_data.startswith("467"):
		raise validators.ValidationError("The phone number must start with 467")
	if not len(field_data) == 11:
		raise validators.ValidationError("The phone number must be 11 digits long.")
    
class UserProfile(models.Model):
    '''
    Extra info about a user.
    '''
    user = models.ForeignKey(User, unique=True)
    organisation = models.ForeignKey(Organization)
    phone_number = models.IntegerField(
        null=True,
        blank=True,
        help_text	  = """Please use the following format: <strong>467XXXXXXXX</strong>.
        <br>Example: the number 070 765 43 21 would be entered as 46707654321""",
        validator_list = [isValidGSMnumber]
    )
    project = models.ForeignKey(Project, null=True, blank=True, )
    
    def __unicode__(self):
        return self.user.username

    def user_name(self):
        return self.__unicode__()
    
    def organisation_name(self):
        return self.organisation.name
    
    def create_sms_update(self, sms_data):
        if self.project:
            update_data = {
                'project': self.project,
                'user': self.user,
                'title': 'SMS update',
                'update_method': 'S',
            }
            update_data.update(sms_data)
            ProjectUpdate.objects.create(**update_data)
            return True
        return False
        
    class Admin:
        list_display = ('user_name', 'organisation_name', )
    
def create_rsr_profile(user, profile):
    return UserProfile.objects.create(user=user, organisation=Organization.objects.get(pk=profile['org_id']))

class MoSmsRaw(models.Model):
    '''
    all request data from an mo-sms callback
    '''
    text        = models.CharField(max_length=200)
    sender      = models.CharField(max_length=20)
    to          = models.CharField(max_length=20)
    delivered   = models.CharField(max_length=50)
    incsmsid    = models.CharField(max_length=100)
    
    class Admin:
        list_display = ('text', 'sender', 'to', 'delivered', 'incsmsid', )

class ProjectUpdate(models.Model):
    project         = models.ForeignKey(Project)
    user            = models.ForeignKey(User)
    title           = models.CharField(max_length=50)
    text            = models.TextField(blank=True)
    #status          = models.CharField(max_length=1, choices=STATUSES, default='N')
    photo           = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    photo_location  = models.CharField(blank=True, max_length=1, choices=PHOTO_LOCATIONS, default='B')
    photo_caption   = models.CharField(blank=True, max_length=75)
    photo_credit    = models.CharField(blank=True, max_length=25)
    update_method   = models.CharField(blank=True, max_length=1, choices=UPDATE_METHODS, default='W')
    time            = models.DateTimeField()
    
    class Admin:
        list_display    = ('project', 'user', 'text', 'time', 'photo',)    
        list_filter     = ('project', 'time', )

    def img(self):
        return '<img src="%s" />' % (self.get_image_url(),)
    img.allow_tags = True
    
    def show_status(self):
        "Show the current project status"
        return mark_safe("<span style='color: %s;'>%s</span>" % (STATUSES_COLORS[self.status], STATUSES_DICT[self.status]))
        
    def show_update_method(self):
        "Show the update method for this update"
        return UPDATE_METHODS_DICT[self.update_method]

class ProjectComment(models.Model):
    project         = models.ForeignKey(Project)
    user            = models.ForeignKey(User)
    comment         = models.TextField()
    time            = models.DateTimeField()
    
    class Admin:
        list_display    = ('project', 'user', 'comment', 'time', )    
        list_filter     = ('project', 'time', )
        