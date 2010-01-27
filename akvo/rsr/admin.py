# -*- coding: utf-8 -*-

from django import forms
from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.contrib import admin
from django.contrib import auth
from django.contrib.admin import helpers, widgets
from django.contrib.admin.util import unquote
from django.db import models, transaction
from django.db.models import get_model
from django.forms.formsets import all_valid
from django.forms.models import modelform_factory
from django.forms.util import ErrorList
from django.utils.encoding import force_unicode
from django.utils.functional import curry
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext, ugettext_lazy as _

from sorl.thumbnail.fields import ImageWithThumbnailsField

from forms import ReadonlyFKAdminField

from utils import GROUP_RSR_PARTNER_ADMINS, GROUP_RSR_PARTNER_EDITORS
from utils import get_rsr_limited_change_permission
from utils import groups_from_user


NON_FIELD_ERRORS = '__all__'

class PermissionAdmin(admin.ModelAdmin):
    list_display = (u'__unicode__', u'content_type', )
    list_filter  = (u'content_type', )
    ordering = (u'content_type', )

admin.site.register(get_model('auth', 'permission'), PermissionAdmin)


class CountryAdmin(admin.ModelAdmin):
    list_display = (u'country_name', u'continent', )
    list_filter  = (u'continent', )

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(CountryAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + opts.get_delete_permission()):
            del actions['delete_selected']
        return actions    


admin.site.register(get_model('rsr', 'country'), CountryAdmin)

class OrganisationAdminForm(forms.ModelForm):
    pass
    #def save(self, *args, **kwargs):
    #    from dbgp.client import brk
    #    brk(host="localhost", port=9000)
    #    foo = super(OrganisationAdminForm, self).save(commit=False, *args, **kwargs)
    #    pass        

    #def __init__(self, *args, **kwargs):
    #    # request is needed when validating
    #    super(OrganisationAdminForm, self).__init__(*args, **kwargs)

class OrganisationAdmin(admin.ModelAdmin):
    fieldsets = (
        (_(u'Partnership type(s)'), {'fields': (('field_partner', 'support_partner', 'funding_partner', 'sponsor_partner', ),)}),
        (_(u'General information'), {'fields': ('name', 'long_name', 'organisation_type', 'logo', 'city', 'state', 'country', 'url', 'map', )}),
        (_(u'Contact information'), {'fields': ('address_1', 'address_2', 'postcode', 'phone', 'mobile', 'fax',  'contact_person',  'contact_email',  ), }),
        (_(u'About the organisation'), {'fields': ('description', )}),
    )    
    list_display = ('name', 'long_name', 'website', 'partner_types', )
    form = OrganisationAdminForm

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(OrganisationAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + opts.get_delete_permission()):
            del actions['delete_selected']
        return actions    

    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def __init__(self, model, admin_site):
        """
        Override to add self.formfield_overrides.
        Needed to get the ImageWithThumbnailsField working in the admin.
        """
        self.formfield_overrides = {ImageWithThumbnailsField: {'widget': widgets.AdminFileWidget},}
        super(OrganisationAdmin, self).__init__(model, admin_site)

    def queryset(self, request):
        #from dbgp.client import brk
        #brk(host="localhost", port=9000)            
        qs = super(OrganisationAdmin, self).queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            organisation = request.user.get_profile().organisation
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

    def add_view(self, request, form_url='', extra_context=None):
        "The 'add' admin view for this model."
        model = self.model
        opts = model._meta
        
        if not self.has_add_permission(request):
            raise PermissionDenied
        
        ModelForm = self.get_form(request)
        formsets = []
        if request.method == 'POST':
            form = ModelForm(request.POST, request.FILES)
            if form.is_valid():
                form_validated = True
                new_object = self.save_form(request, form, change=False)
            else:
                form_validated = False
                new_object = self.model()
            for FormSet in self.get_formsets(request):
                formset = FormSet(data=request.POST, files=request.FILES,
                                  instance=new_object,
                                  save_as_new=request.POST.has_key("_saveasnew"))
                formsets.append(formset)
            if all_valid(formsets) and form_validated:
                self.save_model(request, new_object, form, change=False)
                ##add by gvh:
                ##loop over all images and do a new save of them.
                ##this has to be done since the initial save puts the images in
                ##img/org/temp/ as we have no primary key to the org at that time
                #for field_name, uploaded_file in request.FILES.items():
                #    model_field = getattr(new_object, field_name)
                #    model_field.save(uploaded_file.name, uploaded_file)
                ##end add
                form.save_m2m()
                for formset in formsets:
                    self.save_formset(request, form, formset, change=False)
                
                self.log_addition(request, new_object)
                return self.response_add(request, new_object)
        else:
            # Prepare the dict of initial data from the request.
            # We have to special-case M2Ms as a list of comma-separated PKs.
            initial = dict(request.GET.items())
            for k in initial:
                try:
                    f = opts.get_field(k)
                except models.FieldDoesNotExist:
                    continue
                if isinstance(f, models.ManyToManyField):
                    initial[k] = initial[k].split(",")
            form = ModelForm(initial=initial)
            for FormSet in self.get_formsets(request):
                formset = FormSet(instance=self.model())
                formsets.append(formset)
        
        adminForm = helpers.AdminForm(form, list(self.get_fieldsets(request)), self.prepopulated_fields)
        media = self.media + adminForm.media
        
        inline_admin_formsets = []
        for inline, formset in zip(self.inline_instances, formsets):
            fieldsets = list(inline.get_fieldsets(request))
            inline_admin_formset = helpers.InlineAdminFormSet(inline, formset, fieldsets)
            inline_admin_formsets.append(inline_admin_formset)
            media = media + inline_admin_formset.media
        
        context = {
            'title': _('Add %s') % force_unicode(opts.verbose_name),
            'adminform': adminForm,
            'is_popup': request.REQUEST.has_key('_popup'),
            'show_delete': False,
            'media': mark_safe(media),
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'root_path': self.admin_site.root_path,
            'app_label': opts.app_label,
        }
        context.update(extra_context or {})
        return self.render_change_form(request, context, add=True)
    add_view = transaction.commit_on_success(add_view)
    
