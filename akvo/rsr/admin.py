# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


from django import forms
from django.conf import settings
from django.contrib import admin
from django.contrib.admin import helpers, widgets
from django.contrib.admin.options import IS_POPUP_VAR
from django.contrib.admin.utils import flatten_fieldsets
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.forms import (
    UserChangeForm as DjangoUserChangeForm, UserCreationForm as DjangoUserCreationForm
)
from django.contrib.auth.models import Group
from django.db import models, transaction
from django.apps import apps
from django.forms.utils import ErrorList
from django.forms import TextInput
from django.utils.decorators import method_decorator
from django.utils.translation import ugettext_lazy as _
from django.views.decorators.csrf import csrf_protect
from django.utils.encoding import force_text

from sorl.thumbnail.fields import ImageField
from embed_video.admin import AdminVideoMixin
import os.path

from admin_actions import set_project_status_complete
from akvo.rsr.mixins import TimestampsAdminDisplayMixin
from akvo.utils import custom_get_or_create_country
from akvo.rsr.fields import ValidXMLCharField

from rules.contrib.admin import ObjectPermissionsModelAdmin
from nested_inline.admin import NestedModelAdmin, NestedStackedInline, NestedTabularInline

NON_FIELD_ERRORS = '__all__'
csrf_protect_m = method_decorator(csrf_protect)


class CountryAdmin(admin.ModelAdmin):
    list_display = (u'name', u'iso_code', u'continent', u'continent_code', )
    list_filter = (u'continent', )
    readonly_fields = (u'name', u'continent', u'continent_code')

    def save_model(self, request, obj, form, change):
        if obj.iso_code:
            custom_get_or_create_country(obj.iso_code, obj)

    def get_readonly_fields(self, request, obj=None):
        return u'name', u'continent', u'continent_code'


class OrganisationLocationInline(NestedStackedInline):
    model = apps.get_model('rsr', 'organisationlocation')
    fields = ('latitude', 'longitude', 'city', 'state', 'address_1', 'address_2', 'postcode',
              'iati_country')
    fk_name = 'location_target'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.locations.count() == 0 else 0
        else:
            return 1


class OrganisationTotalBudgetLineInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationtotalbudgetline')
    fields = ('currency', 'value', 'value_date', 'reference', 'text')
    fk_name = 'budget'

    def get_extra(self, request, obj=None, **kwargs):
        return 0


class OrganisationTotalBudgetInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationtotalbudget')
    inlines = (OrganisationTotalBudgetLineInline,)
    fields = ('currency', 'value', 'value_date', 'period_start', 'period_end', 'status')
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.total_budgets.count() == 0 else 0
        else:
            return 1


class OrganisationRecipientOrgBudgetLineInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationrecipientorgbudgetline')
    fields = ('currency', 'value', 'value_date', 'reference', 'text')
    fk_name = 'budget'

    def get_extra(self, request, obj=None, **kwargs):
        return 0


class OrganisationRecipientOrgBudgetInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationrecipientorgbudget')
    inlines = (OrganisationRecipientOrgBudgetLineInline, )
    fields = ('recipient_organisation', 'currency', 'value', 'value_date', 'period_start',
              'period_end', 'status')
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.recipient_org_budgets.count() == 0 else 0
        else:
            return 1


class OrganisationRegionBudgetLineInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationregionbudgetline')
    fields = ('currency', 'value', 'value_date', 'reference', 'text')
    fk_name = 'budget'

    def get_extra(self, request, obj=None, **kwargs):
        return 0


class OrganisationRegionBudgetInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationregionbudget')
    inlines = (OrganisationRegionBudgetLineInline, )
    fields = ('region', 'region_vocabulary', 'region_vocabulary_uri', 'text', 'currency', 'value',
              'value_date', 'period_start', 'period_end', 'status')
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.recipient_region_budgets.count() == 0 else 0
        else:
            return 1


class OrganisationCountryBudgetLineInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationcountrybudgetline')
    fields = ('currency', 'value', 'value_date', 'reference', 'text')
    fk_name = 'budget'

    def get_extra(self, request, obj=None, **kwargs):
        return 0


class OrganisationCountryBudgetInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationcountrybudget')
    inlines = (OrganisationCountryBudgetLineInline, )
    fields = ('country', 'text', 'currency', 'value', 'value_date', 'period_start', 'period_end',
              'status')
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.recipient_country_budgets.count() == 0 else 0
        else:
            return 1


class OrganisationTotalExpenditureLineInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationexpenseline')
    fields = ('currency', 'value', 'value_date', 'reference', 'text')
    fk_name = 'expenditure'

    def get_extra(self, request, obj=None, **kwargs):
        return 0


class OrganisationTotalExpenditureInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationtotalexpenditure')
    inlines = (OrganisationTotalExpenditureLineInline, )
    fields = ('currency', 'value', 'value_date', 'period_start', 'period_end')
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.total_expenditures.count() == 0 else 0
        else:
            return 1


class OrganisationDocumentCategoryInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationdocumentcategory')
    fields = ('category', )
    fk_name = 'document'

    def get_extra(self, request, obj=None, **kwargs):
        return 0


class OrganisationDocumentCountryInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationdocumentcountry')
    fields = ('country', 'text')
    fk_name = 'document'

    def get_extra(self, request, obj=None, **kwargs):
        return 0


class OrganisationDocumentInline(NestedStackedInline):
    model = apps.get_model('rsr', 'organisationdocument')
    inlines = (OrganisationDocumentCategoryInline, OrganisationDocumentCountryInline)
    fields = ('url', 'document', 'format', 'title', 'title_language', 'language', 'document_date')
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.documents.count() == 0 else 0
        else:
            return 1


class OrganisationCustomFieldInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationcustomfield')
    fields = ('name', 'type', 'section', 'order', 'max_characters', 'mandatory', 'help_text')
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.custom_fields.count() == 0 else 0
        else:
            return 1


class OrganisationIndicatorLabelInline(NestedTabularInline):
    model = apps.get_model('rsr', 'OrganisationIndicatorLabel')
    fields = ('label',)
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.indicator_labels.count() == 0 else 0
        else:
            return 1


