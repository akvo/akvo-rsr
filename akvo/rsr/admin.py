# -*- coding: utf-8 -*-

from django import forms
from django.conf import settings
from django.contrib import admin
from django.contrib.admin import helpers, widgets
from django.contrib.admin.util import unquote
from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.models import Group
from django.contrib.contenttypes import generic
from django.core.exceptions import PermissionDenied
from django.db import models, transaction
from django.db.models import get_model
from django.forms.formsets import all_valid
from django.forms.util import ErrorList
from django.http import Http404
from django.utils.decorators import method_decorator
from django.utils.encoding import force_unicode
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext, ugettext_lazy as _
from django.views.decorators.csrf import csrf_protect

from sorl.thumbnail.fields import ImageWithThumbnailsField
import os.path

from permissions.models import Role

from akvo.rsr.forms import PartnerSiteAdminForm
from akvo.rsr.iso3166 import ISO_3166_COUNTRIES, COUNTRY_CONTINENTS, CONTINENTS
from akvo.rsr.utils import get_rsr_limited_change_permission, permissions


NON_FIELD_ERRORS = '__all__'

csrf_protect_m = method_decorator(csrf_protect)


admin.site.unregister(Group)
class RSRGroupAdmin(GroupAdmin):

    list_display = GroupAdmin.list_display + (permissions,)

admin.site.register(Group, RSRGroupAdmin)


class PermissionAdmin(admin.ModelAdmin):
    list_display = (u'__unicode__', u'content_type', )
    list_filter  = (u'content_type', )
    ordering = (u'content_type', )

admin.site.register(get_model('auth', 'permission'), PermissionAdmin)


class CountryAdmin(admin.ModelAdmin):
    list_display = (u'name', u'iso_code', u'continent', u'continent_code', )
    list_filter  = (u'continent', )
    readonly_fields = (u'name', u'continent', u'continent_code')

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(CountryAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + opts.get_delete_permission()):
            del actions['delete_selected']
        return actions

    def save_model(self, request, obj, form, change):
        if obj.iso_code:
            iso_code = obj.iso_code
            continent_code = COUNTRY_CONTINENTS[iso_code]

            obj.name = dict(ISO_3166_COUNTRIES)[iso_code]
            obj.continent = dict(CONTINENTS)[continent_code]
            obj.continent_code =continent_code
        obj.save()

    def get_readonly_fields(self, request, obj=None):
        if obj:
#            return u'iso_code', u'name', u'continent', u'continent_code'
            return u'name', u'continent', u'continent_code'
        else:
            return u'name', u'continent', u'continent_code'

admin.site.register(get_model('rsr', 'country'), CountryAdmin)


class LocationInline(generic.GenericStackedInline):
    model = get_model('rsr', 'location')
    extra = 0

class OrganisationAdmin(admin.ModelAdmin):
    fieldsets = (
        (_(u'General information'), {'fields': ('name', 'long_name', 'organisation_type', 'logo', 'url', )}),
        (_(u'Contact information'), {'fields': ('phone', 'mobile', 'fax',  'contact_person',  'contact_email', ), }),
        (_(u'About the organisation'), {'fields': ('description', )}),
    )
    inlines = (LocationInline,)
    list_display = ('name', 'long_name', 'website', )

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

def partner_clean(obj, field_name='organisation'):
    """
    this function figures out if a given user's organisation is a partner in some function
    associated with the current project. This is to avoid the situation where a user
    who is a partner admin creates a project without the own org as a partner
    resulting in a project that can't be edited by that user or anyone else form the org.
    params:
        obj: a formset for one of the partner types
        field_name: the filed name of the foreign key field that points to the org
    """
    user_profile = obj.request.user.get_profile()
    # superusers can do whatever they like!
    if obj.request.user.is_superuser:
        found = True
    # if the user is a partner org we try to avoid foot shooting
    elif user_profile.get_is_org_admin() or user_profile.get_is_org_editor():
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


