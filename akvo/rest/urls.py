# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import views

from django.conf.urls import patterns, url, include
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'administrative_location', views.AdministrativeLocationViewSet)
router.register(r'benchmark', views.BenchmarkViewSet)
router.register(r'benchmark_name', views.BenchmarknameViewSet)
router.register(r'budget_item', views.BudgetItemViewSet)
router.register(r'budget_item_label', views.BudgetItemLabelViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'country', views.CountryViewSet)
router.register(r'country_budget_item', views.CountryBudgetItemViewSet)
router.register(r'crs_add', views.CrsAddViewSet)
router.register(r'crs_add_other_flag', views.CrsAddOtherFlagViewSet)
router.register(r'employment', views.EmploymentViewSet)
router.register(r'focus_area', views.FocusAreaViewSet)
router.register(r'fss', views.FssViewSet)
router.register(r'fss_forecast', views.FssForecastViewSet)
router.register(r'goal', views.GoalViewSet)
router.register(r'humanitarian_scope', views.HumanitarianScopeViewSet)
router.register(r'iati_activity_export', views.IatiActivityExportViewSet)
router.register(r'iati_check', views.IatiCheckViewSet)
router.register(r'iati_export', views.IatiExportViewSet)
router.register(r'indicator', views.IndicatorViewSet)
router.register(r'indicator_dimension', views.IndicatorDimensionViewSet)
router.register(r'indicator_framework', views.IndicatorFrameworkViewSet)
router.register(r'indicator_label', views.IndicatorLabelViewSet)
router.register(r'indicator_period', views.IndicatorPeriodViewSet)
router.register(r'indicator_period_framework', views.IndicatorPeriodFrameworkViewSet)
router.register(r'indicator_period_actual_dimension', views.IndicatorPeriodActualDimensionViewSet)
router.register(r'indicator_period_actual_location', views.IndicatorPeriodActualLocationViewSet)
router.register(r'indicator_period_data', views.IndicatorPeriodDataViewSet)
router.register(r'indicator_period_data_framework', views.IndicatorPeriodDataFrameworkViewSet)
router.register(r'indicator_period_data_comment', views.IndicatorPeriodDataCommentViewSet)
router.register(r'disaggregation', views.DisaggregationViewSet)
router.register(r'indicator_period_target_dimension', views.IndicatorPeriodTargetDimensionViewSet)
router.register(r'indicator_period_target_location', views.IndicatorPeriodTargetLocationViewSet)
router.register(r'indicator_reference', views.IndicatorReferenceViewSet)
router.register(r'internal_organisation_id',
                views.InternalOrganisationIDViewSet)
router.register(r'keyword', views.KeywordViewSet)
router.register(r'legacy_data', views.LegacyDataViewSet)
router.register(r'link', views.LinkViewSet)
router.register(r'narrative_report', views.NarrativeReportViewSet)
router.register(r'organisation', views.OrganisationViewSet)
router.register(r'organisation_country_budget', views.OrganisationCountryBudgetViewSet)
router.register(r'organisation_country_budget_line', views.OrganisationCountryBudgetLineViewSet)
router.register(r'organisation_custom_field', views.OrganisationCustomFieldViewSet)
router.register(r'organisation_expense_line', views.OrganisationExpenseLineViewSet)
router.register(r'organisation_indicator_label', views.OrganisationIndicatorLabelViewSet)
router.register(r'organisation_location', views.OrganisationLocationViewSet)
router.register(r'organisation_map_location', views.MapOrganisationLocationViewSet)
router.register(r'organisation_region_budget', views.OrganisationRegionBudgetViewSet)
router.register(r'organisation_region_budget_line', views.OrganisationRegionBudgetLineViewSet)
router.register(r'organisation_total_budget', views.OrganisationTotalBudgetViewSet)
router.register(r'organisation_total_budget_line', views.OrganisationTotalBudgetLineViewSet)
router.register(r'organisation_total_expenditure', views.OrganisationTotalExpenditureViewSet)
router.register(r'partner_site', views.PartnerSiteViewSet)
router.register(r'partnership', views.PartnershipViewSet)
router.register(r'partnership_more_link', views.PartnershipMoreLinkViewSet)
router.register(r'planned_disbursement', views.PlannedDisbursementViewSet)
router.register(r'policy_marker', views.PolicyMarkerViewSet)
router.register(r'project', views.ProjectViewSet)
router.register(r'project_iati_export', views.ProjectIatiExportViewSet,
                base_name='project_iati_export')
router.register(r'project_extra', views.ProjectExtraViewSet,
                base_name='project_extra')
router.register(r'project_extra_deep', views.ProjectExtraDeepViewSet,
                base_name='project_extra_deep')
router.register(r'project_up', views.ProjectUpViewSet,
                base_name='project_up')
router.register(r'project_comment', views.ProjectCommentViewSet)
router.register(r'project_condition', views.ProjectConditionViewSet)
router.register(r'project_contact', views.ProjectContactViewSet)
router.register(r'project_custom_field', views.ProjectCustomFieldViewSet)
router.register(r'project_document', views.ProjectDocumentViewSet)
router.register(r'project_document_category', views.ProjectDocumentCategoryViewSet)
router.register(r'project_location', views.ProjectLocationViewSet)
router.register(r'project_map_location', views.MapProjectLocationViewSet)

router.register(r'project_update_extra', views.ProjectUpdateExtraViewSet,
                base_name='project_update_extra')
router.register(r'project_update', views.ProjectUpdateViewSet,
                base_name='project_update')
