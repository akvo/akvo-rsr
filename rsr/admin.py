from django.contrib import admin
from django.db.models import get_model
from django.utils.translation import ugettext_lazy as _

from forms import ProjectAdminModelForm
#from models import Country
#from models import Organisation
#from models import Project
#from models import Link
#from models import FundingPartner
#from models import FieldPartner
#from models import SupportPartner
#from models import Funding
#from models import UserProfile
#from models import MoMmsRaw
#from models import MoMmsFile
#from models import MoSmsRaw
#from models import ProjectUpdate
#from models import ProjectComment


class CountryAdmin(admin.ModelAdmin):
    list_display = (u'country_name', u'continent', )
    list_filter  = (u'country_name', u'continent', )

admin.site.register(get_model('rsr', 'country'), CountryAdmin)


class OrganisationAdmin(admin.ModelAdmin):
    fieldsets = (
        (_(u'Partnership type(s)'), {'fields': (('field_partner', 'support_partner', 'funding_partner', ),)}),
        (_(u'General information'), {'fields': ('name', 'long_name', 'organisation_type', 'logo', 'city', 'state', 'country', 'url', 'map', )}),
        (_(u'Contact information'), {'fields': ('address_1', 'address_2', 'postcode', 'phone', 'mobile', 'fax',  'contact_person',  'contact_email',  ), }),
        (None, {'fields': ('description', )}),
    )    
    list_display = ('name', 'long_name', 'website', 'partner_types', )

admin.site.register(get_model('rsr', 'organisation'), OrganisationAdmin)


#class LinkAdmin(admin.ModelAdmin):
#    list_display = ('url', 'caption', 'show_link', )

class LinkInline(admin.TabularInline):
    model = get_model('rsr', 'link')
    extra = 3
    list_display = ('url', 'caption', 'show_link', )    

#admin.site.register(Link, LinkAdmin)


#class FundingPartnerAdmin(admin.ModelAdmin):
#    pass

class FundingPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'fundingpartner')
    extra = 1

#admin.site.register(FundingPartner, FundingPartnerAdmin)


class FieldPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'fieldpartner')
    extra = 1

#admin.site.register(FieldPartner, FieldPartnerAdmin)


class SupportPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'supportpartner')
    extra = 1

#admin.site.register(SupportPartner, SupportPartnerAdmin)


class ProjectAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'project')
    inlines = [LinkInline, FundingPartnerInline, FieldPartnerInline, SupportPartnerInline,]

    fieldsets = (
        (_(u'Project description'), {
            'fields': (
                'name',
                'subtitle',
                'status',
                ('category_water', 'category_sanitation', 'category_maintenance', 
                    'category_training', 'category_education', 'category_product_development', 'category_other',
                ),
            )
        }),
        (_(u'Location'), {
            'fields': ('city', 'state', 'country',)
        }),
        (_(u'Location extra'), {
            'fields': (('location_1', 'location_2', 'postcode'), ('longitude', 'latitude'), 'map',), #'classes': 'collapse'
        }),
        (_(u'Project info'), {
            'fields': ('project_plan_summary', 'current_image', 'current_image_caption', )
        }),
        (_(u'Goals'), {
            'fields': ('goals_overview', 'goal_1', 'goal_2', 'goal_3', 'goal_4', 'goal_5', )
        }),
        (_(u'Project target benchmarks'), {
            'fields': ('water_systems', 'sanitation_systems', 'hygiene_facilities', ('improved_water', 
            'improved_water_years'), ('improved_sanitation', 'improved_sanitation_years'), 'trainees', )#'mdg_count_water', 'mdg_count_sanitation', )
        }),
        (_(u'Project info details'), {
            'fields': ('current_status_detail', 'project_plan_detail', 'sustainability', 'context',), #'classes': 'collapse'
        }),
        (_(u'Project meta info'), {
            'fields': ('project_rating', 'notes', ), #'classes': 'collapse'
        }),
    )
    list_display = ('id', 'name', 'project_type', 'status', 'country', 'state', 'city', 'project_plan_summary', 'show_current_image', 'show_map', )

    form = ProjectAdminModelForm

admin.site.register(get_model('rsr', 'project'), ProjectAdmin)
#admin.site.register(Project, ProjectAdmin)


class FundingAdmin(admin.ModelAdmin):
    list_display = ('project', 'employment', 'building', 'training', 'maintenance', 'other', 'total', ) 

admin.site.register(get_model('rsr', 'funding'), FundingAdmin)


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'organisation_name', 'phone_number', 'project', )

admin.site.register(get_model('rsr', 'userprofile'), UserProfileAdmin)


class MoMmsFileInline(admin.TabularInline):
    model = get_model('rsr', 'mommsfile')
    extra = 1

class MoMmsRawAdmin(admin.ModelAdmin):
    inlines = [MoMmsFileInline,]    
    list_display = ('subject', 'sender', 'to', 'time', 'mmsid', 'filecount',)

admin.site.register(get_model('rsr', 'mommsraw'), MoMmsRawAdmin)


class MoSmsRawAdmin(admin.ModelAdmin):
    list_display = ('text', 'sender', 'to', 'delivered', 'incsmsid', )

admin.site.register(get_model('rsr', 'mosmsraw'), MoSmsRawAdmin)


class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display    = ('project', 'user', 'text', 'time', 'photo',)    
    list_filter     = ('project', 'time', )

admin.site.register(get_model('rsr', 'projectupdate'), ProjectUpdateAdmin)


class ProjectCommentAdmin(admin.ModelAdmin):
    list_display    = ('project', 'user', 'comment', 'time', )    
    list_filter     = ('project', 'time', )

admin.site.register(get_model('rsr', 'projectcomment'), ProjectCommentAdmin)
