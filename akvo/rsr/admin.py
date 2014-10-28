# -*- coding: utf-8 -*-

from django import forms
from django.conf import settings
from django.contrib import admin
from django.contrib.admin import helpers, widgets
from django.contrib.admin.options import IS_POPUP_VAR
from django.contrib.admin.util import flatten_fieldsets
from django.contrib.auth import get_permission_codename, get_user_model
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.db import models, transaction
from django.db.models import get_model
from django.forms.formsets import all_valid
from django.forms.util import ErrorList
from django.forms import TextInput, Textarea
from django.utils.decorators import method_decorator
from django.utils.translation import ugettext_lazy as _
from django.views.decorators.csrf import csrf_protect
from django.utils.encoding import force_text

from sorl.thumbnail.fields import ImageField
import os.path

# from akvo.rsr.forms import PartnerSiteAdminForm, RSR_UserChangeForm, RSR_UserCreationForm
from akvo.rsr.mixins import TimestampsAdminDisplayMixin
from akvo.utils import permissions, custom_get_or_create_country, RSR_LIMITED_CHANGE
from akvo.rsr.fields import ValidXMLCharField

NON_FIELD_ERRORS = '__all__'
csrf_protect_m = method_decorator(csrf_protect)

admin.site.unregister(Group)


class RSRGroupAdmin(GroupAdmin):
    list_display = GroupAdmin.list_display + (permissions,)

admin.site.register(Group, RSRGroupAdmin)


class PermissionAdmin(admin.ModelAdmin):
    list_display = (u'__unicode__', u'content_type', )
    list_filter = (u'content_type', )
    ordering = (u'content_type', )

admin.site.register(get_model('auth', 'permission'), PermissionAdmin)


class CountryAdmin(admin.ModelAdmin):
    list_display = (u'name', u'iso_code', u'continent', u'continent_code', )
    list_filter = (u'continent', )
    readonly_fields = (u'name', u'continent', u'continent_code')

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(CountryAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + get_permission_codename('delete', opts)):
            del actions['delete_selected']
        return actions

    def save_model(self, request, obj, form, change):
        if obj.iso_code:
            custom_get_or_create_country(obj.iso_code, obj)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return u'name', u'continent', u'continent_code'
        else:
            return u'name', u'continent', u'continent_code'


class OrganisationLocationInline(admin.StackedInline):
    model = get_model('rsr', 'organisationlocation')
    extra = 0


class InternalOrganisationIDAdmin(admin.ModelAdmin):
    list_display = (u'identifier', u'recording_org', u'referenced_org',)
    search_fields = (u'identifier', u'recording_org__name', u'referenced_org__name',)

admin.site.register(get_model('rsr', 'internalorganisationid'), InternalOrganisationIDAdmin)


class OrganisationAdminForm(forms.ModelForm):
    def clean_iati_org_id(self):
        return self.cleaned_data['iati_org_id'] or None


