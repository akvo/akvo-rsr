# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


from django import forms
from django.core.exceptions import FieldDoesNotExist
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
from django.db.models import JSONField
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_protect
from django.utils.encoding import force_str

from prettyjson import PrettyJSONWidget
from sorl.thumbnail.fields import ImageField
from embed_video.admin import AdminVideoMixin

from akvo.rsr.mixins import TimestampsAdminDisplayMixin
from akvo.rsr.usecases.iati_validation import schedule_iati_organisation_validation
from akvo.utils import custom_get_or_create_country

from rules.contrib.admin import ObjectPermissionsModelAdmin
from nested_inline.admin import NestedModelAdmin, NestedStackedInline, NestedTabularInline

NON_FIELD_ERRORS = '__all__'
csrf_protect_m = method_decorator(csrf_protect)


class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'iso_code', 'continent', 'continent_code', )
    list_filter = ('continent', )
    readonly_fields = ('name', 'continent', 'continent_code')

    def save_model(self, request, obj, form, change):
        if obj.iso_code:
            custom_get_or_create_country(obj.iso_code, obj)

    def get_readonly_fields(self, request, obj=None):
        return 'name', 'continent', 'continent_code'


class OrganisationLocationInline(NestedStackedInline):
    model = apps.get_model('rsr', 'organisationlocation')
    fields = ('latitude', 'longitude', 'city', 'state', 'address_1', 'address_2', 'postcode',
              'iati_country')
    fk_name = 'location_target'

    def get_extra(self, request, obj=None, **kwargs):
        if obj and obj.pk:
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
        if obj and obj.pk:
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
        if obj and obj.pk:
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
        if obj and obj.pk:
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
        if obj and obj.pk:
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
        if obj and obj.pk:
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
        if obj and obj.pk:
            return 1 if obj.documents.count() == 0 else 0
        else:
            return 1


class OrganisationCustomFieldInline(NestedTabularInline):
    model = apps.get_model('rsr', 'organisationcustomfield')
    fields = ('name', 'type', 'section', 'order', 'max_characters', 'mandatory', 'help_text',
              'dropdown_options', 'show_in_searchbar')
    fk_name = 'organisation'
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget}
    }

    def get_extra(self, request, obj=None, **kwargs):
        if obj and obj.pk:
            return 1 if obj.custom_fields.count() == 0 else 0
        else:
            return 1


class OrganisationIndicatorLabelInline(NestedTabularInline):
    model = apps.get_model('rsr', 'OrganisationIndicatorLabel')
    fields = ('label',)
    fk_name = 'organisation'

    def get_extra(self, request, obj=None, **kwargs):
        if obj and obj.pk:
            return 1 if obj.indicator_labels.count() == 0 else 0
        else:
            return 1


class InternalOrganisationIDAdmin(admin.ModelAdmin):
    list_display = ('identifier', 'recording_org', 'referenced_org',)
    search_fields = ('identifier', 'recording_org__name', 'referenced_org__name',)


admin.site.register(apps.get_model('rsr', 'internalorganisationid'), InternalOrganisationIDAdmin)


class OrganisationAdminForm(forms.ModelForm):
    def clean_iati_org_id(self):
        return self.cleaned_data['iati_org_id'] or None


class OrganisationAdmin(TimestampsAdminDisplayMixin, ObjectPermissionsModelAdmin, NestedModelAdmin):

    """OrganisationAdmin.

    NOTE: The change_form.html template relies on the fieldsets to put the inline forms correctly.
    If the fieldsets are changed, the template may need fixing too
    """

    fieldsets = (
        (_('General information'),
            {'fields': ('name', 'long_name', 'iati_org_id', 'description', 'new_organisation_type',
                        'logo', 'language', 'currency', 'iati_prefixes', 'password_policy',
                        'enforce_2fa')}),
        (_('Contact information'),
            {'fields': ('url', 'facebook', 'twitter', 'linkedin', 'phone', 'mobile', 'fax',
                        'contact_person', 'contact_email', )}),
        (_('Organisation settings'),
            {'fields': ('can_create_projects', 'enforce_program_projects',
                        'public_iati_file', 'content_owner', 'codelist')}),
        (_('Notes'), {'fields': ('notes', )}),
    )
    form = OrganisationAdminForm
    inlines = (OrganisationLocationInline, OrganisationTotalBudgetInline,
               OrganisationRecipientOrgBudgetInline, OrganisationRegionBudgetInline,
               OrganisationCountryBudgetInline, OrganisationTotalExpenditureInline,
               OrganisationDocumentInline, OrganisationCustomFieldInline,
               OrganisationIndicatorLabelInline)
    exclude = ('internal_org_ids',)
    list_display = ('name', 'long_name', 'website', 'language')
    search_fields = ('name', 'long_name')

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
            if org is not None and org.content_owner is not None:
                readonly_fields.append('enforce_program_projects')

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

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        schedule_iati_organisation_validation(obj)

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
                except FieldDoesNotExist:
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
            'title': _('Add %s') % force_str(opts.verbose_name),
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
    list_display = ('organisation', 'account_level', )