#class RSR_FundingPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
#    # do cleaning looking for the user's org in the funding partner forms
#    def clean(self):
#        partner_clean(self, 'funding_organisation')
#
#class FundingPartnerInline(admin.TabularInline):
#    model = get_model('rsr', 'fundingpartner')
#    extra = 1
#    # put custom formset in chain of inheritance. the formset creation ends up
#    # returning a formset of type FundingPartnerFormForm (I think...) but the
#    # RSR_FundingPartnerInlineFormFormSet is a parent to it and thus we can access
#    # the custom clean()
#    formset = RSR_FundingPartnerInlineFormFormSet
#
#    def get_formset(self, request, *args, **kwargs):
#        formset = super(FundingPartnerInline, self).get_formset(request, *args, **kwargs)
#        formset.request = request
#        return formset

#see above
class RSR_FieldPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        partner_clean(self, 'field_organisation')

class FieldPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'fieldpartner')
    extra = 1
    formset = RSR_FieldPartnerInlineFormFormSet

    def get_formset(self, request, *args, **kwargs):
        formset = super(FieldPartnerInline, self).get_formset(request, *args, **kwargs)
        formset.request = request
        return formset

#see above
class RSR_SupportPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        partner_clean(self, 'support_organisation')

class SupportPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'supportpartner')
    extra = 1
    formset = RSR_SupportPartnerInlineFormFormSet

    def get_formset(self, request, *args, **kwargs):
        formset = super(SupportPartnerInline, self).get_formset(request, *args, **kwargs)
        formset.request = request
        return formset

#see above
class RSR_SponsorPartnerInlineFormFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        partner_clean(self, 'sponsor_organisation')

class SponsorPartnerInline(admin.TabularInline):
    model = get_model('rsr', 'sponsorpartner')
    extra = 1
    formset = RSR_SponsorPartnerInlineFormFormSet

    def get_formset(self, request, *args, **kwargs):
        formset = super(SponsorPartnerInline, self).get_formset(request, *args, **kwargs)
        formset.request = request
        return formset


class BudgetItemLabelAdmin(admin.ModelAdmin):
    list_display = (u'label',)

admin.site.register(get_model('rsr', 'budgetitemlabel'), BudgetItemLabelAdmin)


class BudgetItemAdminInLine(admin.TabularInline):
    model = get_model('rsr', 'budgetitem')
    extra = 1
    class Media:
        css = {'all': (os.path.join(settings.MEDIA_URL, 'akvo/css/src/rsr_admin.css').replace('\\','/'),)}
        js = (os.path.join(settings.MEDIA_URL, 'akvo/js/src/rsr_admin.js').replace('\\','/'),)

#admin.site.register(get_model('rsr', 'budgetitem'), BudgetItemAdminInLine)

class BudgetAdminInLine(admin.TabularInline):
    model = get_model('rsr', 'budget')


class PublishingStatusAdmin(admin.ModelAdmin):
    list_display = (u'project_info', u'status', )

admin.site.register(get_model('rsr', 'publishingstatus'), PublishingStatusAdmin)


#class ProjectAdminForm(forms.ModelForm):
#    class Meta:
#        model = get_model('rsr', 'project')
#
#    def clean(self):
#        return self.cleaned_data
#
#admin.site.register(get_model('rsr', 'location'))


class FocusAreaAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'FocusArea')
    list_display = ('name', 'slug', 'image',)

admin.site.register(get_model('rsr', 'FocusArea'), FocusAreaAdmin)


class BenchmarknameInline(admin.TabularInline):
    model = get_model('rsr', 'Category').benchmarknames.through
    extra = 3


class CategoryAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'Category')
    list_display = ('name', 'focus_areas_html', 'category_benchmarks_html', )

admin.site.register(get_model('rsr', 'Category'), CategoryAdmin)


class BenchmarknameAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'Benchmarkname')
    list_display = ('name', 'order',)

admin.site.register(get_model('rsr', 'Benchmarkname'), BenchmarknameAdmin)


class MiniCMSAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'MiniCMS')
    list_display = ('__unicode__', 'active', )

admin.site.register(get_model('rsr', 'MiniCMS'), MiniCMSAdmin)


