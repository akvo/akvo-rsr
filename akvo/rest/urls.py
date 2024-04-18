# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from . import views

from django.urls import include, path, re_path
from rest_framework import routers

# Wire up our API using automatic URL routing.
router = routers.DefaultRouter()

# NOTE: any url template tags targeting API endpoints need to include the version as the first
# parameter. Example: {% url 'project_extra-detail' 'v1' project.id 'json' %}

router.register(
    r"(?P<version>(v1))/administrative_location", views.AdministrativeLocationViewSet
)
router.register(r"(?P<version>(v1))/budget_item", views.BudgetItemViewSet)
router.register(r"(?P<version>(v1))/country", views.CountryViewSet)
router.register(
    r"(?P<version>(v1))/country_budget_item", views.CountryBudgetItemViewSet
)
router.register(r"(?P<version>(v1))/crs_add", views.CrsAddViewSet)
router.register(r"(?P<version>(v1))/crs_add_other_flag", views.CrsAddOtherFlagViewSet)
router.register(r"(?P<version>(v1))/default_period", views.DefaultPeriodViewSet)
router.register(r"(?P<version>(v1))/employment", views.EmploymentViewSet)
router.register(r"(?P<version>(v1))/fss", views.FssViewSet)
router.register(r"(?P<version>(v1))/fss_forecast", views.FssForecastViewSet)
router.register(r"(?P<version>(v1))/humanitarian_scope", views.HumanitarianScopeViewSet)
router.register(r"(?P<version>(v1))/iati_export", views.IatiExportViewSet)
router.register(r"(?P<version>(v1))/indicator", views.IndicatorViewSet)
router.register(
    r"(?P<version>(v1))/jobs/indicator_period_aggregation",
    views.IndicatorPeriodAggregationJobViewSet,
)
router.register(
    r"(?P<version>(v1))/dimension_name", views.IndicatorDimensionNameViewSet
)
router.register(
    r"(?P<version>(v1))/dimension_value", views.IndicatorDimensionValueViewSet
)
router.register(
    r"(?P<version>(v1))/indicator_custom_field", views.IndicatorCustomFieldViewSet
)
router.register(
    r"(?P<version>(v1))/indicator_custom_value", views.IndicatorCustomValueViewSet
)
router.register(
    r"(?P<version>(v1))/indicator_framework",
    views.IndicatorFrameworkViewSet,
    "indicator_framework",
)
router.register(r"(?P<version>(v1))/indicator_period", views.IndicatorPeriodViewSet)
router.register(
    r"(?P<version>(v1))/indicator_period_data", views.IndicatorPeriodDataViewSet
)
router.register(
    r"(?P<version>(v1))/indicator_period_data_framework",
    views.IndicatorPeriodDataFrameworkViewSet,
    "indicator_period_data_framework",
)
router.register(
    r"(?P<version>(v1))/indicator_period_data_comment",
    views.IndicatorPeriodDataCommentViewSet,
)
router.register(r"(?P<version>(v1))/disaggregation", views.DisaggregationViewSet)
router.register(
    r"(?P<version>(v1))/disaggregation_target", views.DisaggregationTargetViewSet
)
router.register(
    r"(?P<version>(v1))/indicator_disaggregation_target",
    views.IndicatorDisaggregationTargetViewSet,
)
router.register(
    r"(?P<version>(v1))/indicator_reference", views.IndicatorReferenceViewSet
)
router.register(
    r"(?P<version>(v1))/indicator_period_label", views.IndicatorPeriodLabelViewSet
)
router.register(r"(?P<version>(v1))/keyword", views.KeywordViewSet)
router.register(r"(?P<version>(v1))/legacy_data", views.LegacyDataViewSet)
router.register(r"(?P<version>(v1))/link", views.LinkViewSet)
router.register(r"(?P<version>(v1))/organisation", views.OrganisationViewSet)
router.register(
    r"(?P<version>(v1))/organisation_indicator_label",
    views.OrganisationIndicatorLabelViewSet,
)
router.register(r"(?P<version>(v1))/partnership", views.PartnershipViewSet)
router.register(
    r"(?P<version>(v1))/partnership_more_link",
    views.PartnershipMoreLinkViewSet,
    "partnership_more_link",
)
router.register(
    r"(?P<version>(v1))/planned_disbursement", views.PlannedDisbursementViewSet
)
router.register(r"(?P<version>(v1))/policy_marker", views.PolicyMarkerViewSet)
router.register(r"(?P<version>(v1))/project", views.ProjectViewSet)
router.register(
    r"(?P<version>(v1))/raw_project_hierarchy", views.RawProjectHierarchyViewSet
)
router.register(r"(?P<version>(v1))/program", views.ProgramViewSet, "program")
router.register(
    r"(?P<version>(v1))/project_by_uuid", views.ProjectByUuidViewSet, "project_by_uuid"
)
router.register(
    r"(?P<version>(v1))/my_projects", views.MyProjectsViewSet, "my_projects"
)
router.register(
    r"(?P<version>(v1))/project_iati_export",
    views.ProjectIatiExportViewSet,
    basename="project_iati_export",
)
router.register(
    r"(?P<version>(v1))/project_extra",
    views.ProjectExtraViewSet,
    basename="project_extra",
)
router.register(
    r"(?P<version>(v1))/project_up", views.ProjectUpViewSet, basename="project_up"
)
router.register(r"(?P<version>(v1))/project_contact", views.ProjectContactViewSet)
router.register(
    r"(?P<version>(v1))/project_custom_field", views.ProjectCustomFieldViewSet
)
router.register(r"(?P<version>(v1))/project_document", views.ProjectDocumentViewSet)
router.register(r"(?P<version>(v1))/project_location", views.ProjectLocationViewSet)

