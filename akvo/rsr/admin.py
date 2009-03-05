from django import forms
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.contrib import admin
from django.contrib.admin import helpers
from django.contrib.admin.util import unquote
from django.db.models import get_model
from django.forms.formsets import all_valid
from django.utils.encoding import force_unicode
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from utils import RSR_LIMITED_CHANGE, GROUP_RSR_PARTNER_ADMINS, GROUP_RSR_PARTNER_EDITORS
from utils import get_rsr_limited_change_permission
from utils import groups_from_user

#used by WYMeditor not in use right now
#from forms import ProjectAdminModelForm

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


admin.site.register(get_model('auth', 'permission'))

class CountryAdmin(admin.ModelAdmin):
    list_display = (u'country_name', u'continent', )
    list_filter  = (u'continent', )

admin.site.register(get_model('rsr', 'country'), CountryAdmin)


class OrganisationAdmin(admin.ModelAdmin):
    fieldsets = (
        (_(u'Partnership type(s)'), {'fields': (('field_partner', 'support_partner', 'funding_partner', ),)}),
        (_(u'General information'), {'fields': ('name', 'long_name', 'organisation_type', 'logo', 'city', 'state', 'country', 'url', 'map', )}),
        (_(u'Contact information'), {'fields': ('address_1', 'address_2', 'postcode', 'phone', 'mobile', 'fax',  'contact_person',  'contact_email',  ), }),
        (None, {'fields': ('description', )}),
    )    
    list_display = ('name', 'long_name', 'website', 'partner_types', )

    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def queryset(self, request):
        #from dbgp.client import brk
        #brk(host="localhost", port=9000)            
        qs = super(OrganisationAdmin, self).queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            organisation = request.user.userprofile_set.all()[0].organisation
            return qs.filter(pk=organisation.id)
        else:
            raise PermissionDenied

    def has_change_permission(self, request, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance.
        
        If `obj` is None, this should return True if the given request has
        permission to change *any* object of the given type.

        get_rsr_limited_change_permission is used for  partner orgs to limit their listing and editing to
        "own" projects, organisation and user profiles
        """
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return True
        if request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            if obj:
                return obj == request.user.get_profile().organisation
            else:
                return True
        return False
    
admin.site.register(get_model('rsr', 'organisation'), OrganisationAdmin)


class OrganisationAccountAdmin(admin.ModelAdmin):
    list_display = (u'organisation', u'account_level', )
    
admin.site.register(get_model('rsr', 'organisationaccount'), OrganisationAccountAdmin)


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


class FundingAdminInLine(admin.TabularInline):
    model = get_model('rsr', 'funding')


class PublishingStatusAdmin(admin.ModelAdmin):
    list_display = (u'project', u'status', )
    
admin.site.register(get_model('rsr', 'publishingstatus'), PublishingStatusAdmin)


class ProjectAdminForm(forms.ModelForm):
    class Meta:
        model = get_model('rsr', 'project')

    def clean_name(self):
        # do something that validates your data
        return self.cleaned_data["name"]

class ProjectAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'project')
    inlines = [LinkInline, FundingPartnerInline, FieldPartnerInline, SupportPartnerInline, FundingAdminInLine, ]

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
    list_display = ('id', 'name', 'project_type', 'status', 'country', 'state',
                    'city', 'project_plan_summary', 'show_current_image',
                    'show_map', 'is_published')
    
    #form = ProjectAdminModelForm
    form = ProjectAdminForm
    
    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def queryset(self, request):
        """
        Return a queryset possibly filtered depending on current user's group(s)
        """
        qs = super(ProjectAdmin, self).queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            projects = request.user.get_profile().organisation.all_projects()
            return qs.filter(pk__in=projects)
        else:
            raise PermissionDenied

    def has_change_permission(self, request, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance.
        
        If `obj` is None, this should return True if the given request has
        permission to change *any* object of the given type.

        get_rsr_limited_change_permission is used for  partner orgs to limit their listing and editing to
        "own" projects, organisation and user profiles
        """
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return True
        if request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            projects = request.user.get_profile().organisation.all_projects()
            if obj:
                return obj in projects
            else:
                return True
        return False

admin.site.register(get_model('rsr', 'project'), ProjectAdmin)
#admin.site.register(Project, ProjectAdmin)


#class FundingAdmin(admin.ModelAdmin):
#    list_display = ('project', 'employment', 'building', 'training', 'maintenance', 'other', 'total', ) 
#
#admin.site.register(get_model('rsr', 'funding'), FundingAdmin)

class UserProfileAdminForm(forms.ModelForm):
    """
    This form dispalys two extra fields that show if the ser belongs to the groups
    GROUP_RSR_PARTNER_ADMINS and/or GROUP_RSR_PARTNER_EDITORS.
    """
    class Meta:
        model = get_model('rsr', 'userprofile')

    is_org_admin    = forms.BooleanField(required=False, label=_(u'organisation administrator'),)
    is_org_editor   = forms.BooleanField(required=False, label=_(u'organisation project editor'),)

    def __init__(self, *args, **kwargs):
        #request is needed to populate is_org_admin and is_org_editor
        initial_data = {}
        initial_data['is_org_admin']    = kwargs['instance'].is_org_admin()
        initial_data['is_org_editor']   = kwargs['instance'].is_org_editor()
        kwargs.update({'initial': initial_data})
        super(UserProfileAdminForm, self).__init__(*args, **kwargs)


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'organisation', 'is_org_admin', 'is_org_editor',)
    list_filter  = ('organisation', )
    form = UserProfileAdminForm


    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def queryset(self, request):
        """
        Return a queryset possibly filtered depending on current user's group(s)
        """
        qs = super(UserProfileAdmin, self).queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            organisation = request.user.get_profile().organisation
            return qs.filter(organisation=organisation)
        else:
            raise PermissionDenied

    def has_change_permission(self, request, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance.
        
        If `obj` is None, this should return True if the given request has
        permission to change *any* object of the given type.
        
        get_rsr_limited_change_permission is used for  partner orgs to limit their listing and editing to
        "own" projects, organisation and user profiles
        """
        #from dbgp.client import brk
        #brk(host="localhost", port=9000)            
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return True
        if request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            my_org = request.user.get_profile().organisation
            if obj:
                return obj.organisation == my_org
            else:
                return True
        return False

    def save_form(self, request, form, change):
        """
        Given a ModelForm return an unsaved instance. ``change`` is True if
        the object is being changed, and False if it's being added.
        """
        #from dbgp.client import brk
        #brk(host="localhost", port=9000)            
        #self.request = request
        up = form.save(commit=False) #returns a user profile
        if form.cleaned_data['is_org_admin']:
            up.add_user_to_group(GROUP_RSR_PARTNER_ADMINS)
        else:
            up.remove_user_from_group(GROUP_RSR_PARTNER_ADMINS)
        if form.cleaned_data['is_org_editor']:
            up.add_user_to_group(GROUP_RSR_PARTNER_EDITORS)
        else:
            up.remove_user_from_group(GROUP_RSR_PARTNER_EDITORS)
        return form.save(commit=False)


    #def change_view(self, request, object_id, extra_context=None):
    #    "The 'change' admin view for this model."
    #    model = self.model
    #    opts = model._meta
    #    
    #    try:
    #        obj = model._default_manager.get(pk=unquote(object_id))
    #    except model.DoesNotExist:
    #        # Don't raise Http404 just yet, because we haven't checked
    #        # permissions yet. We don't want an unauthenticated user to be able
    #        # to determine whether a given object exists.
    #        obj = None
    #    
    #    if not self.has_change_permission(request, obj):
    #        raise PermissionDenied
    #    
    #    if obj is None:
    #        raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % {'name': force_unicode(opts.verbose_name), 'key': escape(object_id)})
    #    
    #    if request.method == 'POST' and request.POST.has_key("_saveasnew"):
    #        return self.add_view(request, form_url='../../add/')
    #    
    #    #from dbgp.client import brk
    #    #brk(host="localhost", port=9000)            
    #    
    #    ModelForm = self.get_form(request, obj)
    #    formsets = []
    #    if request.method == 'POST':
    #        form = ModelForm(request, request.POST, request.FILES, instance=obj)
    #        if form.is_valid():
    #            form_validated = True
    #            new_object = self.save_form(request, form, change=True)
    #        else:
    #            form_validated = False
    #            new_object = obj
    #        for FormSet in self.get_formsets(request, new_object):
    #            formset = FormSet(request.POST, request.FILES,
    #                              instance=new_object)
    #            formsets.append(formset)
    #        
    #        if all_valid(formsets) and form_validated:
    #            self.save_model(request, new_object, form, change=True)
    #            form.save_m2m()
    #            for formset in formsets:
    #                self.save_formset(request, form, formset, change=True)
    #            
    #            change_message = self.construct_change_message(request, form, formsets)
    #            self.log_change(request, new_object, change_message)
    #            return self.response_change(request, new_object)
    #    
    #    else:
    #        form = ModelForm(instance=obj, request=request)
    #        for FormSet in self.get_formsets(request, obj):
    #            formset = FormSet(instance=obj)
    #            formsets.append(formset)
    #    
    #    adminForm = helpers.AdminForm(form, self.get_fieldsets(request, obj), self.prepopulated_fields)
    #    media = self.media + adminForm.media
    #    
    #    inline_admin_formsets = []
    #    for inline, formset in zip(self.inline_instances, formsets):
    #        fieldsets = list(inline.get_fieldsets(request, obj))
    #        inline_admin_formset = helpers.InlineAdminFormSet(inline, formset, fieldsets)
    #        inline_admin_formsets.append(inline_admin_formset)
    #        media = media + inline_admin_formset.media
    #    
    #    context = {
    #        'title': _('Change %s') % force_unicode(opts.verbose_name),
    #        'adminform': adminForm,
    #        'object_id': object_id,
    #        'original': obj,
    #        'is_popup': request.REQUEST.has_key('_popup'),
    #        'media': mark_safe(media),
    #        'inline_admin_formsets': inline_admin_formsets,
    #        'errors': helpers.AdminErrorList(form, formsets),
    #        'root_path': self.admin_site.root_path,
    #        'app_label': opts.app_label,
    #    }
    #    context.update(extra_context or {})
    #    return self.render_change_form(request, context, change=True, obj=obj)
    #change_view = transaction.commit_on_success(change_view)

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