class BenchmarkInline(admin.TabularInline):
    model = get_model('rsr', 'benchmark')
    # only show the value, category and benchmark are not to be edited here
    fields = ('value',)
    extra = 0
    max_num = 0


class GoalInline(admin.TabularInline):
    model = get_model('rsr', 'goal')
    fields = ('text',)
    extra = 3
    max_num = 8


class RSR_PartnershipInlineFormFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        user = self.request.user
        user_profile = user.get_profile()
        # superusers can do whatever they like!
        if user.is_superuser:
            found = True
        # if the user is a partner org we try to avoid foot shooting
        elif user_profile.get_is_org_admin() or user_profile.get_is_org_editor():
            my_org = user_profile.organisation
            found = False
            for i in range(0, self.total_form_count()):
                form = self.forms[i]
                try:
                    form_org = form.cleaned_data['organisation']
                    if not form.cleaned_data.get('DELETE', False) and my_org == form_org:
                        # found our own org, all is well move on!
                        found = True
                        break
                except:
                    pass
        else:
            found = True
        if not found:
            self._non_form_errors = ErrorList([_(u'Your organisation should be somewhere here.')])

class PartnershipInline(admin.TabularInline):
    model = get_model('rsr', 'Partnership')
    extra = 1
    formset = RSR_PartnershipInlineFormFormSet

    def get_formset(self, request, *args, **kwargs):
        formset = super(PartnershipInline, self).get_formset(request, *args, **kwargs)
        formset.request = request
        return formset

class ProjectAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'project')
    inlines = (
        GoalInline, BudgetItemAdminInLine, LinkInline, PartnershipInline,
        LocationInline, BenchmarkInline
    )
    save_as = True
    fieldsets = (
        (_(u'Project description'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Give your project a short title and subtitle in RSR. These fields are the '
                u'newspaper headline for your project: use them to attract attention to what you are doing.'
            ),
           'fields': (
               'title', 'subtitle', 'status',
           ),
        }),
        (_(u'Categories'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Please select all categories applicable to your project. '
                u'(The Focus area(s) of each category is shown in parenthesis after the category name)'
            ),
            'fields': (
                ('categories',)
            ),
        }),
        (_(u'Project info'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'The summary should <em>briefly</em> explain why the project is being carried out, '
                u'where it is taking place, who will benefit and/or participate, what it specifically '
                u'hopes to accomplish and how those specific goals will be accomplished.'
            ),
            'fields': ('project_plan_summary', 'current_image', 'current_image_caption', )
        }),
        (_(u'Project details'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'In-depth information about your project should be put in this section. '
                u'Use the Background, Project plan, Current status and Sustainability fields '
                u'to tell people more about the project.'
            ),
            'fields': ('background', 'project_plan', 'current_status', 'sustainability', ),
        }),
        (_(u'Project meta info'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'The project meta information fields are not public. '
                u'They allow you to make notes to other members of your organisation or '
                u'partners with access to your projects on the RSR Admin pages.'
            ),
            'fields': ('project_rating', 'notes', ),
        }),
        (_(u'Project budget'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'The request posted date is filled in for you automatically when you create a project. '
                u'When the project implementation phase is complete, enter the <em>Date complete</em> here.'
            ),
            'fields': ('currency', 'date_request_posted', 'date_complete', ),
        }),
        (_(u'Aggregates'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">%s</p>' % _('Aggregate financial data'),
            'fields': (('funds',  'funds_needed',), ),
        }),
        (_(u'Goals'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Describe what the project hopes to accomplish. Keep in mind the SMART criteria: '
                u'Specific, Measurable, Agreed upon, Realistic and Time-specific. '
                u'The numbered fields can be used to list specific goals whose accomplishment '
                u'will be used to measure overall project success.'
            ),
            'fields': ('goals_overview', )
        }),
        )
    list_display = ('id', 'title', 'status', 'project_plan_summary', 'latest_update', 'show_current_image', 'is_published',)
    list_filter = ('currency', 'status', )
    readonly_fields = ('budget', 'funds',  'funds_needed',)
    #form = ProjectAdminForm

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

    @csrf_protect_m
    @transaction.commit_on_success
    def add_view(self, request, form_url='', extra_context=None):
        "The 'add' admin view for this model."
        model = self.model
        opts = model._meta

        if not self.has_add_permission(request):
            raise PermissionDenied

        ModelForm = self.get_form(request)
        formsets = []
        inline_instances = self.get_inline_instances(request)
        if request.method == 'POST':
            form = ModelForm(request.POST, request.FILES)
            if form.is_valid():
                new_object = self.save_form(request, form, change=False)
                form_validated = True
            else:
                form_validated = False
                new_object = self.model()
            prefixes = {}
            for FormSet, inline in zip(self.get_formsets(request), inline_instances):
                prefix = FormSet.get_default_prefix()
                # add to add_view() from jango 1.4
                # check if we're trying to create a new project by copying an existing one. If so we ignore
                # location and benchmark inlines
                if not "_saveasnew" in request.POST or not prefix in ['benchmarks', 'rsr-location-content_type-object_id']:
                # end of add although the following block is indented as a result
                    prefixes[prefix] = prefixes.get(prefix, 0) + 1
                    if prefixes[prefix] != 1 or not prefix:
                        prefix = "%s-%s" % (prefix, prefixes[prefix])
                    formset = FormSet(data=request.POST, files=request.FILES,
                                      instance=new_object,
                                      save_as_new="_saveasnew" in request.POST,
                                      prefix=prefix, queryset=inline.queryset(request))
                    formsets.append(formset)
            if all_valid(formsets) and form_validated:
                self.save_model(request, new_object, form, False)
                self.save_related(request, form, formsets, False)
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
            prefixes = {}
            for FormSet, inline in zip(self.get_formsets(request), inline_instances):
                prefix = FormSet.get_default_prefix()
                prefixes[prefix] = prefixes.get(prefix, 0) + 1
                if prefixes[prefix] != 1 or not prefix:
                    prefix = "%s-%s" % (prefix, prefixes[prefix])

                # hack by GvH to get user's organisation preset as parter when adding a new project
                if prefix == 'partnership_set':
                    formset = FormSet(instance=self.model(), prefix=prefix, initial=[{'organisation': request.user.get_profile().organisation}],
                                      queryset=inline.queryset(request))
                else:
                    formset = FormSet(instance=self.model(), prefix=prefix,
                                      queryset=inline.queryset(request))
                # end hack
                formsets.append(formset)

        adminForm = helpers.AdminForm(form, list(self.get_fieldsets(request)),
                                      self.get_prepopulated_fields(request),
                                      self.get_readonly_fields(request),
                                      model_admin=self)
        media = self.media + adminForm.media

        inline_admin_formsets = []
        for inline, formset in zip(inline_instances, formsets):
            fieldsets = list(inline.get_fieldsets(request))
            readonly = list(inline.get_readonly_fields(request))
            prepopulated = dict(inline.get_prepopulated_fields(request))
            inline_admin_formset = helpers.InlineAdminFormSet(inline, formset,
                                                              fieldsets, prepopulated, readonly, model_admin=self)
            inline_admin_formsets.append(inline_admin_formset)
            media = media + inline_admin_formset.media

        context = {
            'title': _('Add %s') % force_unicode(opts.verbose_name),
            'adminform': adminForm,
            'is_popup': "_popup" in request.REQUEST,
            'show_delete': False,
            'media': media,
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'app_label': opts.app_label,
            }
        context.update(extra_context or {})
        return self.render_change_form(request, context, form_url=form_url, add=True)

# benchmark change, budgetitem all, goal all, location all,