class InternalOrganisationIDAdmin(admin.ModelAdmin):
    list_display = (u'identifier', u'recording_org', u'referenced_org',)
    search_fields = (u'identifier', u'recording_org__name', u'referenced_org__name',)

admin.site.register(apps.get_model('rsr', 'internalorganisationid'), InternalOrganisationIDAdmin)


class OrganisationAdminForm(forms.ModelForm):
    def clean_iati_org_id(self):
        return self.cleaned_data['iati_org_id'] or None


def enable_restrictions(modeladmin, request, queryset):
    queryset.update(enable_restrictions=True)


enable_restrictions.short_description = ("Enable project access restrictions for the selected "
                                         "organisations")


class OrganisationAdmin(TimestampsAdminDisplayMixin, ObjectPermissionsModelAdmin, NestedModelAdmin):

    """OrganisationAdmin.

    NOTE: The change_form.html template relies on the fieldsets to put the inline forms correctly.
    If the fieldsets are changed, the template may need fixing too
    """

    fieldsets = (
        (_(u'General information'),
            {'fields': ('name', 'long_name', 'iati_org_id', 'description', 'new_organisation_type',
                        'logo', 'language', 'currency', 'iati_prefixes')}),
        (_(u'Contact information'),
            {'fields': ('url', 'facebook', 'twitter', 'linkedin', 'phone', 'mobile', 'fax',
                        'contact_person', 'contact_email', )}),
        (_(u'Organisation settings'),
            {'fields': ('can_create_projects', 'enable_restrictions', 'public_iati_file',
                        'content_owner')}),
        (_(u'Notes'), {'fields': ('notes', )}),
    )
    form = OrganisationAdminForm
    inlines = (OrganisationLocationInline, OrganisationTotalBudgetInline,
               OrganisationRecipientOrgBudgetInline, OrganisationRegionBudgetInline,
               OrganisationCountryBudgetInline, OrganisationTotalExpenditureInline,
               OrganisationDocumentInline, OrganisationCustomFieldInline,
               OrganisationIndicatorLabelInline)
    exclude = ('internal_org_ids',)
    list_display = ('name', 'long_name', 'enable_restrictions', 'website', 'language')
    search_fields = ('name', 'long_name')
    actions = (enable_restrictions,)

    def __init__(self, model, admin_site):
        """Override to add self.formfield_overrides. Needed for ImageField working in the admin."""
        self.formfield_overrides = {ImageField: {'widget': widgets.AdminFileWidget}, }
        super(OrganisationAdmin, self).__init__(model, admin_site)

    def get_readonly_fields(self, request, obj=None):
        """Make sure only super users can set the ability to become a reporting org"""
        readonly_fields = ['created_at', 'last_modified_at']
        if not request.user.is_superuser:
            readonly_fields.append('can_create_projects')

        if request.resolver_match.args:
            org_id, = request.resolver_match.args
            org = self.get_object(request, org_id)
            if org is not None and not org.can_disable_restrictions():
                readonly_fields.append('enable_restrictions')

        return readonly_fields

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(OrganisationAdmin, self).get_queryset(request)

        from .models import Organisation
        org_set = set()
        for employment in request.user.employers.approved():
            if employment.group in [Group.objects.get(name='Admins'),
                                    Group.objects.get(name='Project Editors')]:
                for co_org in employment.organisation.content_owned_organisations():
                    org_set.add(co_org.pk)
        return Organisation.objects.filter(pk__in=org_set).distinct()

    @csrf_protect_m
    @transaction.atomic
    def add_view(self, request, form_url='', extra_context=None):
        "The 'add' admin view for this model."
        model = self.model
        opts = model._meta

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
            for FormSet, inline in self.get_formsets_with_inlines(request, new_object):
                prefix = FormSet.get_default_prefix()
                # check if we're trying to create a new project by copying an existing one. If so
                # we ignore location and benchmark inlines
                if "_saveasnew" not in request.POST or prefix not in ['benchmarks',
                                                                      'rsr-location-content_type-object_id']:
                    # end of add although the following block is indented as a result
                    prefixes[prefix] = prefixes.get(prefix, 0) + 1
                    if prefixes[prefix] != 1 or not prefix:
                        prefix = "%s-%s" % (prefix, prefixes[prefix])
                    formset = FormSet(data=request.POST, files=request.FILES,
                                      instance=new_object,
                                      save_as_new="_saveasnew" in request.POST,
                                      prefix=prefix, queryset=inline.get_queryset(request))
                    formsets.append(formset)
            if self.all_valid_with_nesting(formsets) and form_validated:
                self.save_model(request, new_object, form, False)
                self.save_related(request, form, formsets, False)
                message = self.construct_change_message(
                    request, form, formsets, add=True
                )
                self.log_addition(request, new_object, message)
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
            for FormSet, inline in self.get_formsets_with_inlines(request):
                prefix = FormSet.get_default_prefix()
                prefixes[prefix] = prefixes.get(prefix, 0) + 1
                if prefixes[prefix] != 1 or not prefix:
                    prefix = "%s-%s" % (prefix, prefixes[prefix])

                formset = FormSet(instance=self.model(), prefix=prefix,
                                  queryset=inline.get_queryset(request))
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
            inline_admin_formset = helpers.InlineAdminFormSet(
                inline, formset, fieldsets, prepopulated, readonly, model_admin=self
            )
            inline_admin_formsets.append(inline_admin_formset)
            media = media + inline_admin_formset.media

        context = {
            'title': _('Add %s') % force_text(opts.verbose_name),
            'adminform': adminForm,
            'is_popup': IS_POPUP_VAR in request.POST,
            'show_delete': False,
            'media': media,
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'app_label': opts.app_label,
            'preserved_filters': self.get_preserved_filters(request),
        }
        context.update(extra_context or {})
        return self.render_change_form(request, context, form_url=form_url, add=True)

admin.site.register(apps.get_model('rsr', 'organisation'), OrganisationAdmin)


class OrganisationAccountAdmin(admin.ModelAdmin):
    list_display = (u'organisation', u'account_level', )