admin.site.register(get_model('rsr', 'organisation'), OrganisationAdmin)


class OrganisationAccountAdmin(admin.ModelAdmin):
    list_display = (u'organisation', u'account_level', )
    
admin.site.register(get_model('rsr', 'organisationaccount'), OrganisationAccountAdmin)


#class LinkAdmin(admin.ModelAdmin):
#    list_display = ('url', 'caption', 'show_link', )

class LinkInline(admin.TabularInline):
    model = get_model('rsr', 'link')
    extra = 3
    list_display = ('url', 'caption', 'show_link')

def partner_clean(obj, field_name='partner'):
    """
    this function firgures out if a given user's organisation is a partner in some function
    associated with the current project. This is to avoid the situation where a user
    who is a partner admin creates a project without the own org as a partner
    resulting in a project that can't be edited by that usur or anyone else form the org.
    params:
        obj: a formset for one of the partner types
        field_name: the filed name of the foreign key field that points to the org
    """
    #from dbgp.client import brk
    #brk(host="localhost", port=9000)
    user_profile = obj.request.user.get_profile()
    # if the user is a partner org we try to avoid foot shooting
    if user_profile.get_is_org_admin() or user_profile.get_is_org_editor():
        my_org = user_profile.organisation
        found = False
        for i in range(0, obj.total_form_count()):
            form = obj.forms[i]
            try:
                form_org = form.cleaned_data[field_name]
                if not form.cleaned_data.get('DELETE', False) and my_org == form_org:
                    # found our own org, all is well move on!
                    found = True
                    break
            except:
                pass
    else:
        found = True
    try:
        #obj instance is the Project instance. We use it to store the info about
        #wether we have found our own org in the found attribute.
        if not obj.instance.found:
            obj.instance.found = found
    except AttributeError:    
        obj.instance.found = found
    try:
        # add the formset to attribute partner_formsets. This is to conveniently
        # be able to dig up these formsets later for error assignment
        obj.instance.partner_formsets
    except AttributeError:
        obj.instance.partner_formsets = []
    obj.instance.partner_formsets.append(obj)
    

class RSR_FundingPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
    # do cleaning looking for the user's org in the funding partner forms
    def clean(self):
        partner_clean(self, 'funding_organisation')  
            
class FundingPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'fundingpartner')
    extra = 1
    # put custom formset in chain of inheritance. the formset creation ends up
    # returning a formset of type FundingPartnerFormForm (I think...) but the
    # RSR_FundingPartnerInlineFormFormSet is a parent to it and thus we can access
    # the custom clean()
    formset = RSR_FundingPartnerInlineFormFormSet

#see above
class RSR_FieldPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        partner_clean(self, 'field_organisation')  

class FieldPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'fieldpartner')
    extra = 1
    formset = RSR_FieldPartnerInlineFormFormSet

#see above
class RSR_SupportPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        partner_clean(self, 'support_organisation')  

class SupportPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'supportpartner')
    extra = 1
    formset = RSR_SupportPartnerInlineFormFormSet

#see above
class RSR_SponsorPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        partner_clean(self, 'sponsor_organisation')  

class SponsorPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'sponsorpartner')
    extra = 1
    formset = RSR_SponsorPartnerInlineFormFormSet


class BudgetItemAdminInLine(admin.TabularInline):
    model = get_model('rsr', 'budgetitem')
    extra = len(model.ITEM_CHOICES)
    max_num = len(model.ITEM_CHOICES)

#admin.site.register(get_model('rsr', 'budgetitem'), BudgetItemAdminInLine)


class BudgetAdminInLine(admin.TabularInline):
    model = get_model('rsr', 'budget')