admin.site.register(apps.get_model('rsr', 'organisationaccount'), OrganisationAccountAdmin)


class BudgetItemLabelAdmin(admin.ModelAdmin):
    list_display = ('label',)


admin.site.register(apps.get_model('rsr', 'budgetitemlabel'), BudgetItemLabelAdmin)


class IndicatorCustomFieldInline(NestedTabularInline):
    model = apps.get_model('rsr', 'indicatorcustomfield')
    fields = ('name', 'type', 'order', 'mandatory', 'dropdown_options')
    fk_name = 'project'
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget}
    }

    def get_extra(self, request, obj=None, **kwargs):
        return 1


class ProjectAdmin(TimestampsAdminDisplayMixin, ObjectPermissionsModelAdmin, NestedModelAdmin):
    model = apps.get_model('rsr', 'project')
    inlines = (
        IndicatorCustomFieldInline,
    )
    fieldsets = (
        (_('General Information'), {
            'description': '<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
                'This section should contain the top-level information about your project which will be publicly '
                'available and used within searches. Try to keep your Title and Subtitle short and snappy.'
            ),
            'fields': ('title', 'subtitle', 'iati_activity_id', 'iati_status', 'currency', 'is_public'),
        }),
    )
    filter_horizontal = ('keywords',)
    list_display = ('id', 'title', 'status', 'is_published', 'show_keywords')
    search_fields = ('id', 'title', 'subtitle')
    list_filter = ('currency', 'status', 'keywords',)
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('title', 'subtitle', 'iati_activity_id', 'iati_status', 'currency', 'is_public', 'created_at', 'last_modified_at',)

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
            'fields': ('is_active', 'is_staff', 'is_admin', 'is_support', 'is_superuser', 'enforce_2fa')
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
        'username', 'email', 'get_organisation_names', 'get_full_name', 'is_active',
        'is_admin', 'is_support', 'latest_update_date'
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
    list_display = ('project', 'category', 'published',)

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(NarrativeReportAdmin, self).get_queryset(request)

        employments = request.user.approved_employments(['Admins', 'M&E Managers'])
        projects = employments.organisations().all_projects()
        return self.model.objects.filter(project__in=projects)


admin.site.register(apps.get_model('rsr', 'narrativereport'), NarrativeReportAdmin)


class ProjectUpdateLocationInline(admin.StackedInline):
    model = apps.get_model('rsr', 'projectupdatelocation')
    extra = 0
    fields = ('latitude', 'longitude', 'city', 'state', 'address_1', 'address_2', 'postcode')