admin.site.register(apps.get_model('rsr', 'organisationaccount'), OrganisationAccountAdmin)


class LinkInline(NestedTabularInline):
    model = apps.get_model('rsr', 'link')
    fields = ('kind', 'url', 'caption')

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.links.count() == 0 else 0
        else:
            return 1


class BudgetItemLabelAdmin(admin.ModelAdmin):
    list_display = (u'label',)

admin.site.register(apps.get_model('rsr', 'budgetitemlabel'), BudgetItemLabelAdmin)


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
            raise forms.ValidationError(
                _("The 'total' budget item cannot be used in combination with other budget items.")
            )


class BudgetItemAdminInLine(NestedTabularInline):
    model = apps.get_model('rsr', 'budgetitem')
    extra = 1
    formset = BudgetItemAdminInLineFormSet
    fields = ('label', 'other_extra', 'type', 'amount', 'period_start', 'period_end', 'value_date')

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.budget_items.count() == 0 else 0
        else:
            return 1

    class Media:
        css = {'all': (os.path.join(
            settings.STATIC_URL,
            'styles-src/admin/budget_item.css').replace('\\', '/'),)}
        js = (os.path.join(
            settings.STATIC_URL,
            'scripts-src/admin/budget_item.js').replace('\\', '/'),)


class PublishingStatusAdmin(admin.ModelAdmin):
    list_display = (u'project', u'status', )
    search_fields = ('project__title', 'status', )
    list_filter = ('status', )

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(PublishingStatusAdmin, self).get_queryset(request)

        from .models import PublishingStatus
        qs = PublishingStatus.objects.none()
        for employment in request.user.employers.approved():
            if employment.group in Group.objects.filter(name__in=['Admins', 'Project Editors']):
                project_pks = (project.pk for project in employment.organisation.all_projects())
                qs = qs | PublishingStatus.objects.filter(project__pk__in=project_pks)
        return qs.distinct()

admin.site.register(apps.get_model('rsr', 'publishingstatus'), PublishingStatusAdmin)


class BenchmarknameInline(admin.TabularInline):
    model = apps.get_model('rsr', 'Category').benchmarknames.through
    extra = 3


class BenchmarkInline(NestedTabularInline):
    model = apps.get_model('rsr', 'benchmark')
    # only show the value, category and benchmark are not to be edited here
    fieldsets = (
        (None, {
            'classes': ('collapse',),
            'fields': ('value',)
        }),
    )
    extra = 0
    max_num = 0


class GoalInline(NestedTabularInline):
    model = apps.get_model('rsr', 'goal')
    fieldsets = (
        (None, {
            'classes': ('collapse',),
            'fields': ('text',)
        }),
    )
    extra = 0
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
        if user.is_superuser or user.is_admin:
            my_org_found = True
        # if the user is a partner org we try to avoid foot shooting
        else:
            my_orgs = user.employers.approved().organisations()
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
        if not my_org_found:
            errors += [_(u'Your organisation should be somewhere here.')]

        # now check that the same org isn't assigned the same iati_organisation_role more than once
        iati_organisation_roles = {}
        for form in self.forms:
            # populate a dict with org names as keys and a list of iati_organisation_roles as values
            try:
                if not form.cleaned_data.get('DELETE', False):
                    iati_organisation_roles.setdefault(
                        form.cleaned_data['organisation'], []
                    ).append(form.cleaned_data['iati_organisation_role'])
            except:
                pass
        for org, roles in iati_organisation_roles.items():
            # are there duplicates in the list of organisation roles?
            if duplicates_in_list(roles):
                errors += [_(u'{} has duplicate organisation roles of the same kind.'.format(org))]

        self._non_form_errors = ErrorList(errors)


class PartnershipInline(NestedTabularInline):

    model = apps.get_model('rsr', 'Partnership')
    fields = ('organisation', 'iati_organisation_role', 'funding_amount', 'internal_id')
    extra = 0
    formset = RSR_PartnershipInlineFormFormSet
    formfield_overrides = {
        ValidXMLCharField: {'widget': TextInput(attrs={'size': '20'})},
        models.URLField: {'widget': TextInput(attrs={'size': '30'})}
    }

    def get_formset(self, request, *args, **kwargs):
        """Add the request to the formset for use in RSR_PartnershipInlineFormFormSet.clean()."""
        formset = super(PartnershipInline, self).get_formset(request, *args, **kwargs)
        formset.request = request
        return formset

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.partnerships.count() == 0 else 0
        else:
            return 1


class LocationAdministrativeInline(NestedTabularInline):

    model = apps.get_model('rsr', 'administrativelocation')
    fields = ('code', 'vocabulary', 'level')
    extra = 0


class ProjectLocationInline(NestedStackedInline):

    model = apps.get_model('rsr', 'projectlocation')
    inlines = (LocationAdministrativeInline,)
    fieldsets = (
        (None, {
            'fields': ('latitude', 'longitude', 'country', 'city', 'state', 'address_1',
                       'address_2', 'postcode')
        }),
        ('IATI fields (advanced)', {
            'classes': ('collapse',),
            'fields': ('reference', 'location_code', 'name', 'description', 'activity_description',
                       'exactness', 'location_reach', 'location_class', 'feature_designation')
        }),
    )

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.locations.count() == 0 else 0
        else:
            return 1


class ProjectDocumentInline(NestedStackedInline):
    model = apps.get_model('rsr', 'ProjectDocument')
    fieldsets = (
        (None, {
            'fields': ('url', 'document', 'title', 'format', 'language')
        }),
    )

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.documents.count() == 0 else 0
        else:
            return 1


class CountryBudgetInline(NestedTabularInline):
    model = apps.get_model('rsr', 'CountryBudgetItem')
    extra = 0
    fieldsets = (
        ('Country Budget Item', {
            'classes': ('collapse',),
            'fields': ('code', 'description', 'percentage')
        }),
    )


class IndicatorPeriodInline(NestedTabularInline):
    model = apps.get_model('rsr', 'IndicatorPeriod')
    fields = ('period_start', 'period_end', 'target_value', 'target_comment', 'actual_value',
              'actual_comment')

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.periods.count() == 0 else 0
        else:
            return 1