class PublishingStatusAdmin(admin.ModelAdmin):
    list_display = (u'project_info', u'status', )
    
admin.site.register(get_model('rsr', 'publishingstatus'), PublishingStatusAdmin)


class ProjectAdminForm(forms.ModelForm):
    def __init__(self, request, *args, **kwargs):
        # request is needed when validating
        self.request = request
        super(ProjectAdminForm, self).__init__(*args, **kwargs)

    class Meta:
        model = get_model('rsr', 'project')

    def clean(self):
        return self.cleaned_data

if settings.PVW_RSR:

    class CategoryInLine(admin.StackedInline):
        model = get_model('rsr', 'category')
        extra = 3

    class LocationInLine(admin.TabularInline):
        model = get_model('rsr', 'location')
        extra = 2

    class RSR_PartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
        def clean(self):
            partner_clean(self)  

    class PartnerInline(admin.TabularInline):
        model = get_model('rsr', 'projectpartner')
        extra = 3
        formset = RSR_PartnerInlineFormFormSet

    class ImageInline(admin.TabularInline):
        model = get_model('rsr', 'image')
        extra = 3

    class ProjectAdmin(admin.ModelAdmin):
        model = get_model('rsr', 'project')
        #inlines = (CategoryInLine, LocationInLine, LinkInline, PartnerInline, ImageInline, )
        inlines = (CategoryInLine, LinkInline, PartnerInline, )
        fieldsets = (
            (_(u'Project description'), {
                'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' %
                    _(u"Pellentesque sit amet purus."),
                'fields': (
                    'name',
                    'subtitle',
                    'status',),
            }),
            
            #(_(u'Categories'), {
            #    'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">Please select all categories applicable to your project.</p>'),
            #    'fields': (('category_water', 'category_sanitation', 'category_maintenance'), 
            #            ('category_training', 'category_education', 'category_product_development'), 'category_other',), 
            #}),
            
            (_(u'Location'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">Enter the name of the city, village, town, etc where the project will be carried out. If the country is not yet on the drop-down list, you may use the + to add it.</p>'),
                'fields': ('city', 'state', 'country',)
            }),
            #
            (_(u'Location extra'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">Enter more specific information you might have about the project location, for example a street address or a map image.</p>'),
                'fields': (('longitude', 'latitude'), 'map',),
            }),
            #(_(u'Map'), {
            #    'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' %
            #        _(u"In elit nulla, molestie vel, ornare sit amet, interdum vel, mauris."),
            #    'fields': ('map',),
            #}),
            
            (_(u'Project summary'), {
                'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' %
                    _(u"Curabitur nulla purus, feugiat id, elementum in, lobortis quis, pede."),
                'fields': (
                    'project_plan_summary',
                    'current_image',
                    'current_image_caption',
                )
            }),
            (_(u'Goals'), {
                'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' %
                    _(u"Nulla facilisi."),
                'fields': ('goals_overview', 'goal_1', 'goal_2', 'goal_3', 'goal_4', 'goal_5', )
            }),
            #(_(u'Project target benchmarks'), {
            #    'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">The benchmarks fields can be used to further show the measurable impact of the project in terms of number of systems installed, households improved, people trained, expected duration of impact, etc.</p>'),
            #    'fields': (('water_systems', 'sanitation_systems', 'hygiene_facilities'), ('improved_water', 
            #    'improved_water_years'), ('improved_sanitation', 'improved_sanitation_years'), 'trainees', )#'mdg_count_water', 'mdg_count_sanitation', )
            #}),
            (_(u'Project details'), {
                'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' %
                    _(u"Maecenas tincidunt velit quis orci."),
                'fields': (
                    'project_plan_detail',
                    'current_status_detail',
                    'impact',
                    'lessons_learned',
                    'technologies_used',
                ),
            }),
            (_(u'Project meta info'), {
                'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' %
                    _(u"Ut euismod."),
                'fields': (
                    'currency',
                    'showcase',
                    'notes',
                ),
            }),
            (_(u'Project duration'), {
                'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' %
                    _(u"Cras lobortis tempor velit."),
                'fields': (
                    'start_date',
                    'end_date',
                ),
            }),        
        )
        list_display = ('id', 'name', 'project_plan_summary', 'is_published')
        #list_filter = ('currency',)
        
        #form = ProjectAdminModelForm
        form = ProjectAdminForm
    
        def get_actions(self, request):
            """ Remove delete admin action for "non certified" users"""
            actions = super(ProjectAdmin, self).get_actions(request)
            opts = self.opts
            if not request.user.has_perm(opts.app_label + '.' + opts.get_delete_permission()):
                del actions['delete_selected']
            return actions
        
        #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
        def __init__(self, model, admin_site):
            """
            Override to add self.formfield_overrides.
            Needed to get the ImageWithThumbnailsField working in the admin.
            """
            self.formfield_overrides = {ImageWithThumbnailsField: {'widget': widgets.AdminFileWidget},}
            super(ProjectAdmin, self).__init__(model, admin_site)
    
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
                #projects = get_model('rsr', 'organisation').projects.filter(pk__in=[request.user.get_profile().organisation.pk])
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
                #projects = get_model('rsr', 'organisation').projects.filter(pk__in=[request.user.get_profile().organisation.pk])
                if obj:
                    return obj in projects
                else:
                    return True
            return False
    
        def add_view(self, request, form_url='', extra_context=None):
            "The 'add' admin view for this model."
            model = self.model
            opts = model._meta
            
            if not self.has_add_permission(request):
                raise PermissionDenied
            
            ModelForm = self.get_form(request)
            formsets = []
            if request.method == 'POST':
                form = ModelForm(request, request.POST, request.FILES)
                if form.is_valid():
                    form_validated = True
                    new_object = self.save_form(request, form, change=False)
                else:
                    form_validated = False
                    new_object = self.model()
                for FormSet in self.get_formsets(request):
                    formset = FormSet(data=request.POST, files=request.FILES,
                                      instance=new_object,
                                      save_as_new=request.POST.has_key("_saveasnew"))
                    #added to make request available for formset.clean()
                    formset.request = request
                    formsets.append(formset)
                #from dbgp.client import brk
                #brk(host="localhost", port=9000)            
                if all_valid(formsets) and form_validated:
                    if hasattr(new_object, 'found') and not new_object.found:
                        form._errors[NON_FIELD_ERRORS] = ErrorList([_(u'Your organisation should be among the partners!')])
                        for fs in new_object.partner_formsets:
                            fs._non_form_errors = ErrorList([_(u'Your organisation should be somewhere here.')])
                    else:
                        self.save_model(request, new_object, form, change=False)
                        form.save_m2m()
                        for formset in formsets:
                            self.save_formset(request, form, formset, change=False)
                        
                        self.log_addition(request, new_object)
                        return self.response_add(request, new_object)
            else:
                # Prepare the dict of initial data from the request.
                # We have to special-case M2Ms as a list of comma-separated PKs.
                initial = dict(request.GET.items())
                for k in initial:
                    try:
                        f = opts.get_field(k)
                    except models.FieldDoesNotExist:
                        continue
                    if isinstance(f, models.ManyToManyField):
                        initial[k] = initial[k].split(",")
                form = ModelForm(request, initial=initial)
                for FormSet in self.get_formsets(request):
                    formset = FormSet(instance=self.model())
                    formsets.append(formset)
            
            adminForm = helpers.AdminForm(form, list(self.get_fieldsets(request)), self.prepopulated_fields)
            media = self.media + adminForm.media
            
            inline_admin_formsets = []
            for inline, formset in zip(self.inline_instances, formsets):
                fieldsets = list(inline.get_fieldsets(request))
                inline_admin_formset = helpers.InlineAdminFormSet(inline, formset, fieldsets)
                inline_admin_formsets.append(inline_admin_formset)
                media = media + inline_admin_formset.media
            
            context = {
                'title': _('Add %s') % force_unicode(opts.verbose_name),
                'adminform': adminForm,
                'is_popup': request.REQUEST.has_key('_popup'),
                'show_delete': False,
                'media': mark_safe(media),
                'inline_admin_formsets': inline_admin_formsets,
                'errors': helpers.AdminErrorList(form, formsets),
                'root_path': self.admin_site.root_path,
                'app_label': opts.app_label,
            }
            context.update(extra_context or {})
            return self.render_change_form(request, context, add=True)
        add_view = transaction.commit_on_success(add_view)
        
        def change_view(self, request, object_id, extra_context=None):
            "The 'change' admin view for this model."
            model = self.model
            opts = model._meta
            
            try:
                obj = model._default_manager.get(pk=unquote(object_id))
            except model.DoesNotExist:
                # Don't raise Http404 just yet, because we haven't checked
                # permissions yet. We don't want an unauthenticated user to be able
                # to determine whether a given object exists.
                obj = None
            
            if not self.has_change_permission(request, obj):
                raise PermissionDenied
            
            if obj is None:
                raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % {'name': force_unicode(opts.verbose_name), 'key': escape(object_id)})
            
            if request.method == 'POST' and request.POST.has_key("_saveasnew"):
                return self.add_view(request, form_url='../../add/')
            
            ModelForm = self.get_form(request, obj)
            formsets = []
            if request.method == 'POST':
                form = ModelForm(request, request.POST, request.FILES, instance=obj)
                if form.is_valid():
                    form_validated = True
                    new_object = self.save_form(request, form, change=True)
                else:
                    form_validated = False
                    new_object = obj
                for FormSet in self.get_formsets(request, new_object):
                    formset = FormSet(request.POST, request.FILES,
                                      instance=new_object)
                    #added to make request available for formset.clean()
                    formset.request = request
                    formsets.append(formset)
                
                if all_valid(formsets) and form_validated:
                    if hasattr(new_object, 'found') and not new_object.found:
                        form._errors[NON_FIELD_ERRORS] = ErrorList([_(u'Your organisation should be among the partners!')])
                        for fs in new_object.partner_formsets:
                            fs._non_form_errors = ErrorList([_(u'Your organisation should be somewhere here.')])                        
                    else:
                        self.save_model(request, new_object, form, change=True)
                        form.save_m2m()
                        for formset in formsets:
                            self.save_formset(request, form, formset, change=True)
                        
                        change_message = self.construct_change_message(request, form, formsets)
                        self.log_change(request, new_object, change_message)
                        return self.response_change(request, new_object)
            
            else:
                form = ModelForm(request, instance=obj)
                for FormSet in self.get_formsets(request, obj):
                    formset = FormSet(instance=obj)
                    formsets.append(formset)
            
            adminForm = helpers.AdminForm(form, self.get_fieldsets(request, obj), self.prepopulated_fields)
            media = self.media + adminForm.media
            
            inline_admin_formsets = []
            for inline, formset in zip(self.inline_instances, formsets):
                fieldsets = list(inline.get_fieldsets(request, obj))
                inline_admin_formset = helpers.InlineAdminFormSet(inline, formset, fieldsets)
                inline_admin_formsets.append(inline_admin_formset)
                media = media + inline_admin_formset.media
            
            context = {
                'title': _('Change %s') % force_unicode(opts.verbose_name),
                'adminform': adminForm,
                'object_id': object_id,
                'original': obj,
                'is_popup': request.REQUEST.has_key('_popup'),
                'media': mark_safe(media),
                'inline_admin_formsets': inline_admin_formsets,
                'errors': helpers.AdminErrorList(form, formsets),
                'root_path': self.admin_site.root_path,
                'app_label': opts.app_label,
            }
            context.update(extra_context or {})
            return self.render_change_form(request, context, change=True, obj=obj)
        change_view = transaction.commit_on_success(change_view)
        