#    @csrf_protect_m
#    @transaction.commit_on_success
#    def change_view(self, request, object_id, extra_context=None):
#        "The 'change' admin view for this model."
#        model = self.model
#        opts = model._meta
#
#        obj = self.get_object(request, unquote(object_id))
#
#        if not self.has_change_permission(request, obj):
#            raise PermissionDenied
#
#        if obj is None:
#            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % {'name': force_unicode(opts.verbose_name), 'key': escape(object_id)})
#
#        if request.method == 'POST' and "_saveasnew" in request.POST:
#            return self.add_view(request, form_url='../add/')
#
#        ModelForm = self.get_form(request, obj)
#        formsets = []
#        if request.method == 'POST':
#            form = ModelForm(request.POST, request.FILES, instance=obj)
#            if form.is_valid():
#                form_validated = True
#                new_object = self.save_form(request, form, change=True)
#            else:
#                form_validated = False
#                new_object = obj
#            prefixes = {}
#            for FormSet, inline in zip(self.get_formsets(request, new_object),
#                                       self.inline_instances):
#                prefix = FormSet.get_default_prefix()
#                prefixes[prefix] = prefixes.get(prefix, 0) + 1
#                if prefixes[prefix] != 1:
#                    prefix = "%s-%s" % (prefix, prefixes[prefix])
#                formset = FormSet(request.POST, request.FILES,
#                                  instance=new_object, prefix=prefix,
#                                  queryset=inline.queryset(request))
#
#                formsets.append(formset)
#            if all_valid(formsets) and form_validated:
#                self.save_model(request, new_object, form, change=True)
#                form.save_m2m()
#                for formset in formsets:
#                    self.save_formset(request, form, formset, change=True)
#
#                change_message = self.construct_change_message(request, form, formsets)
#                self.log_change(request, new_object, change_message)
#                return self.response_change(request, new_object)
#
#        else:
#            form = ModelForm(instance=obj)
#            prefixes = {}
#            for FormSet, inline in zip(self.get_formsets(request, obj), self.inline_instances):
#                prefix = FormSet.get_default_prefix()
#                prefixes[prefix] = prefixes.get(prefix, 0) + 1
#                if prefixes[prefix] != 1:
#                    prefix = "%s-%s" % (prefix, prefixes[prefix])
#                formset = FormSet(instance=obj, prefix=prefix,
#                                  queryset=inline.queryset(request))
#                formsets.append(formset)
#
#        adminForm = helpers.AdminForm(form, self.get_fieldsets(request, obj),
#                                      self.prepopulated_fields, self.get_readonly_fields(request, obj),
#                                      model_admin=self)
#        media = self.media + adminForm.media
#
#        inline_admin_formsets = []
#        for inline, formset in zip(self.inline_instances, formsets):
#            fieldsets = list(inline.get_fieldsets(request, obj))
#            readonly = list(inline.get_readonly_fields(request, obj))
#            inline_admin_formset = helpers.InlineAdminFormSet(inline, formset, fieldsets, readonly, model_admin=self)
#            inline_admin_formsets.append(inline_admin_formset)
#            media = media + inline_admin_formset.media
#
#        context = {
#            'title': _(u'Change project'),
#            'adminform': adminForm,
#            'object_id': object_id,
#            'original': obj,
#            'is_popup': "_popup" in request.REQUEST,
#            'media': mark_safe(media),
#            'inline_admin_formsets': inline_admin_formsets,
#            'errors': helpers.AdminErrorList(form, formsets),
#            'root_path': self.admin_site.root_path,
#            'app_label': opts.app_label,
#        }
#        context.update(extra_context or {})
#        return self.render_change_form(request, context, change=True, obj=obj)

admin.site.register(get_model('rsr', 'project'), ProjectAdmin)


class SmsReporterInline(admin.TabularInline):
    model = get_model('rsr', 'smsreporter')
    extra = 1

    def get_readonly_fields(self, request, obj):
        """ Only allow viewing of gateway number and project for non-superusers
        """
        #opts = self.opts
        user = request.user
        if not user.is_superuser:
            self.readonly_fields = ('gw_number', 'project',)
        else:
            self.readonly_fields = ()
        return super(SmsReporterInline, self).get_readonly_fields(request, obj)

    def formfield_for_dbfield(self, db_field, **kwargs):
        """
        Hook for specifying the form Field instance for a given database Field
        instance.

        If kwargs are given, they're passed to the form Field's constructor.

        Added by GvH:
        Use hook to implement limits to project list select for org users.
        """
        request = kwargs.get("request", None)

        # Limit the choices of the project db_field to projects linked to user's org
        # if we have an org user
        if db_field.attname == 'project_id':
            opts = self.opts
            user = request.user
            if user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
                db_field.rel.limit_choices_to = {'pk__in': user.get_profile().organisation.all_projects()}

        return super(SmsReporterInline, self).formfield_for_dbfield(db_field, **kwargs)