class IndicatorInline(NestedTabularInline):
    model = apps.get_model('rsr', 'Indicator')
    fields = ('title', 'description', 'measure', 'ascending', 'baseline_year', 'baseline_value',
              'baseline_comment')
    inlines = (IndicatorPeriodInline,)

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.indicators.count() == 0 else 0
        else:
            return 1


class ResultInline(NestedTabularInline):
    model = apps.get_model('rsr', 'Result')
    inlines = (IndicatorInline,)
    fields = ('title', 'description', 'type', 'aggregation_status')

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.results.count() == 0 else 0
        else:
            return 1


class PlannedDisbursementInline(NestedTabularInline):
    model = apps.get_model('rsr', 'PlannedDisbursement')
    extra = 0
    fieldsets = (
        ('Planned Disbursement', {
            'classes': ('collapse',),
            'fields': ('currency', 'value', 'value_date', 'period_start', 'period_end', 'type',
                       'updated')
        }),
    )


class PolicyMarkerInline(NestedTabularInline):
    model = apps.get_model('rsr', 'PolicyMarker')
    extra = 0
    fieldsets = (
        ('Policy Marker', {
            'classes': ('collapse',),
            'fields': ('policy_marker', 'significance', 'vocabulary', 'description')
        }),
    )


class ProjectConditionInline(NestedTabularInline):
    model = apps.get_model('rsr', 'ProjectCondition')
    extra = 0
    fieldsets = (
        ('Project Condition', {
            'classes': ('collapse',),
            'fields': ('type', 'text')
        }),
    )


class ProjectContactInline(NestedStackedInline):
    model = apps.get_model('rsr', 'ProjectContact')
    fieldsets = (
        (None, {
            'fields': ('type', 'person_name', 'email', 'job_title', 'organisation', 'telephone',
                       'mailing_address',)
        }),
        ('Additional fields', {
            'classes': ('collapse',),
            'fields': ('website', 'department', 'country', 'state',)
        }),
    )

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.contacts.count() == 0 else 0
        else:
            return 1


class RecipientCountryInline(NestedTabularInline):
    model = apps.get_model('rsr', 'RecipientCountry')
    extra = 0
    fieldsets = (
        ('Recipient Country', {
            'classes': ('collapse',),
            'fields': ('country', 'percentage', 'text')
        }),
    )


class RecipientRegionInline(NestedTabularInline):
    model = apps.get_model('rsr', 'RecipientRegion')
    extra = 0
    fieldsets = (
        ('Recipient Region', {
            'classes': ('collapse',),
            'fields': ('region', 'region_vocabulary', 'percentage', 'text')
        }),
    )


class SectorInline(NestedTabularInline):
    model = apps.get_model('rsr', 'Sector')
    fields = ('sector_code', 'vocabulary', 'percentage', 'text')

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.sectors.count() == 0 else 0
        else:
            return 1


class TransactionSectorInline(NestedTabularInline):
    model = apps.get_model('rsr', 'TransactionSector')
    fields = ('code', 'vocabulary', 'text')
    extra = 0


class TransactionInline(NestedStackedInline):
    model = apps.get_model('rsr', 'Transaction')
    inlines = (TransactionSectorInline, )
    fieldsets = (
        (None, {
            'fields': ('reference', 'transaction_type', 'value', 'transaction_date', 'description')
        }),
        ('IATI fields (advanced)', {
            'classes': ('collapse',),
            'fields': ('currency', 'value_date', 'provider_organisation',
                       'provider_organisation_activity', 'receiver_organisation',
                       'receiver_organisation_activity', 'aid_type', 'disbursement_channel',
                       'finance_type', 'flow_type', 'tied_status', 'recipient_country',
                       'recipient_region', 'recipient_region_vocabulary')
        }),
    )

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.transactions.count() == 0 else 0
        else:
            return 1


class LegacyDataInline(NestedTabularInline):
    model = apps.get_model('rsr', 'LegacyData')
    extra = 0
    fieldsets = (
        ('Legacy Data', {
            'classes': ('collapse',),
            'fields': ('name', 'value', 'iati_equivalent')
        }),
    )


class RelatedProjectInline(NestedStackedInline):
    model = apps.get_model('rsr', 'RelatedProject')
    fields = ('related_project', 'related_iati_id', 'relation')
    fk_name = 'project'

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.related_projects.count() == 0 else 0
        else:
            return 1