else:
    
    class ProjectAdmin(admin.ModelAdmin):
        model = get_model('rsr', 'project')
        inlines = (BudgetItemAdminInLine, LinkInline, FundingPartnerInline, SponsorPartnerInline, 
                   FieldPartnerInline, SupportPartnerInline)
        fieldsets = (
            (_(u'Project description'), {
                'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(u"Give your project a short name and subtitle in RSR. These fields are the newspaper headline for your project: use them to attract attention to what you are doing."),
                'fields': (
                    'name',
                    'subtitle',
                    'status',),
            }),
            
            (_(u'Categories'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">Please select all categories applicable to your project.</p>'),
                'fields': (('category_water', 'category_sanitation', 'category_maintenance'), 
                        ('category_training', 'category_education', 'category_product_development'), 'category_other',), 
            }),
            
            (_(u'Location'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">Enter the name of the city, village, town, etc where the project will be carried out. If the country is not yet on the drop-down list, you may use the + to add it.</p>'),
                'fields': ('city', 'state', 'country',)
            }),
            
            (_(u'Location extra'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">Enter more specific information you might have about the project location, for example a street address or a map image.</p>'),
                'fields': (('location_1', 'location_2', 'postcode'), ('longitude', 'latitude'), 'map',),
            }),
            
            (_(u'Project info'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">The summary should <em>briefly</em> explain why the project is being carried out, where it is taking place, who will benefit and/or participate, what it specifically hopes to accomplish and how those specific goals will be accomplished.</p>'),
                'fields': ('project_plan_summary', 'current_image', 'current_image_caption', )
            }),
            (_(u'Goals'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">Describe what the project hopes to accomplish. Keep in mind the SMART criteria: Specific, Measurable, Agreed upon, Realistic and Time-specific. The numbered fields can be used to list specific goals whose accomplishment will be used to measure overall project success.</p>'),
                'fields': ('goals_overview', 'goal_1', 'goal_2', 'goal_3', 'goal_4', 'goal_5', )
            }),
            (_(u'Project target benchmarks'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">The benchmarks fields can be used to further show the measurable impact of the project in terms of number of systems installed, households improved, people trained, expected duration of impact, etc.</p>'),
                'fields': (('water_systems', 'sanitation_systems', 'hygiene_facilities'), ('improved_water', 
                'improved_water_years'), ('improved_sanitation', 'improved_sanitation_years'), 'trainees', )#'mdg_count_water', 'mdg_count_sanitation', )
            }),
            (_(u'Project details'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">In-depth information about your project should be put in this section. Use the Context, Plan Detail, Status Detail and Sustainability fields to tell people more about the project.</p>'),
                'fields': ('context', 'project_plan_detail', 'current_status_detail', 'sustainability', ),
            }),
            (_(u'Project meta info'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">The project meta information fields are not public. They allow you to make notes to other members of your organisation or partners with access to your projects on the RSR Admin pages.</p>'),
                'fields': ('project_rating', 'notes', ),
            }),
            (_(u'Project budget'), {
                'description': _(u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">The request posted date is filled in for you automatically when you create a project. When the project implementation phase is complete, enter the <em>Date complete</em> here.</p>'),
                'fields': ('currency', 'date_request_posted', 'date_complete', ),
            }),        
        )
        list_display = ('id', 'name', 'project_type', 'status', 'country', 'state',
                        'city', 'project_plan_summary', 'show_current_image',
                        'show_map', 'is_published')
        list_filter = ('currency',)
        
        #form = ProjectAdminModelForm
        form = ProjectAdminForm
    
        def get_actions(self, request):
            """ Remove delete admin action for "non certified" users"""
            actions = super(ProjectAdmin, self).get_actions(request)
            opts = self.opts
            if not request.user.has_perm(opts.app_label + '.' + opts.get_delete_permission()):
                del actions['delete_selected']
            return actions
        
        #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
        def __init__(self, model, admin_site):
            """
            Override to add self.formfield_overrides.
            Needed to get the ImageWithThumbnailsField working in the admin.
            """
            self.formfield_overrides = {ImageWithThumbnailsField: {'widget': widgets.AdminFileWidget},}
            super(ProjectAdmin, self).__init__(model, admin_site)
    
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
                #projects = get_model('rsr', 'organisation').projects.filter(pk__in=[request.user.get_profile().organisation.pk])
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
                #projects = get_model('rsr', 'organisation').projects.filter(pk__in=[request.user.get_profile().organisation.pk])
                if obj:
                    return obj in projects
                else:
                    return True
            return False
    
        def add_view(self, request, form_url='', extra_context=None):
            "The 'add' admin view for this model."
            model = self.model
            opts = model._meta
            
            if not self.has_add_permission(request):
                raise PermissionDenied
            
            ModelForm = self.get_form(request)
            formsets = []
            if request.method == 'POST':
                form = ModelForm(request, request.POST, request.FILES)
                if form.is_valid():
                    form_validated = True
                    new_object = self.save_form(request, form, change=False)
                else:
                    form_validated = False
                    new_object = self.model()
                for FormSet in self.get_formsets(request):
                    formset = FormSet(data=request.POST, files=request.FILES,
                                      instance=new_object,
                                      save_as_new=request.POST.has_key("_saveasnew"))
                    #added to make request available for formset.clean()
                    formset.request = request
                    formsets.append(formset)
                #from dbgp.client import brk
                #brk(host="localhost", port=9000)            
                if all_valid(formsets) and form_validated:
                    if not new_object.found:
                        form._errors[NON_FIELD_ERRORS] = ErrorList([_(u'Your organisation should be among the partners!')])
                        for fs in new_object.partner_formsets:
                            fs._non_form_errors = ErrorList([_(u'Your organisation should be somewhere here.')])
                    else:
                        self.save_model(request, new_object, form, change=False)
                        form.save_m2m()
                        for formset in formsets:
                            self.save_formset(request, form, formset, change=False)
                        
                        self.log_addition(request, new_object)
                        return self.response_add(request, new_object)
            else:
                # Prepare the dict of initial data from the request.
                # We have to special-case M2Ms as a list of comma-separated PKs.
                initial = dict(request.GET.items())
                for k in initial:
                    try:
                        f = opts.get_field(k)
                    except models.FieldDoesNotExist:
                        continue
                    if isinstance(f, models.ManyToManyField):
                        initial[k] = initial[k].split(",")
                form = ModelForm(request, initial=initial)
                for FormSet in self.get_formsets(request):
                    formset = FormSet(instance=self.model())
                    formsets.append(formset)
            
            adminForm = helpers.AdminForm(form, list(self.get_fieldsets(request)), self.prepopulated_fields)
            media = self.media + adminForm.media
            
            inline_admin_formsets = []
            for inline, formset in zip(self.inline_instances, formsets):
                fieldsets = list(inline.get_fieldsets(request))
                inline_admin_formset = helpers.InlineAdminFormSet(inline, formset, fieldsets)
                inline_admin_formsets.append(inline_admin_formset)
                media = media + inline_admin_formset.media
            
            context = {
                'title': _('Add %s') % force_unicode(opts.verbose_name),
                'adminform': adminForm,
                'is_popup': request.REQUEST.has_key('_popup'),
                'show_delete': False,
                'media': mark_safe(media),
                'inline_admin_formsets': inline_admin_formsets,
                'errors': helpers.AdminErrorList(form, formsets),
                'root_path': self.admin_site.root_path,
                'app_label': opts.app_label,
            }
            context.update(extra_context or {})
            return self.render_change_form(request, context, add=True)
        add_view = transaction.commit_on_success(add_view)
        
        def change_view(self, request, object_id, extra_context=None):
            "The 'change' admin view for this model."
            model = self.model
            opts = model._meta
            
            try:
                obj = model._default_manager.get(pk=unquote(object_id))
            except model.DoesNotExist:
                # Don't raise Http404 just yet, because we haven't checked
                # permissions yet. We don't want an unauthenticated user to be able
                # to determine whether a given object exists.
                obj = None
            
            if not self.has_change_permission(request, obj):
                raise PermissionDenied
            
            if obj is None:
                raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % {'name': force_unicode(opts.verbose_name), 'key': escape(object_id)})
            
            if request.method == 'POST' and request.POST.has_key("_saveasnew"):
                return self.add_view(request, form_url='../../add/')
            
            ModelForm = self.get_form(request, obj)
            formsets = []
            if request.method == 'POST':
                form = ModelForm(request, request.POST, request.FILES, instance=obj)
                if form.is_valid():
                    form_validated = True
                    new_object = self.save_form(request, form, change=True)
                else:
                    form_validated = False
                    new_object = obj
                for FormSet in self.get_formsets(request, new_object):
                    formset = FormSet(request.POST, request.FILES,
                                      instance=new_object)
                    #added to make request available for formset.clean()
                    formset.request = request
                    formsets.append(formset)
                
                if all_valid(formsets) and form_validated:
                    if not new_object.found:
                        form._errors[NON_FIELD_ERRORS] = ErrorList([_(u'Your organisation should be among the partners!')])
                        for fs in new_object.partner_formsets:
                            fs._non_form_errors = ErrorList([_(u'Your organisation should be somewhere here.')])                        
                    else:
                        self.save_model(request, new_object, form, change=True)
                        form.save_m2m()
                        for formset in formsets:
                            self.save_formset(request, form, formset, change=True)
                        
                        change_message = self.construct_change_message(request, form, formsets)
                        self.log_change(request, new_object, change_message)
                        return self.response_change(request, new_object)
            
            else:
                form = ModelForm(request, instance=obj)
                for FormSet in self.get_formsets(request, obj):
                    formset = FormSet(instance=obj)
                    formsets.append(formset)
            
            adminForm = helpers.AdminForm(form, self.get_fieldsets(request, obj), self.prepopulated_fields)
            media = self.media + adminForm.media
            
            inline_admin_formsets = []
            for inline, formset in zip(self.inline_instances, formsets):
                fieldsets = list(inline.get_fieldsets(request, obj))
                inline_admin_formset = helpers.InlineAdminFormSet(inline, formset, fieldsets)
                inline_admin_formsets.append(inline_admin_formset)
                media = media + inline_admin_formset.media
            
            context = {
                'title': _('Change %s') % force_unicode(opts.verbose_name),
                'adminform': adminForm,
                'object_id': object_id,
                'original': obj,
                'is_popup': request.REQUEST.has_key('_popup'),
                'media': mark_safe(media),
                'inline_admin_formsets': inline_admin_formsets,
                'errors': helpers.AdminErrorList(form, formsets),
                'root_path': self.admin_site.root_path,
                'app_label': opts.app_label,
            }
            context.update(extra_context or {})
            return self.render_change_form(request, context, change=True, obj=obj)
        change_view = transaction.commit_on_success(change_view)