router.register(
    r"(?P<version>(v1))/project_update",
    views.ProjectUpdateViewSet,
    basename="project_update",
)

router.register(r"(?P<version>(v1))/publishing_status", views.PublishingStatusViewSet)
router.register(r"(?P<version>(v1))/recipient_country", views.RecipientCountryViewSet)
router.register(r"(?P<version>(v1))/recipient_region", views.RecipientRegionViewSet)
router.register(
    r"(?P<version>(v1))/reports", views.ReportViewSet, basename="reports_api"
)
router.register(r"(?P<version>(v1|v2))/result", views.ResultsViewSet)
router.register(
    r"(?P<version>(v1))/results_framework",
    views.ResultsFrameworkViewSet,
    "results_framework",
)
router.register(
    r"(?P<version>(v1))/results_framework_lite",
    views.ResultsFrameworkLiteViewSet,
    "results_framework_lite",
)
router.register(r"(?P<version>(v1))/sector", views.SectorViewSet)
router.register(r"(?P<version>(v1))/transaction", views.TransactionViewSet)
router.register(r"(?P<version>(v1))/transaction_sector", views.TransactionSectorViewSet)
router.register(r"(?P<version>(v1))/user", views.UserViewSet)


# We turn off the API root view (since it's broken with URLPathVersioning)
router.include_root_view = False
# Add API root view by version
root_url = re_path(
    r"(?P<version>(v1|v2))/$", router.get_api_root_view(), name=router.root_view_name
)
router.urls.append(root_url)

# Additionally, we include URLs for non-viewsets (functional views).
# NOTE: if versions is to be added to one of the views below, the view function needs to include
# version in its parameters.

