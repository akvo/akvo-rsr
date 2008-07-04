from django import newforms as forms
from django.db import models
from django.contrib import admin
from django.core import validators
from django.contrib.auth.models import User
from django.utils.safestring import mark_safe

from datetime import date

class Organization(models.Model):
    ORG_TYPES = (
        ('N', 'NGO'),
        ('G', 'Governmental'),
        ('C', 'Commercial'),
        ('K', 'Knowledge institution'),
    )
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
    country                     = models.CharField(max_length=15)
    url                         = models.URLField(blank=True, verify_exists = False)
    map                         = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    
    address_1                   = models.CharField(blank=True, max_length=35)
    address_2                   = models.CharField(blank=True, max_length=35)
    postcode                    = models.CharField(blank=True, max_length=10)
    phone                       = models.CharField(blank=True, max_length=20)
    fax                         = models.CharField(blank=True, max_length=20)
    contact_person              = models.CharField(blank=True, max_length=30)
    contact_email               = models.CharField(blank=True, max_length=50)
    description                 = models.TextField(blank=True)
    
    def __unicode__(self):
        return self.name

    class Admin:
        fields = (
            ('Partnership type(s)', {'fields': (('field_partner', 'support_partner', 'funding_partner', ),)}),
            ('General information', {'fields': ('name', 'long_name', 'logo', 'city', 'state', 'country', 'url', 'map', )}),
            ('Contact information', {'fields': ('address_1', 'address_2', 'postcode', 'phone', 'fax',  'contact_person',  'contact_email',  ), }),
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

#class Contact(models.Model):
#    name = models.CharField(max_length=50, core=True, blank=True)
#    email = models.CharField(max_length=50, core=True, blank=True)
#    organization = models.ForeignKey(Organization, edit_inline = models.TABULAR, num_in_admin=2)
#
#    def __unicode__(self):
#        return self.name
        
CURRENCY_CHOICES = (
    ('USD', 'US dollars'),
    ('EUR', 'Euro'),
    ('GBP', 'British pounds'),
)

STATUSES = (
    ('N', 'None'),
    ('A', 'Active'),
    ('H', 'On hold'),
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
    country                     = models.CharField(max_length=15)
    map                         = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    #Project categories
    category_water              = models.BooleanField()
    category_sanitation         = models.BooleanField()
    category_maintenance        = models.BooleanField()
    category_training           = models.BooleanField()
    category_education          = models.BooleanField()
    category_other              = models.BooleanField()
    
    #current_status_summary = models.TextField()
    project_plan_summary        = models.TextField(max_length=220)
    current_image               = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    current_image_caption       = models.CharField(blank=True, max_length=50)
    goals_summary               = models.TextField(max_length=220)
    goal_1                      = models.CharField(blank=True, max_length=60)
    goal_2                      = models.CharField(blank=True, max_length=60)
    goal_3                      = models.CharField(blank=True, max_length=60)
    #Project target benchmarks
    water_systems               = models.IntegerField(default=0)
    sanitation_systems          = models.IntegerField(default=0)
    hygiene_facilities          = models.IntegerField(default=0)
    improved_water              = models.IntegerField(default=0)
    improved_water_years        = models.IntegerField(default=0)
    improved_sanitation         = models.IntegerField(default=0)
    improved_sanitation_years   = models.IntegerField(default=0)
    trainees                    = models.IntegerField(default=0)
    mdg_count_water             = models.IntegerField(default=0)
    mdg_count_sanitation        = models.IntegerField(default=0)

    location_1                  = models.CharField(blank=True, max_length=50)
    location_2                  = models.CharField(blank=True, max_length=50)
    postcode                    = models.CharField(blank=True, max_length=10)
    longitude                   = models.CharField(blank=True, max_length=20)
    latitude                    = models.CharField(blank=True, max_length=20)
    current_status_detail       = models.TextField(blank=True, max_length=600)

    project_plan_detail         = models.TextField(blank=True)
    sustainability              = models.TextField(max_length=500)
    context                     = models.TextField(max_length=500)

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
                'fields': ('goals_summary', 'goal_1', 'goal_2', 'goal_3', )
            }),
            ('Project target benchmarks', {
                'fields': ('water_systems', 'sanitation_systems', ('improved_water', 
                'improved_water_years'), ('improved_sanitation', 'improved_sanitation_years'), 'trainees', 'mdg_count', )
            }),
            ('Project info details', {
                'fields': ('current_status_detail', 'project_plan_detail', 'sustainability', 'context',), #'classes': 'collapse'
            }),
            ('Project meta info', {
                'fields': ('project_rating', 'notes', ), #'classes': 'collapse'
            }),
        )
        list_display = ('name', 'project_type', 'country', 'state', 'city', 'project_plan_summary',)

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
        
    class Meta:
        pass

class FundingPartner(models.Model):
    funding_organization =  models.ForeignKey(Organization, related_name='funding_partners', limit_choices_to = {'funding_partner__exact': True})
    funding_amount = models.IntegerField(core=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, core=True)
    project = models.ForeignKey(Project, edit_inline = models.TABULAR, num_in_admin=1)
    
    def __unicode__(self):
        return "%s %d %s" % (self.funding_organization.name, self.funding_amount, self.currency)
     
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
    date_next_milestone = models.DateField()
    date_request_posted = models.DateField()
    date_started = models.DateField()
    date_complete = models.DateField()
    employment = models.IntegerField()
    building = models.IntegerField()
    training = models.IntegerField()
    maintenance = models.IntegerField()
    other = models.IntegerField()
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    
    def __unicode__(self):
        return self.total()
    
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
class ProjectUpdate(models.Model):
    UPDATE_METHODS= (
        ('W', 'web'),
        ('E', 'e-mail'),
        ('S', 'SMS'),
    )
    project         = models.ForeignKey(Project)
    user            = models.ForeignKey(User)
    title           = models.CharField(max_length=50)
    text            = models.TextField(blank=True)
    status          = models.CharField(max_length=1, choices=STATUSES, default='N')
    photo           = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    photo_location  = models.CharField(max_length=1, choices=PHOTO_LOCATIONS, default='B')
    photo_caption   = models.CharField(blank=True, max_length=75)
    photo_credit    = models.CharField(blank=True, max_length=25)
    update_method   = models.CharField(max_length=1, choices=UPDATE_METHODS, default='W')
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

class ProjectComment(models.Model):
    project         = models.ForeignKey(Project)
    user            = models.ForeignKey(User)
    comment         = models.TextField()
    time            = models.DateTimeField()
    
    class Admin:
        list_display    = ('project', 'user', 'comment', 'time', )    
        list_filter     = ('project', 'time', )
        