admin.site.register(get_model('rsr', 'project'), ProjectAdmin)


class UserProfileAdminForm(forms.ModelForm):
    """
    This form dispalys two extra fields that show if the ser belongs to the groups
    GROUP_RSR_PARTNER_ADMINS and/or GROUP_RSR_PARTNER_EDITORS.
    """
    class Meta:
        model = get_model('rsr', 'userprofile')

    #user            = ReadOnlyField(label=_(u'Username'))
    is_active       = forms.BooleanField(required=False, label=_(u'account is active'),)
    is_org_admin    = forms.BooleanField(required=False, label=_(u'organisation administrator'),)
    is_org_editor   = forms.BooleanField(required=False, label=_(u'organisation project editor'),)
    
    def __init__(self, *args, **kwargs):
        #request is needed to populate is_org_admin and is_org_editor
        initial_data = {}
        instance = kwargs.get('instance', None)
        if instance:
            initial_data['is_active']       = instance.get_is_active()
            initial_data['is_org_admin']    = instance.get_is_org_admin()
            initial_data['is_org_editor']   = instance.get_is_org_editor()
            kwargs.update({'initial': initial_data})
        super(UserProfileAdminForm, self).__init__(*args, **kwargs)

class UserProfileAdmin(ReadonlyFKAdminField, admin.ModelAdmin):
    list_display = ('user_name', 'organisation', 'get_is_active', 'get_is_org_admin', 'get_is_org_editor',)
    list_filter  = ('organisation', )
    form = UserProfileAdminForm


    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(UserProfileAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + opts.get_delete_permission()):
            del actions['delete_selected']
        return actions
    
    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def get_form(self, request, obj=None, **kwargs):
        # non-superusers don't get to see it all
        if not request.user.is_superuser:
            # hide sms-related stuff
            self.exclude =  ('phone_number', 'project', )
            # user and org are only shown as text, not select widget
            self.readonly_fk = ('user', 'organisation',)
        # this is needed to remove some kind of caching on exclude and readonly_fk,
        # resulting in the above fields being hidden/changed from superusers after
        # a vanilla user has accessed the form!
        else:
            self.exclude =  None
            self.readonly_fk = ()
        form = super(UserProfileAdmin, self).get_form(request, obj, **kwargs)
        return form

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
        
        Act upon the checkboxes that fake admin settings for the partner users.
        """
        userprofile = form.save(commit=False) #returns a user profile
        is_active = form.cleaned_data['is_active']
        is_admin =  form.cleaned_data['is_org_admin']
        is_editor = form.cleaned_data['is_org_editor']
        userprofile.set_is_active(is_active) #master switch
        userprofile.set_is_org_admin(is_admin) #can modify other users user profile and own organisation
        userprofile.set_is_org_editor(is_editor) #can edit projects
        if not (userprofile.user.is_superuser or userprofile.get_is_rsr_admin()):
            userprofile.set_is_staff(is_admin or is_editor) #implicitly needed to log in to admin
        return form.save(commit=False)

admin.site.register(get_model('rsr', 'userprofile'), UserProfileAdmin)



class ProjectUpdateAdmin(admin.ModelAdmin):

    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def __init__(self, model, admin_site):
        """
        Override to add self.formfield_overrides.
        Needed to get the ImageWithThumbnailsField working in the admin.
        """
        self.formfield_overrides = {ImageWithThumbnailsField: {'widget': widgets.AdminFileWidget},}
        super(ProjectUpdateAdmin, self).__init__(model, admin_site)

    list_display    = ('project', 'user', 'text', 'time', 'img',)    
    list_filter     = ('project', 'time', )

admin.site.register(get_model('rsr', 'projectupdate'), ProjectUpdateAdmin)


class ProjectCommentAdmin(admin.ModelAdmin):
    list_display    = ('project', 'user', 'comment', 'time', )    
    list_filter     = ('project', 'time', )

admin.site.register(get_model('rsr', 'projectcomment'), ProjectCommentAdmin)


if not settings.PVW_RSR:
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

    # PayPal    
    class InvoiceAdmin(admin.ModelAdmin):
        list_display = ('id', 'project', 'user', 'name', 'email', 'time', 'engine', 'status', 'test', 'is_anonymous')
        list_filter = ('engine', 'status', 'test', 'is_anonymous')  
        actions = ('void_invoices',)
        
        def void_invoices(self, request, queryset):
            """Manually voids invoices with a status of 1 (Pending) or 4 (Stale)
            
            Checks for invalid invoice selections, refuses to operate on them
            and flags up a notification.
            
            Status codes:
            
            1 - Pending (valid for voiding)
            2 - Void (invalid)
            3 - Complete (invalid)
            4 - Stale (valid)     
            """
            valid_invoices = queryset.filter(status__in=[1,4])
            invalid_invoices = queryset.filter(status__in=[2,3])
            if invalid_invoices:
                if valid_invoices:
                    for invoice in valid_invoices:
                        self.message_user(request, ugettext('Invoice %d successfully voided.' % int(invoice.pk)))
                    valid_invoices.update(status=2)
                for invoice in invalid_invoices:
                    # beth: put proper translation tag back in later--ugettext removed
                    msg = ('Invoice %d could not be voided. It is already %s.' % (invoice.pk, invoice.get_status_display().lower()))
                    self.message_user(request, msg)
            else:
                for invoice in queryset:
                    self.message_user(request, ugettext('Invoice %d successfully voided.' % int(invoice.pk)))
                queryset.update(status=2)
        void_invoices.short_description = _(u'Mark selected invoices as void')
    
    admin.site.register(get_model('rsr', 'invoice'), InvoiceAdmin)
    
    class PayPalGatewayAdmin(admin.ModelAdmin):
        list_display = ('name', 'account_email', 'description', 'currency', 'locale', 'notification_email')
    
    admin.site.register(get_model('rsr', 'paypalgateway'), PayPalGatewayAdmin)
    
    class MollieGatewayAdmin(admin.ModelAdmin):
        list_display = ('name', 'partner_id', 'description', 'currency', 'notification_email')
    
    admin.site.register(get_model('rsr', 'molliegateway'), MollieGatewayAdmin)
    
    class PaymentGatewaySelectorAdmin(admin.ModelAdmin):
        list_display = ('__unicode__', 'paypal_gateway', 'mollie_gateway')
        list_filter = ('paypal_gateway', 'mollie_gateway')
    
    admin.site.register(get_model('rsr', 'paymentgatewayselector'), PaymentGatewaySelectorAdmin)