class UserProfileAdminForm(forms.ModelForm):
    """
    This form dispalys two extra fields that show if the user belongs to the groups
    GROUP_RSR_PARTNER_ADMINS and/or GROUP_RSR_PARTNER_EDITORS.
    """
    class Meta:
        model = get_model('rsr', 'userprofile')

    is_active       = forms.BooleanField(required=False, label=_(u'account is active'),)
    is_org_admin    = forms.BooleanField(required=False, label=_(u'organisation administrator'),)
    is_org_editor   = forms.BooleanField(required=False, label=_(u'organisation project editor'),)
    is_sms_updater  = forms.BooleanField(required=False, label=_(u'can create sms updates',),)
    
    def __init__(self, *args, **kwargs):
        initial_data = {}
        instance = kwargs.get('instance', None)
        if instance:
            initial_data['is_active']       = instance.get_is_active()
            initial_data['is_org_admin']    = instance.get_is_org_admin()
            initial_data['is_org_editor']   = instance.get_is_org_editor()
            initial_data['is_sms_updater']  = instance.has_perm_add_sms_updates()
            kwargs.update({'initial': initial_data})
        super(UserProfileAdminForm, self).__init__(*args, **kwargs)

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'organisation', 'get_is_active', 'get_is_org_admin', 'get_is_org_editor', 'has_perm_add_sms_updates', 'latest_update_date',)
    search_fields = ('user__username', 'organisation__name', 'organisation__long_name',)
    list_filter  = ('organisation',)
    ordering = ("user__username",)
    inlines = [SmsReporterInline,]
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
            self.exclude =  ('phone_number', 'validation',)
            # user and org are only shown as text, not select widget
            #self.readonly_fields = ('user', 'organisation',)
        # this is needed to remove some kind of caching on exclude and readonly_fk,
        # resulting in the above fields being hidden/changed from superusers after
        # a vanilla user has accessed the form!
        else:
            self.exclude =  None
            #self.readonly_fields = ()
        form = super(UserProfileAdmin, self).get_form(request, obj, **kwargs)
        if not request.user.is_superuser and obj.validation != obj.VALIDATED:
            self.inlines = []
            self.inline_instances = []
        #else:
        #    self.inlines = [SmsReporterInline,]
        return form

    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            # only superusers are allowed to add/remove sms updaters in beta phase
            self.form.declared_fields['is_sms_updater'].widget.attrs['readonly'] = 'readonly'
            self.form.declared_fields['is_sms_updater'].widget.attrs['disabled'] = 'disabled'
            # user and org are only shown as text, not select widget
            return ['user', 'organisation',]
        else:
            self.form.declared_fields['is_sms_updater'].widget.attrs.pop('readonly', None)
            self.form.declared_fields['is_sms_updater'].widget.attrs.pop('disabled', None)
            return []


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

        get_rsr_limited_change_permission is used for partner orgs to limit their listing and editing to
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

    def save_model(self, request, obj, form, change):
        """
        override of django.contrib.admin.options.save_model
        """
        # Act upon the checkboxes that fake admin settings for the partner users.
        is_active       = form.cleaned_data['is_active']
        is_admin        = form.cleaned_data['is_org_admin']
        is_editor       = form.cleaned_data['is_org_editor']
        is_sms_updater  = form.cleaned_data['is_sms_updater']
        obj.set_is_active(is_active) #master switch
        obj.set_is_org_admin(is_admin) #can modify other users user profile and own organisation
        obj.set_is_org_editor(is_editor) #can edit projects
        obj.set_is_staff(is_admin or is_editor or obj.user.is_superuser) #implicitly needed to log in to admin
        # TODO: fix "real" permissions, currently only superusers can change sms updter status
        if is_sms_updater:
            obj.add_role(obj.user, Role.objects.get(name=self.model.ROLE_SMS_UPDATER))
            obj.init_sms_update_workflow()
        else:
            obj.disable_sms_update_workflow(request.user)
            obj.remove_role(obj.user, Role.objects.get(name=self.model.ROLE_SMS_UPDATER))
        obj.save()

