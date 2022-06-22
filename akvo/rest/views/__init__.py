# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


from .benchmark import BenchmarkViewSet
from .benchmark_name import BenchmarknameViewSet
from .budget_item import BudgetItemViewSet, CountryBudgetItemViewSet
from .budget_item_label import BudgetItemLabelViewSet
from .category import CategoryViewSet
from .country import CountryViewSet
from .crs_add import CrsAddViewSet, CrsAddOtherFlagViewSet
from .custom_field import OrganisationCustomFieldViewSet, ProjectCustomFieldViewSet
from .default_period import DefaultPeriodViewSet, project_default_periods
from .employment import (
    EmploymentViewSet, set_group, organisations_members, organisation_user_roles,
    change_user_roles, managed_employments)
from .exception_handler import exception_handler
from .focus_area import FocusAreaViewSet
from .fss import FssViewSet, FssForecastViewSet
from .goal import GoalViewSet
from .humanitarian_scope import HumanitarianScopeViewSet
from .iati_check import IatiCheckViewSet
from .iati_export import IatiActivityExportViewSet, IatiExportViewSet
from .indicator import IndicatorViewSet, IndicatorFrameworkViewSet
from .indicator_custom_field import IndicatorCustomFieldViewSet, IndicatorCustomValueViewSet
from .indicator_dimension_name import IndicatorDimensionNameViewSet
from .indicator_dimension_value import IndicatorDimensionValueViewSet
from .indicator_label import IndicatorLabelViewSet
from .indicator_period_label import IndicatorPeriodLabelViewSet, project_period_labels
from .indicator_period import (IndicatorPeriodViewSet, IndicatorPeriodFrameworkViewSet,
                               set_periods_locked, bulk_add_periods, bulk_remove_periods)
from .indicator_period_data import (IndicatorPeriodDataViewSet, IndicatorPeriodDataFrameworkViewSet,
                                    IndicatorPeriodDataCommentViewSet, indicator_upload_file,
                                    period_update_files, period_update_photos, set_updates_status)
from .indicator_period_disaggregation import IndicatorPeriodDisaggregationViewSet
from .disaggregation import DisaggregationViewSet
from .disaggregation_target import DisaggregationTargetViewSet
from .indicator_disaggregation_target import IndicatorDisaggregationTargetViewSet
from .indicator_period_location import (IndicatorPeriodActualLocationViewSet,
                                        IndicatorPeriodTargetLocationViewSet)
from .indicator_reference import IndicatorReferenceViewSet
from .internal_organisation_id import InternalOrganisationIDViewSet
from .keyword import KeywordViewSet
from .legacy_data import LegacyDataViewSet
from .link import LinkViewSet
from .narrative_report import NarrativeReportViewSet
from .organisation import OrganisationViewSet, organisation_directory
from .organisation_budget import (OrganisationTotalBudgetViewSet,
                                  OrganisationTotalBudgetLineViewSet,
                                  OrganisationRecipientOrgBudgetViewSet,
                                  OrganisationRecipientOrgBudgetLineViewSet,
                                  OrganisationRegionBudgetViewSet,
                                  OrganisationRegionBudgetLineViewSet,
                                  OrganisationCountryBudgetViewSet,
                                  OrganisationCountryBudgetLineViewSet,
                                  OrganisationTotalExpenditureViewSet,
                                  OrganisationExpenseLineViewSet)
from .organisation_location import OrganisationLocationViewSet, MapOrganisationLocationViewSet
from .organisation_indicator_label import OrganisationIndicatorLabelViewSet
from .partner_site import PartnerSiteViewSet
from .partnership import PartnershipViewSet, PartnershipMoreLinkViewSet
from .planned_disbursement import PlannedDisbursementViewSet
from .policy_marker import PolicyMarkerViewSet
from .project import (ProjectViewSet, ProjectExtraViewSet, ProjectExtraDeepViewSet,
                      ProjectIatiExportViewSet, ProjectUpViewSet, project_location_geojson,
                      MyProjectsViewSet, ProjectHierarchyViewSet, add_project_to_program,
                      project_directory, project_title, projects_by_id, project_published_search)
from .project_editor import (project_editor_reorder_items,
                             project_editor_copy_results,
                             project_editor_import_result,
                             project_editor_import_results,
                             project_editor_import_indicator)
from .project_document import ProjectDocumentViewSet, ProjectDocumentCategoryViewSet
from .project_condition import ProjectConditionViewSet
from .project_contact import ProjectContactViewSet
from .project_iati_checks import ProjectIatiCheckView
from .project_location import (ProjectLocationViewSet,
                               AdministrativeLocationViewSet,
                               MapProjectLocationViewSet)
from .project_hierarchy import RawProjectHierarchyViewSet, program_countries, program_updates
from .project_role import project_roles, project_invite_user
from .project_update import (ProjectUpdateViewSet,
                             ProjectUpdateExtraViewSet,
                             upload_indicator_update_photo,
                             update_directory,
                             project_update_photos)
from .project_update_location import ProjectUpdateLocationViewSet, MapProjectUpdateLocationViewSet
from .publishing_status import PublishingStatusViewSet
from .recipient_country import RecipientCountryViewSet
from .related_project import RelatedProjectViewSet
from .region import RecipientRegionViewSet
from .report import (report_formats, ReportViewSet, project_reports, program_reports, organisation_reports,
                     project_reports_period_dates, program_reports_period_dates, program_reports_countries)
from .result import (ResultsViewSet, ResultsFrameworkViewSet, ResultsFrameworkLiteViewSet,
                     project_results_framework)