class OrganisationAdmin(TimestampsAdminDisplayMixin, admin.ModelAdmin):
    # NOTE: The change_form.html template relies on the fieldsets to put the inline forms correctly.
    # If the fieldsets are changed, the template may need fixing too
    fieldsets = (
        (_(u'General information'), {'fields': ('name', 'long_name', 'partner_types', 'organisation_type',
                                                'new_organisation_type', 'logo', 'url', 'iati_org_id', 'language',
                                                'content_owner', 'allow_edit',)}),
        (_(u'Contact information'), {'fields': ('phone', 'mobile', 'fax',  'contact_person',  'contact_email', ), }),
        (_(u'About the organisation'), {'fields': ('description', 'notes',)}),
    )
    form = OrganisationAdminForm
    inlines = (OrganisationLocationInline,)
    exclude = ('internal_org_ids',)
    # note that readonly_fields is changed by get_readonly_fields()
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('partner_types', 'created_at', 'last_modified_at',)
    list_display = ('name', 'long_name', 'website', 'language')
    search_fields = ('name', 'long_name')

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(OrganisationAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + get_permission_codename('delete', opts)):
            del actions['delete_selected']
        return actions

    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def __init__(self, model, admin_site):
        """
        Override to add self.formfield_overrides.
        Needed to get the ImageField working in the admin.
        """
        self.formfield_overrides = {ImageField: {'widget': widgets.AdminFileWidget}, }
        super(OrganisationAdmin, self).__init__(model, admin_site)

    def allowed_partner_types(self, obj):
        return ', '.join([pt.label for pt in obj.partner_types.all()])

    def get_list_display(self, request):
        # see the notes fields in the change list if you have the right permissions
        if request.user.has_perm(self.opts.app_label + '.' + get_permission_codename('change', self.opts)):
            return list(self.list_display) + ['allowed_partner_types']
        return super(OrganisationAdmin, self).get_list_display(request)

    def get_readonly_fields(self, request, obj=None):
        # parter_types is read only unless you have change permission for organisations
        if not request.user.has_perm(self.opts.app_label + '.' + get_permission_codename('change', self.opts)):
            self.readonly_fields = ('partner_types', 'created_at', 'last_modified_at',)
        else:
            self.readonly_fields = ('created_at', 'last_modified_at',)
        return super(OrganisationAdmin, self).get_readonly_fields(request, obj=obj)

    def get_queryset(self, request):
        qs = super(OrganisationAdmin, self).get_queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            organisation_ids = [org.pk for org in request.user.organisations.all()]
            return qs.filter(pk__in=organisation_ids)
        else:
            raise PermissionDenied

    def has_change_permission(self, request, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance.

        If `obj` is None, this should return True if the given request has
        permission to change *any* object of the given type.
        """
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return True
        # RSR Partner admins/editors: limit their listing and editing to "own" projects, organisation and user profiles
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            if obj:
                return obj in request.user.organisations.all()
            else:
                return True
        return False

admin.site.register(get_model('rsr', 'organisation'), OrganisationAdmin)


class OrganisationAccountAdmin(admin.ModelAdmin):
    list_display = (u'organisation', u'account_level', )

admin.site.register(get_model('rsr', 'organisationaccount'), OrganisationAccountAdmin)


class LinkInline(admin.StackedInline):
    model = get_model('rsr', 'link')
    extra = 1
    list_display = ('url', 'caption', 'show_link')
    fieldsets = (
        (None, {
            'fields': ('kind', 'url', 'caption')
        }),
        ('IATI fields (advanced)', {
            'classes': ('collapse',),
            'fields': ('format', 'category', 'language')
        })
    )


class BudgetItemLabelAdmin(admin.ModelAdmin):
    list_display = (u'label',)

admin.site.register(get_model('rsr', 'budgetitemlabel'), BudgetItemLabelAdmin)


class BudgetItemAdminInLineFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        super(BudgetItemAdminInLineFormSet, self).clean()

        budget_item_count = 0
        including_total = False
        for form in self.forms:
            if not form.is_valid():
                return
            if form.cleaned_data and not form.cleaned_data.get('DELETE'):
                budget_item_count += 1
                if form.cleaned_data.get('label').label == 'total':
                    including_total = True

        if budget_item_count > 1 and including_total:
            raise forms.ValidationError(_("The 'total' budget item cannot be used in combination with other budget items."))


class BudgetItemAdminInLine(admin.TabularInline):
    model = get_model('rsr', 'budgetitem')
    extra = 1
    formset = BudgetItemAdminInLineFormSet
    fields = ('label', 'other_extra', 'amount', 'type', 'period_start', 'period_start_text', 'period_end',
              'period_end_text', 'value_date')

    class Media:
        css = {'all': (os.path.join(settings.STATIC_URL, 'rsr/main/css/src/rsr_admin.css').replace('\\', '/'),)}
        js = (os.path.join(settings.STATIC_URL, 'rsr/main/js/src/rsr_admin.js').replace('\\', '/'),)


class PublishingStatusAdmin(admin.ModelAdmin):
    list_display = (u'project', u'status', )
    search_fields = ('project__title', 'status', )
    list_filter = ('status', )

admin.site.register(get_model('rsr', 'publishingstatus'), PublishingStatusAdmin)


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
        def duplicates_in_list(seq):
            "return True if the list contains duplicate items"
            seq_set = list(set(seq))
            # if the set isn't of the same length as the list there must be dupes in the list
            return len(seq) != len(seq_set)

        user = self.request.user
        errors = []
        # superusers can do whatever they like!
        if user.is_superuser:
            my_org_found = True
        # if the user is a partner org we try to avoid foot shooting
        elif user.get_is_org_admin() or user.get_is_org_editor():
            my_orgs = user.organisations.all()
            my_org_found = False
            for form in self.forms:
                try:
                    form_org = form.cleaned_data['organisation']
                    if not form.cleaned_data.get('DELETE', False) and form_org in my_orgs:
                        # found one of our own orgs, all is well move on!
                        my_org_found = True
                        break
                except:
                    pass
        else:
            my_org_found = True
        if not my_org_found:
            errors += [_(u'Your organisation should be somewhere here.')]

        # now check that the same org isn't assigned the same partner_type more than once
        partner_types = {}
        for form in self.forms:
            # populate a dict with org names as keys and a list of partner_types as values
            try:
                if not form.cleaned_data.get('DELETE', False):
                    partner_types.setdefault(form.cleaned_data['organisation'], []).append(form.cleaned_data['partner_type'])
            except:
                pass
        for org, types in partner_types.items():
            # are there duplicates in the list of partner_types?
            if duplicates_in_list(types):
                errors += [_(u'{org} has duplicate partner types of the same kind.'.format(org=org))]

        self._non_form_errors = ErrorList(errors)


class RSR_PartnershipInlineForm(forms.ModelForm):
    def clean_partner_type(self):
        partner_types = get_model('rsr', 'PartnerType').objects.all()
        partner_types_dict = {partner_type.id: partner_type.label for partner_type in partner_types}
        allowed = [partner_type.pk for partner_type in self.cleaned_data['organisation'].partner_types.all()]
        # always allow field and funding partnerships
        allowed.extend([u'field', u'funding'])
        allowed = list(set(allowed))
        data = self.cleaned_data['partner_type']
        if data not in allowed:
            raise forms.ValidationError("{org} is not allowed to be a {partner_type_label}".format(
                org=self.cleaned_data['organisation'],
                partner_type_label=partner_types_dict[data]
            ))
        return data


class PartnershipInline(admin.TabularInline):
    model = get_model('rsr', 'Partnership')
    extra = 1
    form = RSR_PartnershipInlineForm
    formset = RSR_PartnershipInlineFormFormSet
    formfield_overrides = {
        ValidXMLCharField: {'widget': TextInput(attrs={'size':'20'})},
        models.URLField: {'widget': TextInput(attrs={'size':'30'})}
    }

    def get_formset(self, request, *args, **kwargs):
        "Add the request to the formset for use in RSR_PartnershipInlineFormFormSet.clean()"
        formset = super(PartnershipInline, self).get_formset(request, *args, **kwargs)
        formset.request = request
        return formset


class ProjectLocationInline(admin.StackedInline):
    model = get_model('rsr', 'projectlocation')
    extra = 0
    fieldsets = (
        (None, {
            'fields': ('latitude', 'longitude', 'city', 'state', 'country', 'address_1', 'address_2', 'postcode')
        }),
        ('IATI fields (advanced)', {
            'classes': ('collapse',),
            'fields': ('reference', 'location_code', 'name', 'description', 'activity_description',
                       'administrative_code', 'administrative_vocabulary', 'administrative_level', 'exactness',
                       'location_reach', 'location_class', 'feature_designation')
        }),
    )


class CountryBudgetInline(admin.StackedInline):
    model = get_model('rsr', 'CountryBudgetItem')
    extra = 0
    fieldsets = (
        ('Country Budget Item', {
            'classes': ('collapse',),
            'fields': ('code', 'description', 'vocabulary', 'percentage')
        }),
    )


class ResultInline(admin.StackedInline):
    model = get_model('rsr', 'Result')
    extra = 0
    fieldsets = (
        ('Result', {
            'classes': ('collapse',),
            'fields': ('title', 'type', 'aggregation_status', 'description', 'description_type')
        }),
    )


class PlannedDisbursementInline(admin.StackedInline):
    model = get_model('rsr', 'PlannedDisbursement')
    extra = 0
    fieldsets = (
        ('Planned Disbursement', {
            'classes': ('collapse',),
            'fields': ('currency', 'value', 'value_date', 'period_start', 'period_end', 'updated')
        }),
    )


class PolicyMarkerInline(admin.StackedInline):
    model = get_model('rsr', 'PolicyMarker')
    extra = 0
    fieldsets = (
        ('Policy Marker', {
            'classes': ('collapse',),
            'fields': ('policy_marker', 'significance', 'vocabulary', 'description')
        }),
    )


class ProjectConditionInline(admin.StackedInline):
    model = get_model('rsr', 'ProjectCondition')
    extra = 0
    fieldsets = (
        ('Project Condition', {
            'classes': ('collapse',),
            'fields': ('type', 'text', 'attached')
        }),
    )


class ProjectContactInline(admin.StackedInline):
    model = get_model('rsr', 'ProjectContact')
    extra = 0
    fieldsets = (
        ('Project Contact', {
            'classes': ('collapse',),
            'fields': ('person_name', 'organisation', 'type', 'email', 'job_title', 'mailing_address', 'state',
            'country', 'telephone', 'website')
        }),
    )


class RecipientCountryInline(admin.StackedInline):
    model = get_model('rsr', 'RecipientCountry')
    extra = 0
    fieldsets = (
        ('Recipient Country', {
            'classes': ('collapse',),
            'fields': ('country', 'percentage', 'text')
        }),
    )


class RecipientRegionInline(admin.StackedInline):
    model = get_model('rsr', 'RecipientRegion')
    extra = 0
    fieldsets = (
        ('Recipient Region', {
            'classes': ('collapse',),
            'fields': ('region', 'region_vocabulary', 'percentage', 'text')
        }),
    )


class SectorInline(admin.StackedInline):
    model = get_model('rsr', 'Sector')
    extra = 0
    fieldsets = (
        ('Sector', {
            'classes': ('collapse',),
            'fields': ('sector_code', 'vocabulary', 'percentage', 'text')
        }),
    )


class TransactionInline(admin.StackedInline):
    model = get_model('rsr', 'Transaction')
    extra = 0
    fieldsets = (
        ('Transaction', {
            'classes': ('collapse',),
            'fields': ('currency', 'value', 'value_date', 'description', 'transaction_date', 'reference',
                       'transaction_type', 'transaction_type_text', 'provider_organisation',
                       'provider_organisation_ref', 'provider_organisation_activity', 'receiver_organisation',
                       'receiver_organisation_ref', 'receiver_organisation_activity', 'aid_type', 'aid_type_text',
                       'disbursement_channel', 'disbursement_channel_text', 'finance_type', 'finance_type_text',
                       'flow_type', 'flow_type_text', 'tied_status', 'tied_status_text', )
        }),
    )


class LegacyDataInline(admin.StackedInline):
    model = get_model('rsr', 'LegacyData')
    extra = 0
    fieldsets = (
        ('Legacy Data', {
            'classes': ('collapse',),
            'fields': ('name', 'value', 'iati_equivalent')
        }),
    )


class ProjectAdmin(TimestampsAdminDisplayMixin, admin.ModelAdmin):
    model = get_model('rsr', 'project')
    inlines = (
        GoalInline, ProjectLocationInline, BudgetItemAdminInLine, BenchmarkInline, PartnershipInline, LinkInline,
        ProjectConditionInline, ProjectContactInline, CountryBudgetInline, PlannedDisbursementInline,
        PolicyMarkerInline, RecipientCountryInline, RecipientRegionInline, ResultInline, SectorInline,
        TransactionInline, LegacyDataInline
    )
    save_as = True

    fieldsets = (
        (_(u'General Information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'This section should contain the top-level information about your project which will be publicly available and used within searches. Try to keep your Title and Subtitle short and snappy.'
            ),
            'fields': ('title', 'subtitle', 'status', 'language', 'date_start_planned', 'date_start_actual',
                       'date_end_planned', 'date_end_actual', 'donate_button', 'hierarchy'),
            }),
        (_(u'Description'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Here you can complete the in-depth descriptive details regarding your project, its history and plans for the future. Both The Project Plan and Sustainability fields are unlimited, so you can add additional details to your project there.'
            ),
            'fields': ('project_plan_summary', 'background', 'current_status', 'project_plan', 'sustainability', 'target_group',),
            }),
        (_(u'Goals'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Here you should be entering information about what your project intends to achieve through its implementation.'
            ),
            'fields': ('goals_overview',),
            }),
        (_(u'Photo'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Please upload a photo that displays an interesting part of your project, plan or implementation.'
            ),
            'fields': ('current_image', 'current_image_caption', 'current_image_credit'),
            }),
        (_(u'Locations'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Here you can add the physical locations where the project is being carried out. These will appear on the map on your project page. Use the link to iTouchMap.com to obtain the Coordinates for your locations, as these are the items that ensure the pin is in the correct place.'
            ),
            'fields': (),
            }),
        (_(u'Budget'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Please enter the details of what your project will be spending its available funds on.'
            ),
            'fields': ('currency', ),
            }),
        (_(u'Project Focus'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Here you can choose the Categories, & Focus Areas that your project is operating in. Once you have selected those, Save your project and you will then be presented with a list of Benchmarks applicable to your fields which you can define for measuring the success of your project.'
            ),
            'fields': ('categories',),
            }),
        (_(u'Partners'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Add each of the partners you are working with on your project. These organisations must be existing already in Akvo RSR. If you are working with a Partner that does not exist in the system, please send the details of the organisation including Name, Address, Logo, Contact Person and Website to support@akvo.org.'
            ),
            'fields': (),
            }),
        (_(u'Additional Information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'You can add links to your project such as Organisation Websites or Akvopedia articles containing relevant information to improve the information available to viewers of your project. You can also make notes on the project. These notes are only visible within this Admin so can be used to identify missing information, specific contact details or status changes that you do not want to be visible on your project page.'
            ),
            'fields': ('notes',),
            }),
        (_(u'Keywords'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Add keywords belonging to your project. These keywords must be existing already in Akvo RSR. If you want to use a keyword that does not exist in the system, please contact support@akvo.org.'
            ),
            'fields': ('keywords',),
            }),
        (_(u'Additional IATI information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Optionally, you can add additional information based on the IATI standard.'
            ),
            'classes': ('collapse',),
            'fields': ('project_scope', 'capital_spend_percentage', 'collaboration_type',
                       'default_aid_type', 'default_finance_type', 'default_flow_type', 'default_tied_status'),
            }),
    )
    filter_horizontal = ('keywords',)
    list_display = ('id', 'title', 'status', 'project_plan_summary', 'latest_update', 'show_current_image', 'is_published', 'show_keywords')
    search_fields = ('title', 'status', 'project_plan_summary', 'partnerships__internal_id')
    list_filter = ('currency', 'status', 'keywords',)
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('budget', 'funds',  'funds_needed', 'created_at', 'last_modified_at',)

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(ProjectAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + get_permission_codename('delete', opts)):
            del actions['delete_selected']
        return actions

    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def __init__(self, model, admin_site):
        """
        Override to add self.formfield_overrides.
        Needed to get the ImageField working in the admin.
        """
        self.formfield_overrides = {ImageField: {'widget': widgets.AdminFileWidget}, }
        super(ProjectAdmin, self).__init__(model, admin_site)

    def get_queryset(self, request):
        """
        Return a queryset possibly filtered depending on current user's group(s)
        """
        qs = super(ProjectAdmin, self).get_queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            user = request.user
            projects = user.organisations.all_projects()
            # Access to Partner users may be limited by Support partner "ownership"
            allowed_projects = [project.pk for project in projects if user.allow_edit(project)]
            return qs.filter(pk__in=allowed_projects)
        else:
            raise PermissionDenied

    def has_change_permission(self, request, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance.

        If `obj` is None, this should return True if the given request has
        permission to change *any* object of the given type.
        """
        opts = self.opts
        user = request.user

        # RSR editors/managers
        if user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return True

        # RSR Partner admins/editors: limit their listing and editing to "own" projects, organisation and user profiles
        if user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            # On the Project form
            if obj:
                return user.allow_edit(obj)
            return True

        return False


    @csrf_protect_m
    @transaction.atomic
    def add_view(self, request, form_url='', extra_context=None):
        "The 'add' admin view for this model."
        model = self.model
        opts = model._meta

        if not self.has_add_permission(request):
            raise PermissionDenied

        ModelForm = self.get_form(request)
        formsets = []
        inline_instances = self.get_inline_instances(request, None)
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
                # add to add_view() from django 1.4
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
                                      prefix=prefix, queryset=inline.get_queryset(request))
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

                # hack by GvH to get user's organisation preset as partner when adding a new project
                if prefix == 'partnerships':
                    formset = FormSet(instance=self.model(), prefix=prefix,
                                      initial=[{'organisation': request.user.organisations.all()[0]}],
                                      queryset=inline.get_queryset(request))
                else:
                    formset = FormSet(instance=self.model(), prefix=prefix,
                                      queryset=inline.get_queryset(request))
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
            'title': _('Add %s') % force_text(opts.verbose_name),
            'adminform': adminForm,
            'is_popup': IS_POPUP_VAR in request.REQUEST,
            'show_delete': False,
            'media': media,
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'app_label': opts.app_label,
            'preserved_filters': self.get_preserved_filters(request),
        }
        context.update(extra_context or {})
        return self.render_change_form(request, context, form_url=form_url, add=True)