class ProjectAdmin(TimestampsAdminDisplayMixin, ObjectPermissionsModelAdmin, NestedModelAdmin):
    model = apps.get_model('rsr', 'project')
    inlines = (
        RelatedProjectInline, ProjectContactInline, PartnershipInline, ProjectDocumentInline,
        ProjectLocationInline, SectorInline, BudgetItemAdminInLine, TransactionInline,
        ResultInline, LinkInline, ProjectConditionInline, CountryBudgetInline,
        PlannedDisbursementInline, PolicyMarkerInline, RecipientCountryInline,
        RecipientRegionInline, LegacyDataInline,
    )
    save_as = True

    fieldsets = (
        (_(u'General Information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'This section should contain the top-level information about your project which will be publicly '
                u'available and used within searches. Try to keep your Title and Subtitle short and snappy.'
            ),
            'fields': ('title', 'subtitle', 'iati_activity_id', 'iati_status', 'date_start_planned',
                       'date_start_actual', 'date_end_planned', 'date_end_actual', 'language',
                       'currency', 'donate_url', 'hierarchy', 'is_public', 'validations'),
        }),
        (_(u'IATI defaults'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Optionally, you can add default information based on the IATI standard.'
            ),
            'fields': ('default_aid_type', 'default_flow_type', 'default_tied_status',
                       'collaboration_type', 'default_finance_type', 'country_budget_vocabulary'),
        }),
        (_(u'Contact Information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'This section should contain the contact information of your project which will be publicly available.'
                u' Try to fill in at least a contact person and email.'
            ),
            'fields': (),
        }),
        (_(u'Project Partners'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Add each of the partners you are working with on your project. These organisations must be existing '
                u'already in Akvo RSR. If you are working with a Partner that does not exist in the system, please '
                u'send the details of the organisation including Name, Address, Logo, Contact Person and Website to '
                u'<a href="mailto:support@akvo.org" target="_blank">support@akvo.org</a>.'
            ),
            'fields': (),
        }),
        (_(u'Project Information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Here you can complete the in-depth descriptive details regarding your project, its history and plans '
                u'for the future. Both The Project Plan and Sustainability fields are unlimited, so you can add '
                u'additional details to your project there.'
            ),
            'fields': ('project_plan_summary', 'background', 'current_status', 'project_plan',
                       'target_group', 'sustainability', 'goals_overview'),
        }),
        (_(u'Project Photo'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Adding a photo to your project is important to be able to correctly visualise the project on the web.'
                u' Please upload an image that represents the project clearly. Ensure that you have the user rights and'
                u' permissions to be able to use this image publicly before uploading.'
            ),
            'fields': ('current_image', 'current_image_caption', 'current_image_credit'),
        }),
        (_(u'Project Documents'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'You can add any additional supporting documents to your project here. This could be in the form of '
                u'annual reports, baseline surveys, contextual information or any other report or summary that can '
                u'help users understand more about the projects activities.'
            ),
            'fields': (),
        }),
        (_(u'Project Scope'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'The scope of the project refers to the geographical area that the project is active within.<br><br>'
                u'Also add the physical locations where the project is being carried out. These will appear on '
                u'the map on your project page. Use the link to <a href="http://www.latlong.net/" target="_blank">'
                u'http://www.latlong.net/</a> to obtain the coordinates for your locations, as these are the items '
                u'that ensure the pin is in the correct place.'
            ),
            'fields': ('project_scope', ),
        }),
        (_(u'Project Focus'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'The project focus aims to define the broad areas of the project activities. This ensures that the '
                u'project can be collectively grouped with other similar projects to help make the most out of the '
                u'project resources.<br><br>'
                u'Enter the sector code of the sectors that the project is working within. See these lists for the '
                u'DAC-5 and DAC-3 sector codes:<br>'
                u'- <a href="http://iatistandard.org/201/codelists/Sector/" target="_blank">DAC-5 sector codes</a><br>'
                u'- <a href="http://iatistandard.org/201/codelists/SectorCategory/" target="_blank">DAC-3 sector '
                u'codes</a>'
            ),
            'fields': (),
        }),
        (_(u'Project Financials - Budgets'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'You can define the budget information as a total for the whole project or within sections and '
                u'periods to provide more granular information about where the project funds are being spent.'
            ),
            'fields': ('capital_spend_percentage', 'donations', ),
        }),
        (_(u'Project Financials - Transactions'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Transactions refer to the actual transfers of funds between organisations related to the funding '
                u'and expenditure of the project. This information is crucially important when defining the funding '
                u'chain within the development aid sector and can help to shape the overall picture. Providing this '
                u'information can also be beneficial to give clarity on expenditure over periods of time which is '
                u'reflected within the results obtained for the project.'
            ),
            'fields': (),
        }),
        (_(u'Results'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Here you can record the projected and achieved results for your project. Results are ordered within'
                u' a hierarchy that helps to provide a structure under which to report your results. At the top level '
                u'of the results are your project goals. These should be the high level aims of the project and need '
                u'not be something that can be directly counted, but should provide context.<br><br>'
                u'Within each goal an indicator can be defined. Indicators should be items that can be counted and '
                u'evaluated as the project continues and is completed. Each indicator can be given one or more periods '
                u'of achievement. These periods should cover the dates from which the indicator is evaluated.<br><br>'
                u'<strong>Important note:</strong> If a result does not display an indicator or indicator period, '
                u'please save the project first. After saving the project, the indicator (period) will be shown.'
            ),
            'fields': (),
        }),
        (_(u'Additional Information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'You can add links to your project such as Organisation Websites or Akvopedia articles containing '
                u'relevant information to improve the information available to viewers of your project. You can also '
                u'make notes on the project. These notes are only visible within this Admin so can be used to identify '
                u'missing information, specific contact details or status changes that you do not want to be visible '
                u'on your project page.'
            ),
            'fields': ('notes',),
        }),
        (_(u'Additional IATI Information'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Optionally, you can add additional information based on the IATI standard.'
            ),
            'fields': (),
        }),
        (_(u'Keywords'), {
            'description': u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                u'Add keywords belonging to your project. These keywords must be existing already in Akvo RSR. If '
                u'you want to use a keyword that does not exist in the system, please contact '
                u'<a href="mailto:support@akvo.org" target="_blank">support@akvo.org</a>.'
            ),
            'fields': ('keywords',),
        }),
    )
    filter_horizontal = ('keywords',)
    list_display = ('title', 'status', 'project_plan_summary', 'last_update',
                    'show_current_image', 'is_published', 'show_keywords')
    search_fields = ('title', 'subtitle', 'project_plan_summary', 'iati_activity_id',)
    list_filter = ('currency', 'status', 'keywords',)
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('budget', 'funds', 'funds_needed', 'created_at', 'last_modified_at',
                       'last_update')

    actions = [set_project_status_complete]

    def __init__(self, model, admin_site):
        """To support ImageField override to add self.formfield_overrides."""
        self.formfield_overrides = {ImageField: {'widget': widgets.AdminFileWidget}, }
        super(ProjectAdmin, self).__init__(model, admin_site)

    def get_limited_queryset(self, request):
        """Queryset filtered on connected organisation and only for Admin and Project Editors."""
        from .models import Project
        qs = Project.objects.none()
        for employment in request.user.employers.approved():
            if employment.group in Group.objects.filter(name__in=['Admins', 'Project Editors']):
                project_pks = [project.pk for project in employment.organisation.all_projects()]
                qs = qs | Project.objects.filter(pk__in=project_pks)
        return qs.distinct()

    def get_limited_queryset_slq_style(self, request):
        """Slower than the non sql alternative, might be able to make it fast somehow."""
        return super(ProjectAdmin, self).queryset(request).select_related(
            'publishingstatus__status'
        ).prefetch_related('keywords').filter(

            partnerships__organisation__employees__user__id=request.user.id
        ).filter(
            partnerships__organisation__employees__group__name__in=['Admins', 'Project Editors']
        )

    def get_queryset(self, request):
        """If superuser or admin return full queryset, otherwise return limited queryset."""
        if request.user.is_superuser or request.user.is_admin:
            queryset = super(ProjectAdmin, self).get_queryset(request)
            return queryset.select_related('publishingstatus').prefetch_related('keywords')
        return self.get_limited_queryset(request)

    @csrf_protect_m
    @transaction.atomic
    def add_view(self, request, form_url='', extra_context=None):
        "The 'add' admin view for this model."
        model = self.model
        opts = model._meta

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
            for FormSet, inline in self.get_formsets_with_inlines(request):
                prefix = FormSet.get_default_prefix()
                # check if we're trying to create a new project by copying an existing one. If so
                # we ignore location and benchmark inlines
                if "_saveasnew" not in request.POST or prefix not in ['benchmarks', 'rsr-location-content_type-object_id']:
                    # end of add although the following block is indented as a result
                    prefixes[prefix] = prefixes.get(prefix, 0) + 1
                    if prefixes[prefix] != 1 or not prefix:
                        prefix = "%s-%s" % (prefix, prefixes[prefix])
                    formset = FormSet(data=request.POST, files=request.FILES,
                                      instance=new_object,
                                      save_as_new="_saveasnew" in request.POST,
                                      prefix=prefix, queryset=inline.get_queryset(request))
                    formsets.append(formset)
            if self.all_valid_with_nesting(formsets) and form_validated:
                self.save_model(request, new_object, form, False)
                self.save_related(request, form, formsets, False)
                message = self.construct_change_message(
                    request, form, formsets, add=True
                )
                self.log_addition(request, new_object, message)
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
            for FormSet, inline in self.get_formsets_with_inlines(request):
                prefix = FormSet.get_default_prefix()
                prefixes[prefix] = prefixes.get(prefix, 0) + 1
                if prefixes[prefix] != 1 or not prefix:
                    prefix = "%s-%s" % (prefix, prefixes[prefix])

                # hack by GvH to get user's organisation preset as partner when adding a new
                # project
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
            inline_admin_formset = helpers.InlineAdminFormSet(
                inline, formset, fieldsets, prepopulated, readonly, model_admin=self
            )
            inline_admin_formsets.append(inline_admin_formset)
            media = media + inline_admin_formset.media

        context = {
            'title': _('Add %s') % force_text(opts.verbose_name),
            'adminform': adminForm,
            'is_popup': IS_POPUP_VAR in request.POST,
            'show_delete': False,
            'media': media,
            'inline_admin_formsets': inline_admin_formsets,
            'errors': helpers.AdminErrorList(form, formsets),
            'app_label': opts.app_label,
            'preserved_filters': self.get_preserved_filters(request),
        }
        context.update(extra_context or {})
        return self.render_change_form(request, context, form_url=form_url, add=True)

