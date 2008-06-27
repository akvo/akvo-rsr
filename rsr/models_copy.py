from django.db import models

from django.contrib import admin
from django import newforms as forms
from django.core import validators

class Organization(models.Model):
    PARNER_TYPES = (
        ('F', 'Field partner'),
        ('S', 'Sponsor parner'),
        ('M', 'Funding parner'),
    )
    type                        = models.CharField(max_length=1, choices=PARNER_TYPES)
    name                        = models.CharField(max_length=50)
    logo                        = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    city                        = models.CharField(max_length=25)
    state                       = models.CharField(max_length=15)
    country                     = models.CharField(max_length=15)
    url                         = models.URLField(verify_exists = False, blank=True)
    
    address                     = models.TextField(blank=True)
    phone                       = models.CharField(max_length=50, blank=True)
    fax                         = models.CharField(max_length=50, blank=True)
    notes                       = models.TextField(blank=True)
    
    def __unicode__(self):
        return self.name

    class Admin:
        fields = (
            (None, {'fields': ('type', 'name', 'logo', 'city', 'state', 'country', 'url', )}),
            ('Contact information', {'fields': ('address', 'phone', 'fax',  ), 'classes': 'collapse'}),
            (None, {'fields': ('notes', )}),
        )    
        list_display = ('name', 'website', 'type', )
        
    def website(self):
        return '<a href="%s">%s</a>' % (self.url, self.url,)
    website.allow_tags = True              

class Contact(models.Model):
    name = models.CharField(max_length=50, core=True, blank=True)
    email = models.CharField(max_length=50, core=True, blank=True)
    organization = models.ForeignKey(Organization, edit_inline = models.TABULAR, num_in_admin=2)

    def __unicode__(self):
        return self.name
        
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
    improved_water              = models.IntegerField(default=0)
    improved_water_years        = models.IntegerField(default=0)
    improved_sanitation         = models.IntegerField(default=0)
    improved_sanitation_years   = models.IntegerField(default=0)
    trainees                    = models.IntegerField(default=0)
    mdg_count                   = models.IntegerField(default=0)

    address                     = models.TextField(blank=True, max_length=100) #amalgamation of location 1, location 2 and postcode
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
                'fields': ('address', 'longitude', 'latitude', 'map',), 'classes': 'collapse'
            }),
            ('Project info', {
                'fields': ('project_plan_summary', 'current_image', 'current_image_caption', )
            }),
            ('Goals', {
                'fields': ('goals_summary', 'goal_1', 'goal_2', 'goal_3', )
            }),
            ('Project target benchmarks', {
                'fields': ('water_systems', 'sanitation_systems', 'improved_water', 
                'improved_water_years', 'improved_sanitation', 'improved_sanitation_years', 'trainees', 'mdg_count', )
            }),
            ('Project info details', {
                'fields': ('current_status_detail', 'project_plan_detail', 'sustainability', 'context',)
            }),
            ('Project meta info', {
                'fields': ('project_rating', 'notes', ), 'classes': 'collapse'
            }),
        )
        list_display = ('name', 'project_type', 'country', 'state', 'city', 'project_plan_summary',)

    def project_type(self):
        pt = ""
        if self.category_water: pt += "W";
        if self.category_sanitation: pt += "S";
        if self.category_maintenance: pt += "M";
        if self.category_training: pt += "T";
        if self.category_education: pt += "E";
        if self.category_other: pt += "O";
        return pt
    #project_type.allow_tags = True    
        
    class Meta:
        pass

class FundingPartner(models.Model):
    funding_organization =  models.ForeignKey(Organization, related_name='funding_partners', limit_choices_to = {'type__iexact': 'M'})
    funding_amount = models.IntegerField(core=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, core=True)
    project = models.ForeignKey(Project, edit_inline = models.TABULAR, num_in_admin=1)
    
    def __unicode__(self):
        return "%s %d %s" % (self.funding_organization.name, self.funding_amount, self.currency)
     
class SponsorPartner(models.Model):
    sponsor_organization = models.ForeignKey(Organization, related_name='sponsor_partners', limit_choices_to = {'type__iexact': 'S'}, core=True)
    project = models.ForeignKey(Project, edit_inline = models.TABULAR, num_in_admin=1)

    def __unicode__(self):
        return "%s" % (self.sponsor_organization.name, )
    
class FieldPartner(models.Model):
    field_organization = models.ForeignKey(Organization, related_name='field_partners', limit_choices_to = {'type__iexact': 'F'}, core=True)
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
    employment = models.IntegerField()
    other = models.IntegerField()
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    
    def __unicode__(self):
        return self.total()
    
    def total(self):
        return "%d %s" % (self.employment + self.building + self.training + self.employment + self.other, self.currency)
    
    class Admin:
        list_display = ('project', 'employment', 'building', 'training', 'employment', 'other', 'total', ) 
        
class ProjectUpdate(models.Model):
    PHOTO_LOCATIONS = (
        ('B', 'Beginning'),
        ('E', 'End'),
    )
    project         = models.ForeignKey(Project)
    title           = models.CharField(max_length=50)
    text            = models.TextField(blank=True)
    status          = models.CharField(max_length=1, choices=STATUSES, default='N')
    photo           = models.ImageField(blank=True, upload_to='img/%Y/%m/%d')
    photo_location  = models.CharField(max_length=1, choices=PHOTO_LOCATIONS, default='B')
    photo_caption   = models.CharField(blank=True, max_length=75)
    photo_credit    = models.CharField(blank=True, max_length=25)
    time            = models.DateTimeField()
    
    class Admin:
        list_display = ('project', 'text', 'time', 'photo',)    
        list_filter = ('project', 'time', )

    def img(self):
        return '<img src="%s" />' % (self.get_image_url(),)
    img.allow_tags = True