admin.site.register(get_model('rsr', 'project'), ProjectAdmin)


class ApiKeyInline(admin.TabularInline):
    model = get_model('tastypie', 'apikey')
    fields = ('key',)
    readonly_fields = ('key',)

    def has_delete_permission(self, request, obj=None, **kwargs):
        return False


class UserAdmin(UserAdmin):
    model = get_model('rsr', 'user')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        #(_('Organisations'), {'fields': ('organisations',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    inlines = (
        ApiKeyInline,
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')}
        ),
    )
    # form = RSR_UserChangeForm
    # add_form = RSR_UserCreationForm
    list_display = (
        'username', 'email', 'get_organisation_names', 'get_full_name', 'get_is_active', 'get_is_org_admin',
        'get_is_org_editor', 'latest_update_date'
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(UserAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + get_permission_codename('delete', opts)):
            del actions['delete_selected']
        return actions

    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            opts = self.opts
            if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
                return ['last_login', 'date_joined']
            else:
                # all fields are read-only if user does not have permissions to change
                return [
                    'username', 'email', 'password', 'first_name', 'last_name', #'organisations', 'organisation',
                    'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'last_login', 'date_joined'
                ]
        else:
            return ['last_login', 'date_joined']

    def has_change_permission(self, request, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance.

        If `obj` is None, this should return True if the given request has
        permission to change *any* object of the given type.
        """
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return True
        # RSR Partner admins/editors: limit their listing and editing to "own" projects, organisation and user profiles
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            my_orgs = request.user.organisations.all()
            if obj:
                return obj.organisations in my_orgs
            else:
                return True
        return False

    def get_queryset(self, request):
        """
        Return a queryset possibly filtered depending on current user's organisation(s)
        """
        qs = super(UserAdmin, self).get_queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            organisations = request.user.organisations.all()
            return qs.filter(organisations__in=organisations)
        else:
            raise PermissionDenied

admin.site.register(get_user_model(), UserAdmin)


class IndicatorPeriodInline(admin.TabularInline):
    model = get_model('rsr', 'IndicatorPeriod')
    extra = 1


class ResultIndicatorAdmin(admin.ModelAdmin):
    list_display = ('result', 'title', 'description')
    list_filter = ('result', 'title')
    search_fields = ('result', 'title',)
    inlines = (IndicatorPeriodInline,)

admin.site.register(get_model('rsr', 'Indicator'), ResultIndicatorAdmin)


class ProjectCommentAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'comment', 'created_at', )
    list_filter = ('project', 'created_at', )
    search_fields = ('project__id', 'project__title', 'user__first_name', 'user__last_name',)
    readonly_fields = ('created_at', 'last_modified_at')

admin.site.register(get_model('rsr', 'projectcomment'), ProjectCommentAdmin)


class ProjectUpdateLocationInline(admin.StackedInline):
    model = get_model('rsr', 'projectupdatelocation')
    extra = 0


class ProjectUpdateAdmin(TimestampsAdminDisplayMixin, admin.ModelAdmin):

    list_display = ('id', 'project', 'user', 'text', 'language', 'created_at', 'img',)
    list_filter = ('created_at', 'project', )
    search_fields = ('project__id', 'project__title', 'user__first_name', 'user__last_name',)
    inlines = (ProjectUpdateLocationInline,)
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('created_at', 'last_modified_at')

    fieldsets = (
        (_(u'General Information'), {
            'fields': ('project','user','update_method', 'created_at', 'last_modified_at'),
        }),
        (_(u'Content'), {
            'fields': ('title','text','language', ),
        }),
        (_(u'Image and video'), {
            'fields': ('photo', 'photo_caption', 'photo_credit', 'video', 'video_caption', 'video_credit',),
        }),
    )
    #Methods overridden from ModelAdmin (django/contrib/admin/options.py)
    def __init__(self, model, admin_site):
        """
        Override to add self.formfield_overrides.
        Needed to get the ImageField working in the admin.
        """
        self.formfield_overrides = {ImageField: {'widget': widgets.AdminFileWidget}, }
        super(ProjectUpdateAdmin, self).__init__(model, admin_site)

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
        valid_invoices = queryset.filter(status__in=[1, 4])
        invalid_invoices = queryset.filter(status__in=[2, 3])
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


class PartnerSiteAdmin(TimestampsAdminDisplayMixin, admin.ModelAdmin):
    # form = PartnerSiteAdminForm
    fieldsets = (
        # the 'notes' field is added in get_fieldsets() for eligible users
        (u'General', dict(fields=('organisation', 'enabled',))),
        (u'HTTP', dict(fields=('hostname', 'cname', 'custom_return_url', 'custom_return_url_text', 'piwik_id',))),
        (u'Style and content',
            dict(fields=('about_box', 'about_image', 'custom_css', 'custom_logo', 'custom_favicon',))),
        (u'Languages and translation', dict(fields=('default_language', 'ui_translation', 'google_translation',))),
        (u'Social', dict(fields=('twitter_button', 'facebook_button', 'facebook_app_id',))),
        (_(u'Project selection'), {
            'description': u'{}'.format(
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'Select the projects to be shown on your Site.'
                u'</p>'
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'The default setting selects all projects associated with the organisation of the Site. '
                u'</p>'
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'De-selecting the "Show only projects of partner" check-box shows all projects in RSR. '
                u'This is meant to be used with the keywords below, '
                u'thus selecting only projects associated with the selected keywords. '
                u'<br/>If keywords are added to a Site showing only projects of a partner, '
                u'the selection will be further filtered by only showing associated projects with those keywords.'
                u'</p>'
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'When "Exclude projects with selected keyword is checked" '
                u'projects with the chosen keywords are instead excluded from the list.'
                u'</p>'
            ),
            'fields': ('partner_projects', 'exclude_keywords', 'keywords'),
        }),
    )
    filter_horizontal = ('keywords',)
    list_display = ('__unicode__', 'full_domain', 'enabled', 'show_keywords')
    list_filter = ('enabled', 'keywords')
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('created_at', 'last_modified_at',)

    def get_fieldsets(self, request, obj=None):
        # don't show the notes field unless you have "add" permission on the PartnerSite model
        # (currently means an Akvo staff user (or superuser))
        # note that this is somewhat fragile as it relies on adding/removing from the _first_ fieldset
        if request.user.has_perm(self.opts.app_label + '.' + get_permission_codename('add', self.opts)):
            self.fieldsets[0][1]['fields'] = ('organisation', 'enabled', 'notes',)
        else:
            self.fieldsets[0][1]['fields'] = ('organisation', 'enabled',)
        return super(PartnerSiteAdmin, self).get_fieldsets(request, obj)

    def get_form(self, request, obj=None, **kwargs):
        """ Workaround bug http://code.djangoproject.com/ticket/9360
        """
        return super(PartnerSiteAdmin, self).get_form(
            request, obj, fields=flatten_fieldsets(self.get_fieldsets(request, obj))
        )

    def get_list_display(self, request):
        # see the notes fields in the change list if you have the right permissions
        if request.user.has_perm(self.opts.app_label + '.' + get_permission_codename('add', self.opts)):
            return list(self.list_display) + ['notes']
        return super(PartnerSiteAdmin, self).get_list_display(request)

    def get_actions(self, request):
        """ Remove delete admin action for "non certified" users"""
        actions = super(PartnerSiteAdmin, self).get_actions(request)
        opts = self.opts
        if not request.user.has_perm(opts.app_label + '.' + get_permission_codename('delete', opts)):
            del actions['delete_selected']
        return actions

    def get_queryset(self, request):
        qs = super(PartnerSiteAdmin, self).get_queryset(request)
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return qs
        elif request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            organisations = request.user.organisations.all()
            return qs.filter(organisation__in=organisations)
        else:
            raise PermissionDenied

    def has_change_permission(self, request, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance.

        If `obj` is None, this should return True if the given request has
        permission to change *any* object of the given type.
        """
        opts = self.opts
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
            return True
        # RSR Partner admins/editors: limit their listing and editing to "own" projects, organisation and user profiles
        if request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
            if obj:
                return obj.organisation in request.user.organisations.all()
            else:
                return True
        return False

admin.site.register(get_model('rsr', 'partnersite'), PartnerSiteAdmin)

class KeywordAdmin(admin.ModelAdmin):
    model = get_model('rsr', 'Keyword')
    list_display = ('label',)

admin.site.register(get_model('rsr', 'Keyword'), KeywordAdmin)