admin.site.register(apps.get_model('rsr', 'project'), ProjectAdmin)


class ApiKeyInline(admin.StackedInline):
    model = apps.get_model('tastypie', 'apikey')
    fields = ('key',)
    readonly_fields = ('key',)

    def has_delete_permission(self, request, obj=None, **kwargs):
        return False


class UserCreationForm(DjangoUserCreationForm):

    username = forms.RegexField(
        label=_("Username"), max_length=254,
        regex=r'^[\w.@+-]+$',
        help_text=_("Required. 254 characters or fewer. Letters, digits and "
                    "@/./+/-/_ only."),
        error_messages={
            'invalid': _("This value may contain only letters, numbers and "
                         "@/./+/-/_ characters.")})


class UserChangeForm(DjangoUserChangeForm):

    username = forms.RegexField(
        label=_("Username"), max_length=254, regex=r"^[\w.@+-]+$",
        help_text=_("Required. 254 characters or fewer. Letters, digits and "
                    "@/./+/-/_ only."),
        error_messages={
            'invalid': _("This value may contain only letters, numbers and "
                         "@/./+/-/_ characters.")})


class UserAdmin(DjangoUserAdmin):
    model = apps.get_model('rsr', 'user')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_admin', 'is_support', 'is_superuser')
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    inlines = (
        ApiKeyInline,
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')}),
    )
    list_display = (
        'username', 'email', 'get_organisation_names', 'get_full_name', 'get_is_active',
        'get_is_admin', 'get_is_support', 'latest_update_date'
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

    form = UserChangeForm
    add_form = UserCreationForm

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return ['last_login', 'date_joined']
        else:
            return ['is_admin', 'is_support', 'is_superuser', 'last_login', 'date_joined']

    def get_queryset(self, request):
        # Superusers or RSR Admins can see all users
        if request.user.is_superuser or request.user.is_admin:
            return super(UserAdmin, self).get_queryset(request)

        else:
            # Retrieve the organisations of which the user is an approved Admin or User manager
            user_manager_groups = Group.objects.filter(name__in=['Admins', 'User Managers'])
            managing_orgs = request.user.organisations.filter(
                employees__user__pk=request.user.pk,
                employees__is_approved=True,
                employees__group__in=user_manager_groups
            )
            if managing_orgs:
                # Return all users of the organisations that the user manages
                return managing_orgs.users()
            else:
                # User doesn't manage any organisation, only return the user itself
                return get_user_model().objects.filter(pk=request.user.pk)

admin.site.register(get_user_model(), UserAdmin)


class NarrativeReportAdmin(admin.ModelAdmin):
    list_display = (u'project', u'category', u'published',)

admin.site.register(apps.get_model('rsr', 'narrativereport'), NarrativeReportAdmin)


class ProjectCommentAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'comment', 'created_at', )
    list_filter = ('project', 'created_at', )
    search_fields = ('project__id', 'project__title', 'user__first_name', 'user__last_name',)
    readonly_fields = ('created_at', 'last_modified_at')

admin.site.register(apps.get_model('rsr', 'projectcomment'), ProjectCommentAdmin)