urlpatterns = (
    path("", include(router.urls)),
    path(
        "v1/employment/<int:pk>/set_group/<int:group_id>/",
        views.set_group,
        name="set_group",
    ),
    path(
        "v1/user/<int:pk>/change_password/",
        views.change_password,
        name="user_change_password",
    ),
    path(
        "v1/organisations/<int:pk>/users/",
        views.organisation_user_roles,
        name="organisation_user_roles",
    ),
    path(
        "v1/managed-employments/", views.managed_employments, name="managed_employments"
    ),
    path(
        "v1/organisations/<int:org_pk>/users/<int:user_pk>/",
        views.change_user_roles,
        name="change_organisation_user_roles",
    ),
    path(
        "v1/user/<int:pk>/update_details/",
        views.update_details,
        name="user_update_details",
    ),
    path("v1/me/", views.current_user, name="current_user"),
    path("v1/invite_user/", views.invite_user, name="invite_user"),
    path(
        "v1/project_iati_check/<int:pk>/",
        views.ProjectIatiCheckView.as_view(),
        name="project_iati_check",
    ),
    path(
        "v1/project_update/<int:update_pk>/photos/",
        views.project_update_photos,
        name="project_update_add_photos",
    ),
    path(
        "v1/project_update/<int:update_pk>/photos/<int:photo_pk>/",
        views.project_update_photos,
        name="project_update_remove_photos",
    ),
    path(
        "v1/indicator_period_data/<int:pk>/upload_file/",
        views.indicator_upload_file,
        name="indicator_upload_file",
    ),
    path(
        "v1/indicator_period_data/<int:update_pk>/files/",
        views.period_update_files,
        name="period_update_add_files",
    ),
    path(
        "v1/indicator_period_data/<int:update_pk>/files/<int:file_pk>/",
        views.period_update_files,
        name="period_update_remove_files",
    ),
    path(
        "v1/indicator_period_data/<int:update_pk>/photos/",
        views.period_update_photos,
        name="period_update_add_photos",
    ),
    path(
        "v1/indicator_period_data/<int:update_pk>/photos/<int:photo_pk>/",
        views.period_update_photos,
        name="period_update_remove_photos",
    ),
    path(
        "v1/set-periods-locked/<int:project_pk>/",
        views.set_periods_locked,
        name="set_periods_locked",
    ),
    path(
        "v1/set-updates-status/<int:project_pk>/",
        views.set_updates_status,
        name="set_updates_status",
    ),
    path(
        "v1/right_now_in_akvo/", views.right_now_in_akvo_view, name="right_now_in_akvo"
    ),
    path("v1/server_info/", views.server_info, name="server_info"),
    path(
        "v1/title-and-status/<int:project_pk>/",
        views.project_title,
        name="project_title",
    ),
    path(
        "v1/project/<int:project_pk>/results_framework/",
        views.project_results_framework,
        name="project_results_framework",
    ),
    path(
        "v1/bulk-add-periods/<int:project_pk>/",
        views.bulk_add_periods,
        name="bulk_add_periods",
    ),
    path(
        "v1/bulk-remove-periods/<int:project_pk>/",
        views.bulk_remove_periods,
        name="bulk_remove_periods",
    ),
    path(
        "v1/project/<int:project_pk>/indicator/<int:indicator_pk>/previous_cumulative_update",
        views.indicator_previous_cumulative_update,
        name="indicator_previous_cumulative_update",
    ),
    path(
        "v1/project/<int:project_pk>/indicator/<int:indicator_pk>/contribution_count",
        views.indicator_contribution_count,
        name="indicator_contribution_count",
    ),
)

# Project editor
urlpatterns += (
    path(
        "v1/project/<int:project_pk>/copy_results/<int:source_pk>/",
        views.project_editor_copy_results,
        name="project_editor_copy_results",
    ),
    path(
        "v1/project/<int:project_pk>/import_results/",
        views.project_editor_import_results,
        name="project_editor_import_results",
    ),
    path(
        "v1/project/<int:project_pk>/import_result/<int:parent_result_id>/",
        views.project_editor_import_result,
        name="project_editor_import_result",
    ),
    path(
        "v1/project/<int:project_pk>/import_indicator/<int:parent_indicator_id>/",
        views.project_editor_import_indicator,
        name="project_editor_import_indicator",
    ),
    path(
        "v1/project/<int:project_pk>/reorder_items/",
        views.project_editor_reorder_items,
        name="project_editor_reorder_items",
    ),
    path(
        "v1/project/<int:project_pk>/default_periods/",
        views.project_default_periods,
        name="project_default_periods",
    ),
    path(
        "v1/project/<int:project_pk>/period-labels/",
        views.project_period_labels,
        name="project_period_labels",
    ),
    path(
        "v1/project/<int:project_pk>/indicator_custom_fields/",
        views.project_default_periods,
        name="project_indicator_custom_fields",
    ),
    path(
        "v1/project_update/<int:pk>/upload_photo/",
        views.upload_indicator_update_photo,
        name="upload_indicator_update_photo",
    ),
    path(
        "v1/project/<int:project_pk>/project-roles/",
        views.project_roles,
        name="project_roles",
    ),
    path(
        "v1/project/<int:project_pk>/invite-user/",
        views.project_invite_user,
        name="project_invite_user",
    ),
    path(
        "v1/project/<int:project_pk>/enumerator-assignment-send/",
        views.assignment_send,
        name="enumerator_assignment_send",
    ),
)