admin.site.register(get_model('rsr', 'userprofile'), UserProfileAdmin)


class ProjectCommentAdmin(admin.ModelAdmin):
    list_display    = ('project', 'user', 'comment', 'time', )    
    list_filter     = ('project', 'time', )

admin.site.register(get_model('rsr', 'projectcomment'), ProjectCommentAdmin)


class ProjectUpdateAdmin(admin.ModelAdmin):

    list_display    = ('id', 'project', 'user', 'text', 'time', 'get_is_featured', 'img',)    
    list_filter     = ('featured', 'time', 'project', )
    actions         = ['featured_on', 'featured_off']
    
    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def __init__(self, model, admin_site):
        """
        Override to add self.formfield_overrides.
        Needed to get the ImageWithThumbnailsField working in the admin.
        """
        self.formfield_overrides = {ImageWithThumbnailsField: {'widget': widgets.AdminFileWidget},}
        super(ProjectUpdateAdmin, self).__init__(model, admin_site)
    
    def featured_on(self, request, queryset):
        rows_updated = queryset.exclude(photo__exact='').update(featured=True)
        if rows_updated == 1:
            message_bit = _(u'1 update was')
        else:
            message_bit = _(u'%d updates were')  % rows_updated
        self.message_user(request, _(u'%s marked as featured.') % message_bit)
    featured_on.short_description = _(u'Mark selected updates as featured')
            
    def featured_off(self, request, queryset):
        rows_updated = queryset.update(featured=False)
        if rows_updated == 1:
            message_bit = _(u'1 update was')
        else:
            message_bit = _(u'%d updates were')  % rows_updated
        self.message_user(request, _(u'%s removed from featured.') % message_bit)
    featured_off.short_description = _(u'Remove selected updates from featured')
            
admin.site.register(get_model('rsr', 'projectupdate'), ProjectUpdateAdmin)
    

class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'user', 'name', 'email', 'time', 'engine', 'status', 'test', 'is_anonymous')
    list_filter = ('engine', 'status', 'test', 'is_anonymous')  
    actions = ('void_invoices',)
        
    def void_invoices(self, request, queryset):
        """Manually void invoices with a status of 1 (Pending) or 4 (Stale)
            
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
                    self.message_user(request, 'Invoice %d successfully voided.' % int(invoice.pk))
                valid_invoices.update(status=2)
            for invoice in invalid_invoices:
                # beth: put proper translation tag back in later--ugettext removed
                # Translators: invoice_status can be
                msg = u'Invoice %(invoice_id)d could not be voided. It is already %(invoice_status)s.' % dict(
                    invoice_id=invoice.pk, invoice_status=invoice.get_status_display().lower()
                )
                self.message_user(request, msg)
        else:
            for invoice in queryset:
                self.message_user(request, 'Invoice %d successfully voided.' % int(invoice.pk))
                queryset.update(status=2)
    void_invoices.short_description = u'Mark selected invoices as void'
    
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


class PartnerSiteAdmin(admin.ModelAdmin):
    form = PartnerSiteAdminForm

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(PartnerSiteAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + opts.get_delete_permission()):
            del actions['delete_selected']
        return actions

    def queryset(self, request):
        qs = super(PartnerSiteAdmin, self).queryset(request)
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

        get_rsr_limited_change_permission is used for partner orgs to limit their listing and editing to
        "own" projects, organisation, patner_site and user profiles
        """
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
            return True
        if request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
            if obj:
                return obj.organisation == request.user.get_profile().organisation
            else:
                return True
        return False

admin.site.register(get_model('rsr', 'partnersite'), PartnerSiteAdmin)