class ProjectUpdateLocationInline(admin.StackedInline):
    model = apps.get_model('rsr', 'projectupdatelocation')
    extra = 0
    fields = ('latitude', 'longitude', 'city', 'state', 'address_1', 'address_2', 'postcode')


class ProjectUpdateAdmin(TimestampsAdminDisplayMixin, AdminVideoMixin, admin.ModelAdmin):

    list_display = ('title', 'project', 'user', 'text', 'language', 'event_date', 'created_at', 'img',)
    list_filter = ('created_at', 'project', )
    search_fields = ('project__id', 'project__title', 'user__first_name', 'user__last_name',)
    inlines = (ProjectUpdateLocationInline,)
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('created_at', 'last_modified_at')

    fieldsets = (
        (_(u'General Information'), {
            'fields': ('project', 'user', 'update_method', 'created_at', 'last_modified_at'),
        }),
        (_(u'Content'), {
            'fields': ('title', 'text', 'language', 'event_date', ),
        }),
        (_(u'Image and video'), {
            'fields': ('photo', 'photo_caption', 'photo_credit', 'video', 'video_caption',
                       'video_credit',),
        }),
    )
    # Methods overridden from ModelAdmin (django/contrib/admin/options.py)

    def __init__(self, model, admin_site):
        """Override to add self.formfield_overrides.

        Needed to get the ImageField working in the admin.
        """
        self.formfield_overrides = {ImageField: {'widget': widgets.AdminFileWidget}, }
        super(ProjectUpdateAdmin, self).__init__(model, admin_site)


admin.site.register(apps.get_model('rsr', 'projectupdate'), ProjectUpdateAdmin)


class PartnerSiteAdmin(TimestampsAdminDisplayMixin, admin.ModelAdmin):

    """Defines the RSR Pages admin."""

    fieldsets = (
        (u'General', dict(fields=('organisation', 'enabled',))),
        (_(u'Project selection'), {
            'description': u'{}'.format(
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'Select the projects to be shown on your Site.'
                u'</p>'
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'The default setting selects all projects associated with the organisation of '
                u'the Site.</p>'
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'De-selecting the "Show only projects of partner" check-box shows all projects '
                u'in RSR. This is meant to be used with the keywords below, '
                u'thus selecting only projects associated with the selected keywords. '
                u'<br/>If keywords are added to a Site showing only projects of a partner, '
                u'the selection will be further filtered by only showing associated projects '
                u'with those keywords.</p>'
                u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                u'When "Exclude projects with selected keyword is checked" '
                u'projects with the chosen keywords are instead excluded from the list.'
                u'</p>'
            ),
            'fields': ('partner_projects', 'exclude_keywords', 'keywords'),
        }),
        (u'HTTP', dict(fields=('hostname', ('cname', 'redirect_cname'), 'custom_return_url',
                               'custom_return_url_text', 'piwik_id',))),
        (u'Style and content',
            dict(fields=('all_maps', 'custom_css', 'custom_logo',
                         'custom_favicon', 'show_keyword_logos',))),
        (u'Languages and translation', dict(fields=('google_translation',))),
        (u'Social', dict(fields=('twitter_button', 'facebook_button', 'facebook_app_id',))),
    )

    # exclude deprecated fields
    exclude = ('about_box', 'about_image')
    filter_horizontal = ('keywords',)
    list_display = ('__unicode__', 'full_domain', 'enabled', 'show_keywords')
    list_filter = ('enabled', 'keywords')
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('created_at', 'last_modified_at',)

    def get_fieldsets(self, request, obj=None):
        """Don't show the notes field unless you are superuser or admin.

        # note that this is somewhat fragile as it relies on adding/removing from the _first_
        # fieldset
        """
        if request.user.is_superuser or request.user.is_admin:
            self.fieldsets[0][1]['fields'] = ('organisation', 'enabled', 'notes',)
        else:
            self.fieldsets[0][1]['fields'] = ('organisation', 'enabled',)
        return super(PartnerSiteAdmin, self).get_fieldsets(request, obj)

    def get_form(self, request, obj=None, **kwargs):
        """Workaround bug http://code.djangoproject.com/ticket/9360."""
        return super(PartnerSiteAdmin, self).get_form(
            request, obj, fields=flatten_fieldsets(self.get_fieldsets(request, obj))
        )

    def get_list_display(self, request):
        """"See the notes fields in the change list if you are superuser or admin."""
        if request.user.is_superuser or request.user.is_admin:
            return list(self.list_display) + ['notes']
        return super(PartnerSiteAdmin, self).get_list_display(request)

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(PartnerSiteAdmin, self).get_queryset(
                request).select_related('organisation')

        from .models import PartnerSite
        qs = PartnerSite.objects.none()
        for employment in request.user.employers.approved():
            if employment.group in Group.objects.filter(name='Admins'):
                ps_pks = (ps.pk for ps in employment.organisation.partnersites())
                qs = qs | PartnerSite.objects.filter(pk__in=ps_pks)
        return qs.distinct()

admin.site.register(apps.get_model('rsr', 'partnersite'), PartnerSiteAdmin)


class KeywordAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'Keyword')
    list_display = ('label', 'logo')

admin.site.register(apps.get_model('rsr', 'Keyword'), KeywordAdmin)


class EmploymentAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'Employment')
    list_display = ('__unicode__', 'user', 'organisation', 'group', 'is_approved',
                    'iati_country', 'job_title')
    list_filter = ('is_approved', 'organisation')
    search_fields = ('organisation__name', 'organisation__long_name', 'user__username')

    def get_queryset(self, request):
        if request.user.is_superuser or request.user.is_admin:
            return super(EmploymentAdmin, self).get_queryset(request)

        from .models import Employment
        qs = Employment.objects.none()
        for employment in request.user.employers.approved():
            if employment.group in Group.objects.filter(name__in=['Admins', 'User Managers']):
                qs = qs | employment.organisation.employees.all()
        return qs

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        # Make sure that non-Admins only see the organisations and users that they're allowed to
        if db_field.name == 'organisation' and not request.user.is_admin:
            kwargs['queryset'] = request.user.employers.approved().organisations()
        elif db_field.name == 'user' and not request.user.is_admin:
            kwargs['queryset'] = request.user.employers.approved().organisations().users()
        return super(EmploymentAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(apps.get_model('rsr', 'Employment'), EmploymentAdmin)


class IatiImportLogAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IatiImportLog')
    list_display = ('iati_import_job', 'project', 'message_type', 'tag', 'model_field',
                    'iati_activity_import', 'text', 'created_at',)
    list_display = ('iati_import_job', 'message_type', 'tag', 'model_field', 'iati_activity_import', 'text', 'created_at',)

    def get_queryset(self, request):
        "Optimize the list display"
        qs = super(IatiImportLogAdmin, self).get_queryset(request)
        qs = qs.select_related('project', 'iati_activity_import', 'iati_import_job')
        return qs

admin.site.register(apps.get_model('rsr', 'IatiImportLog'), IatiImportLogAdmin)


class IatiImportLogInline(admin.TabularInline):
    model = apps.get_model('rsr', 'IatiImportLog')
    fk_name = 'iati_import_job'
    fields = ('iati_import_job_admin_url', 'project', 'activity_admin_url', 'message_type', 'tag',
              'model_field', 'text', 'created_at',)
    readonly_fields = ('iati_import_job_admin_url', 'project', 'activity_admin_url', 'message_type',
                       'tag', 'model_field', 'text', 'created_at',)
    extra = 0

    def get_queryset(self, request):
        "Optimize the list display"
        qs = super(IatiImportLogInline, self).get_queryset(request)
        qs = qs.select_related('project', 'iati_activity_import', 'iati_import_job')
        return qs


class IatiImportJobAdmin(admin.ModelAdmin):
    """
    NOTE: This form allows the addition of an IATI XML file by direct uploading. However running the
    import is still managed by the the cron job in combination with the iati_import management
    command.
    """
    model = apps.get_model('rsr', 'IatiImportJob')
    inlines = (IatiImportLogInline,)
    readonly_fields = ('status', 'sha1_hexdigest',)
    list_display = ('__unicode__', 'status',)

    def save_model(self, request, iati_import_job, form, change):
        iati_import_job.save()
        if iati_import_job.iati_xml_file:
            iati_import_job.iati_import.run_immediately = True

admin.site.register(apps.get_model('rsr', 'IatiImportJob'), IatiImportJobAdmin)


class IatiImportJobInline(admin.TabularInline):
    model = apps.get_model('rsr', 'IatiImportJob')
    # fk_name = 'iati_import'
    fields = ('admin_url', 'status', 'iati_xml_file', 'sha1_hexdigest',)
    readonly_fields = ('admin_url', 'status', 'sha1_hexdigest',)
    extra = 0


class IatiImportAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IatiImport')
    list_display = ('__unicode__', 'user', 'next_execution', 'enabled', 'running',)
    readonly_fields = ('next_execution', 'running',)
    inlines = (IatiImportJobInline,)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """ set the current user as selected """
        if db_field.name == 'user':
            kwargs['initial'] = request.user.pk
        return super(IatiImportAdmin, self).formfield_for_foreignkey(
            db_field, request, **kwargs
        )

admin.site.register(apps.get_model('rsr', 'IatiImport'), IatiImportAdmin)


class IatiImportLogActivityInline(IatiImportLogInline):
    fk_name = 'iati_activity_import'


class IatiActivityImportAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IatiActivityImport')
    inlines = (IatiImportLogActivityInline,)

admin.site.register(apps.get_model('rsr', 'IatiActivityImport'), IatiActivityImportAdmin)


class IatiActivityExportInline(admin.TabularInline):
    model = apps.get_model('rsr', 'IatiActivityExport')
    fk_name = 'iati_export'
    fields = ('project', 'status', 'created_at')
    readonly_fields = ('project', 'status', 'created_at')
    extra = 0


class IatiExportAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IatiExport')
    list_display = ('__unicode__', 'reporting_organisation', 'user', 'version', 'iati_file',
                    'show_status', 'is_public')
    exclude = ('projects', )
    inlines = (IatiActivityExportInline, )

admin.site.register(apps.get_model('rsr', 'IatiExport'), IatiExportAdmin)


class ValidationInline(admin.TabularInline):
    model = apps.get_model('rsr', 'ProjectEditorValidation')
    fields = ('validation', 'action', )
    ordering = ('validation',)

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.validations.count() == 0 else 0
        else:
            return 1


class ValidationSetAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'ProjectEditorValidationSet')
    list_display = ('name', 'description')
    fields = ('name', 'description')
    inlines = (ValidationInline, )

admin.site.register(apps.get_model('rsr', 'ProjectEditorValidationSet'), ValidationSetAdmin)


class IndicatorPeriodDataCommentInline(admin.TabularInline):
    model = apps.get_model('rsr', 'IndicatorPeriodDataComment')

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 1 if obj.comments.count() == 0 else 0
        else:
            return 1


class IndicatorPeriodDataAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IndicatorPeriodData')
    list_display = ('period', 'user', 'value', 'status')
    readonly_fields = ('created_at', 'last_modified_at')
    inlines = (IndicatorPeriodDataCommentInline, )

admin.site.register(apps.get_model('rsr', 'IndicatorPeriodData'), IndicatorPeriodDataAdmin)


class ReportAdminForm(forms.ModelForm):
    class Meta:
        model = apps.get_model('rsr', 'Report')
        widgets = {
            'url': forms.Textarea(attrs={'rows': 2, 'style': 'width: 80%'})
        }
        fields = ('name', 'title', 'description', 'url', 'formats', 'organisations')


class ReportAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'Report')
    form = ReportAdminForm
    save_as = True
    filter_horizontal = ('organisations',)

admin.site.register(apps.get_model('rsr', 'Report'), ReportAdmin)


class ReportFormatAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'ReportFormat')

admin.site.register(apps.get_model('rsr', 'Reportformat'), ReportFormatAdmin)


UserProjects = apps.get_model('rsr', 'UserProjects')


class UserProjectsAdmin(admin.ModelAdmin):
    model = UserProjects

admin.site.register(UserProjects, UserProjectsAdmin)