router.register(r'project_update_location', views.ProjectUpdateLocationViewSet)
router.register(r'project_update_map_location', views.MapProjectUpdateLocationViewSet)

router.register(r'publishing_status', views.PublishingStatusViewSet)
router.register(r'recipient_country', views.RecipientCountryViewSet)
router.register(r'recipient_organisation_budget', views.OrganisationRecipientOrgBudgetViewSet)
router.register(r'recipient_organisation_budget_line',
                views.OrganisationRecipientOrgBudgetLineViewSet)
router.register(r'recipient_region', views.RecipientRegionViewSet)
router.register(r'related_project', views.RelatedProjectViewSet)
router.register(r'result', views.ResultsViewSet)
router.register(r'results_framework', views.ResultsFrameworkViewSet)
router.register(r'sector', views.SectorViewSet)
router.register(r'transaction', views.TransactionViewSet)
router.register(r'transaction_sector', views.TransactionSectorViewSet)
router.register(r'user', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include URLs for non-viewsets (functional views).

urlpatterns = patterns(
    '',
    url(r'^', include(router.urls)),
    url(r'^employment/(?P<pk>[0-9]+)/approve/$',
        views.approve_employment,
        name='approve_employment'),
    url(r'^employment/(?P<pk>[0-9]+)/set_group/(?P<group_id>[0-9]+)/$',
        views.set_group,
        name='set_group'),
    url(r'^user/(?P<pk>[0-9]+)/change_password/$',
        views.change_password,
        name='user_change_password'),
    url(r'^user/(?P<pk>[0-9]+)/update_details/$',
        views.update_details,
        name='user_update_details'),
    url(r'^user/(?P<pk>[0-9]+)/request_organisation/$',
        views.request_organisation,
        name='user_request_organisation'),
    url(r'^invite_user/$',
        views.invite_user,
        name='invite_user'),
    url(r'^project_iati_check/(?P<pk>[0-9]+)/$',
        views.ProjectIatiCheckView.as_view(),
        name='project_iati_check'),
    url(r'^indicator_period_data/(?P<pk>[0-9]+)/upload_file/$',
        views.indicator_upload_file,
        name='indicator_upload_file'),
    url(r'^right_now_in_akvo/$', views.right_now_in_akvo_view, name='right_now_in_akvo'),
    url(r'^server_info/$', views.server_info, name='server_info'),
)

# Project editor
urlpatterns += patterns(
    '',
    url(r'^project/(?P<pk>[0-9]+)/project_editor/$',
        views.project_editor,
        name='project_editor_api'),
    url(r'^project/(?P<pk>[0-9]+)/upload_file/$',
        views.project_editor_upload_file,
        name='project_editor_upload_file'),
    url(r'^project/(?P<project_pk>[0-9]+)/import_results/$',
        views.project_editor_import_results,
        name='project_editor_import_results'),
    url(r'^project/(?P<project_pk>[0-9]+)/reorder_items/$',
        views.project_editor_reorder_items,
        name='project_editor_reorder_items'),
    url(r'^project/(?P<project_pk>[0-9]+)/default_periods/$',
        views.project_editor_default_periods,
        name='project_editor_default_periods'),
    url(r'^project/(?P<project_pk>[0-9]+)/add_validation/(?P<validation_pk>[0-9]+)/$',
        views.project_editor_add_validation,
        name='project_editor_add_validation'),
    url(r'^project/(?P<project_pk>[0-9]+)/remove_validation/(?P<validation_pk>[0-9]+)/$',
        views.project_editor_remove_validation,
        name='project_editor_remove_keyword'),
    url(r'^project/(?P<project_pk>[0-9]+)/remove_keyword/(?P<keyword_pk>[0-9]+)/$',
        views.project_editor_remove_keyword,
        name='project_editor_remove_keyword'),
    url(r'^project/(?P<project_pk>[0-9]+)/log_project_addition/$',
        views.log_project_addition,
        name='project_editor_log_add'),
    url(r'^project_update/(?P<pk>[0-9]+)/upload_photo/$',
        views.upload_indicator_update_photo,
        name='upload_indicator_update_photo'),
    url(r'^organisation/(?P<pk>[0-9]+)/add_logo/$',
        views.project_editor_organisation_logo,
        name='project_editor_add_org_logo'),
)

# Typeahead
urlpatterns += patterns(
    '',
    url(r'typeaheads/countries$',
        views.typeahead_country,
        name='country_typeahead'),
    url(r'typeaheads/organisations$',
        views.typeahead_organisation,
        name='organisation_typeahead'),
    url(r'typeaheads/user_organisations$',
        views.typeahead_user_organisations,
        name='user_organisations_typeahead'),
    url(r'typeaheads/projects$',
        views.typeahead_project,
        name='project_typeahead'),
    url(r'typeaheads/project_filters$',
        views.typeahead_project_filters,
        name='project_filters_typeahead'),
    url(r'typeaheads/user_projects$',
        views.typeahead_user_projects,
        name='user_projects_typeahead'),
    url(r'typeaheads/impact_projects$',
        views.typeahead_impact_projects,
        name='impact_projects_typeahead'),
    url(r'typeaheads/project_updates$',
        views.typeahead_projectupdate,
        name='projectupdate_typeahead'),
    url(r'typeaheads/keywords$',
        views.typeahead_keyword,
        name='keyword_typeahead'),
)

# My reports
urlpatterns += patterns(
    '',
    url(r'reports/$',
        views.reports,
        name='reports_api'),
    url(r'report_formats/$',
        views.report_formats,
        name='report_formats_api'),
)