from .right_now_in_akvo import right_now_in_akvo_view
from .sector import sector_codes, SectorViewSet
from .server_info import server_info
from .transaction import TransactionViewSet, TransactionSectorViewSet
from .typeahead import (typeahead_organisation,
                        typeahead_project,
                        typeahead_projectupdate)
from .user import UserViewSet, change_password, update_details, current_user
from .user_management import invite_user
from .project_overview import project_results, project_result_overview, project_indicator_overview
from .program_results import get_program_results
from .program_results_geo import get_program_results_geo
from .project_enumerators import assignment_send, project_enumerators

__all__ = [
    'assignment_send',
    'AdministrativeLocationViewSet',
    'BenchmarknameViewSet',
    'BenchmarkViewSet',
    'BudgetItemLabelViewSet',
    'BudgetItemViewSet',
    'CategoryViewSet',
    'change_password',
    'current_user',
    'CountryViewSet',
    'CountryBudgetItemViewSet',
    'CrsAddViewSet',
    'CrsAddOtherFlagViewSet',
    'DefaultPeriodViewSet',
    'EmploymentViewSet',
    'exception_handler',
    'FocusAreaViewSet',
    'FssViewSet',
    'FssForecastViewSet',
    'GoalViewSet',
    'HumanitarianScopeViewSet',
    'IatiActivityExportViewSet',
    'IatiCheckViewSet',
    'IatiExportViewSet',
    'IndicatorViewSet',
    'IndicatorCustomFieldViewSet',
    'IndicatorCustomValueViewSet',
    'IndicatorDimensionNameViewSet',
    'IndicatorDimensionValueViewSet',
    'IndicatorFrameworkViewSet',
    'IndicatorLabelViewSet',
    'IndicatorPeriodLabelViewSet',
    'IndicatorPeriodActualLocationViewSet',
    'IndicatorPeriodViewSet',
    'IndicatorPeriodFrameworkViewSet',
    'IndicatorPeriodDataViewSet',
    'IndicatorPeriodDataFrameworkViewSet',
    'IndicatorPeriodDisaggregationViewSet',
    'DisaggregationViewSet',
    'DisaggregationTargetViewSet',
    'IndicatorDisaggregationTargetViewSet',
    'IndicatorPeriodDataCommentViewSet',
    'IndicatorPeriodTargetLocationViewSet',
    'IndicatorReferenceViewSet',
    'indicator_upload_file',
    'period_update_files',
    'period_update_photos',
    'set_updates_status',
    'InternalOrganisationIDViewSet',
    'invite_user',
    'KeywordViewSet',
    'LegacyDataViewSet',
    'LinkViewSet',
    'MapOrganisationLocationViewSet',
    'MapProjectLocationViewSet',
    'MapProjectUpdateLocationViewSet',
    'NarrativeReportViewSet',
    'organisation_directory',
    'OrganisationViewSet',
    'OrganisationLocationViewSet',
    'OrganisationCountryBudgetViewSet',
    'OrganisationCountryBudgetLineViewSet',
    'OrganisationCustomFieldViewSet',
    'OrganisationExpenseLineViewSet',
    'OrganisationIndicatorLabelViewSet',
    'OrganisationRecipientOrgBudgetViewSet',
    'OrganisationRecipientOrgBudgetLineViewSet',
    'OrganisationRegionBudgetViewSet',
    'OrganisationRegionBudgetLineViewSet',
    'OrganisationTotalBudgetViewSet',
    'OrganisationTotalBudgetLineViewSet',
    'OrganisationTotalExpenditureViewSet',
    'PartnershipViewSet',
    'PartnershipMoreLinkViewSet',
    'PartnerSiteViewSet',
    'PlannedDisbursementViewSet',
    'PolicyMarkerViewSet',
    'ProjectConditionViewSet',
    'ProjectContactViewSet',
    'ProjectCustomFieldViewSet',
    'ProjectDocumentViewSet',
    'ProjectDocumentCategoryViewSet',
    'ProjectExtraViewSet',
    'ProjectExtraDeepViewSet',
    'ProjectIatiCheckView',
    'ProjectIatiExportViewSet',
    'ProjectLocationViewSet',
    'ProjectUpdateExtraViewSet',
    'ProjectUpdateLocationViewSet',
    'ProjectUpdateViewSet',
    'ProjectUpViewSet',
    'ProjectViewSet',
    'MyProjectsViewSet',
    'ProjectHierarchyViewSet',
    'project_enumerators',
    'project_location_geojson',
    'project_editor_copy_results',
    'project_editor_import_result',
    'project_editor_import_results',
    'project_editor_import_indicator',
    'PublishingStatusViewSet',
    'RecipientCountryViewSet',
    'RecipientRegionViewSet',
    'RelatedProjectViewSet',
    'report_formats',
    'ReportViewSet',
    'project_reports',
    'program_reports',
    'organisation_reports',
    'program_reports_countries',
    'ResultsViewSet',
    'ResultsFrameworkViewSet',
    'ResultsFrameworkLiteViewSet',
    'project_results_framework',
    'right_now_in_akvo_view',
    'sector_codes',
    'SectorViewSet',
    'server_info',
    'set_group',
    'TransactionViewSet',
    'TransactionSectorViewSet',
    'typeahead_organisation',
    'typeahead_project',
    'typeahead_projectupdate',
    'update_details',
    'update_directory',
    'project_update_photos',
    'upload_indicator_update_photo',
    'UserViewSet',
    'project_results',
    'get_program_results',
    'get_program_results_geo',
    'project_result_overview',
    'project_indicator_overview',
    'organisations_members',
    'project_roles',
    'project_invite_user',
    'organisation_user_roles',
    'change_user_roles',
    'RawProjectHierarchyViewSet',
    'managed_employments',
]