# Directory views
urlpatterns += (
    path("v1/project-directory", views.project_directory, name="project_directory"),
    path("v1/sector_codes", views.sector_codes, name="sector_code_list"),
    path("v1/projects_by_id", views.projects_by_id, name="projects_by_id"),
    path(
        "v1/project_published_search",
        views.project_published_search,
        name="project_published_search",
    ),
    path("v1/demo_request", views.demo_request, name="demo_request"),
)

# GeoJSON views
urlpatterns += (
    path(
        "v1/project_location_geojson",
        views.project_location_geojson,
        name="project_location_geojson",
    ),
)

# Project overview
urlpatterns += (
    path("v1/project/<int:pk>/results/", views.project_results, name="project_results"),
    path(
        "v1/project/<int:project_pk>/result/<int:result_pk>/",
        views.project_result_overview,
        name="project_result_overview",
    ),
    path(
        "v1/project/<int:project_pk>/indicator/<int:indicator_pk>/",
        views.project_indicator_overview,
        name="project_indicator_overview",
    ),
    path(
        "v1/project/<int:project_pk>/results_geo/",
        views.get_program_results_geo,
        name="get_program_results_geo",
    ),
)

# Project enumerators
urlpatterns += (
    path(
        "v1/project/<int:project_pk>/enumerators/",
        views.project_enumerators,
        name="project_enumerators",
    ),
)

# Program
urlpatterns += (
    path(
        "v1/program/<int:program_pk>/add-project/",
        views.add_project_to_program,
        name="add_project_to_program",
    ),
    path(
        "v1/program/<int:program_pk>/countries/",
        views.program_countries,
        name="program_countries",
    ),
    path(
        "v1/program/<int:program_pk>/updates/",
        views.program_updates,
        name="program_updates",
    ),
)


# Typeahead
urlpatterns += (
    path(
        "v1/typeaheads/organisations",
        views.typeahead_organisation,
        name="organisation_typeahead",
    ),
    path("v1/typeaheads/projects", views.typeahead_project, name="project_typeahead"),
    path(
        "v1/typeaheads/project_updates",
        views.typeahead_projectupdate,
        name="projectupdate_typeahead",
    ),
    path(
        "v1/organisation_reports/",
        views.organisation_reports,
        name="organisation_reports",
    ),
    path(
        "v1/project/<int:project_pk>/reports/",
        views.project_reports,
        name="project_reports",
    ),
    path(
        "v1/project/<int:project_pk>/reports/period-dates/",
        views.project_reports_period_dates,
        name="project_reports_period_dates",
    ),
    path(
        "v1/program_reports/<int:program_pk>/",
        views.program_reports,
        name="program_reports",
    ),
    path(
        "v1/program_reports/<int:program_pk>/period-dates/",
        views.program_reports_period_dates,
        name="program_reports_period_dates",
    ),
    path(
        "v1/program_reports/<int:program_pk>/countries/",
        views.program_reports_countries,
        name="program_reports_countries",
    ),
    path("v1/members/", views.organisations_members, name="organisations_members"),
    path(
        "v1/recalculate_project_aggregation/",
        views.recalculate_project_aggregation,
        name="recalculate_project_aggregation",
    ),
)

# My reports
urlpatterns += (
    path("v1/report_formats/", views.report_formats, name="report_formats_api"),
)