class ProjectUpdateAdmin(TimestampsAdminDisplayMixin, AdminVideoMixin, admin.ModelAdmin):

    list_display = ('title', 'project', 'user', 'text', 'language', 'event_date', 'created_at', 'img',)
    list_filter = ('created_at', 'project', )
    search_fields = ('title', 'id', 'project__id', 'project__title', 'user__first_name', 'user__last_name',)
    inlines = (ProjectUpdateLocationInline,)
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('created_at', 'last_modified_at')

    fieldsets = (
        (_('General Information'), {
            'fields': ('project', 'user', 'update_method', 'created_at', 'last_modified_at'),
        }),
        (_('Content'), {
            'fields': ('title', 'text', 'language', 'event_date', ),
        }),
        (_('Image and video'), {
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

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(ProjectUpdateAdmin, self).get_queryset(request)
        return self.model.objects.none()


admin.site.register(apps.get_model('rsr', 'projectupdate'), ProjectUpdateAdmin)


class ProgramAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'ProjectHierarchy')
    list_display = ('root_project', 'organisation', 'is_master', 'max_depth')


admin.site.register(apps.get_model('rsr', 'ProjectHierarchy'), ProgramAdmin, name='Programs')


class PartnerSiteAdmin(TimestampsAdminDisplayMixin, admin.ModelAdmin):

    """Defines the RSR Pages admin."""

    fieldsets = (
        ('General', dict(fields=('organisation', 'tagline', 'enabled', 'password'))),
        ('Program selection', dict(fields=('program',))),
        (_('Project selection'), {
            'description': '{}'.format(
                '<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                'Select the projects to be shown on your Site.'
                '</p>'
                '<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                'The default setting selects all projects associated with the organisation of '
                'the Site.</p>'
                '<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                'De-selecting the "Show only projects of partner" check-box shows all projects '
                'in RSR. This is meant to be used with the keywords below, '
                'thus selecting only projects associated with the selected keywords. '
                '<br/>If keywords are added to a Site showing only projects of a partner, '
                'the selection will be further filtered by only showing associated projects '
                'with those keywords.</p>'
                '<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">'
                'When "Exclude projects with selected keyword is checked" '
                'projects with the chosen keywords are instead excluded from the list.'
                '</p>'
            ),
            'fields': ('partner_projects', 'exclude_keywords', 'keywords'),
        }),
        ('HTTP', dict(fields=('hostname', ('cname', 'redirect_cname'), 'custom_return_url',
                              'custom_return_url_text', 'piwik_id',))),
        ('Style and content',
            dict(fields=('all_maps', 'custom_css', 'custom_logo', 'custom_map_marker',
                         'custom_favicon', 'show_keyword_logos',))),
        ('Languages and translation', dict(fields=('google_translation',))),
        ('Social', dict(fields=('twitter_button', 'facebook_button', 'facebook_app_id',))),
    )

    # exclude deprecated fields
    exclude = ('about_box', 'about_image')
    filter_horizontal = ('keywords',)
    list_display = ('__str__', 'full_domain', 'enabled', 'show_keywords')
    list_filter = ('enabled', 'keywords')
    # created_at and last_modified_at MUST be readonly since they have the auto_now/_add attributes
    readonly_fields = ('created_at', 'last_modified_at',)

    def get_fieldsets(self, request, obj=None):
        """Don't show the notes field unless you are superuser or admin.

        # note that this is somewhat fragile as it relies on adding/removing from the _first_
        # fieldset
        """
        if request.user.is_superuser or request.user.is_admin:
            fields = self.fieldsets[0][1]['fields']
            self.fieldsets[0][1]['fields'] = fields + ('notes',) if 'notes' not in fields else fields
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
    list_display = ('__str__', 'user', 'organisation', 'group', 'is_approved',
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


class IatiActivityExportInline(admin.TabularInline):
    model = apps.get_model('rsr', 'IatiActivityExport')
    fk_name = 'iati_export'
    fields = ('project', 'status', 'created_at')
    readonly_fields = ('project', 'status', 'created_at')
    extra = 0


class IatiExportAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IatiExport')
    list_display = ('__str__', 'reporting_organisation', 'user', 'version', 'iati_file',
                    'show_status', 'latest')
    exclude = ('projects', )
    inlines = (IatiActivityExportInline, )

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(IatiExportAdmin, self).get_queryset(request)

        employments = request.user.approved_employments(['Admins', 'Project Editors'])
        return self.model.objects.filter(reporting_organisation_id__in=employments.organisations())


admin.site.register(apps.get_model('rsr', 'IatiExport'), IatiExportAdmin)


class ValidationSetAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'ProjectEditorValidationSet')
    list_display = ('name', 'description')
    fields = ('name', 'description')

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(ValidationSetAdmin, self).get_queryset(request)
        return self.model.objects.none()


admin.site.register(apps.get_model('rsr', 'ProjectEditorValidationSet'), ValidationSetAdmin)


class IndicatorPeriodDataCommentInline(admin.TabularInline):
    model = apps.get_model('rsr', 'IndicatorPeriodDataComment')

    def get_extra(self, request, obj=None, **kwargs):
        if obj and obj.pk:
            return 1 if obj.comments.count() == 0 else 0
        else:
            return 1


class IndicatorPeriodDataAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IndicatorPeriodData')
    list_display = ('period', 'user', 'value', 'status')
    readonly_fields = ('created_at', 'last_modified_at')
    inlines = (IndicatorPeriodDataCommentInline, )

    def get_queryset(self, request):
        if request.user.is_admin or request.user.is_superuser:
            return super(IndicatorPeriodDataAdmin, self).get_queryset(request)

        employments = request.user.approved_employments(['Admins', 'M&E Managers'])
        projects = employments.organisations().all_projects()
        return self.model.objects.filter(period__indicator__result__project__in=projects)


admin.site.register(apps.get_model('rsr', 'IndicatorPeriodData'), IndicatorPeriodDataAdmin)


class IndicatorPeriodAggregationJobAdmin(admin.ModelAdmin):
    model = apps.get_model('rsr', 'IndicatorPeriodAggregationJob')
    list_display = ('indicator_title', 'status', 'project_title', 'root_project_title', 'period', 'updated_at')
    list_filter = ('status', )
    search_fields = ('period__indicator__result__period__title', 'period__indicator__title')
    readonly_fields = ('updated_at', 'period', 'root_period', 'project_title', 'root_project_title', 'indicator_title')

    @admin.display(description='Project Title')
    def project_title(self, obj):
        return self.get_project(obj.period).title

    @admin.display(description='Root project Title')
    def root_project_title(self, obj):
        return self.get_project(obj.root_period).title

    def get_project(self, period):
        return period.indicator.result.project

    @admin.display(description='Indicator Title')
    def indicator_title(self, obj):
        return obj.period.indicator.title

    def get_queryset(self, request):
        queryset = super().get_queryset(request).select_related("period__indicator")
        if request.user.is_admin or request.user.is_superuser:
            return queryset

        employments = request.user.approved_employments(['Admins', 'M&E Managers'])
        projects = employments.organisations().all_projects()
        return self.model.objects.filter(period__indicator__result__project__in=projects)


admin.site.register(apps.get_model('rsr', 'IndicatorPeriodAggregationJob'), IndicatorPeriodAggregationJobAdmin)


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


class OrganisationCodeList(admin.ModelAdmin):
    list_display = ('slug',)
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget}
    }


admin.site.register(apps.get_model('rsr', 'organisationcodelist'), OrganisationCodeList)
