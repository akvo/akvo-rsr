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
from .employment import EmploymentViewSet, approve_employment, set_group
from .focus_area import FocusAreaViewSet
from .fss import FssViewSet, FssForecastViewSet
from .goal import GoalViewSet
from .humanitarian_scope import HumanitarianScopeViewSet
from .iati_check import IatiCheckViewSet
from .iati_export import IatiActivityExportViewSet, IatiExportViewSet
from .indicator import IndicatorViewSet, IndicatorFrameworkViewSet
from .indicator_dimension import IndicatorDimensionViewSet
from .indicator_label import IndicatorLabelViewSet
from .indicator_period import IndicatorPeriodViewSet, IndicatorPeriodFrameworkViewSet
from .indicator_period_data import (IndicatorPeriodDataViewSet, IndicatorPeriodDataFrameworkViewSet,
                                    IndicatorPeriodDataCommentViewSet, indicator_upload_file)
from .disaggregation import DisaggregationViewSet
from .indicator_period_dimension import (IndicatorPeriodActualDimensionViewSet,
                                         IndicatorPeriodTargetDimensionViewSet)
from .indicator_period_location import (IndicatorPeriodActualLocationViewSet,
                                        IndicatorPeriodTargetLocationViewSet)
from .indicator_reference import IndicatorReferenceViewSet
from .internal_organisation_id import InternalOrganisationIDViewSet
from .keyword import KeywordViewSet
from .legacy_data import LegacyDataViewSet
from .link import LinkViewSet
from .organisation import OrganisationViewSet
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
from .partner_site import PartnerSiteViewSet
from .partnership import PartnershipViewSet, PartnershipMoreLinkViewSet
from .planned_disbursement import PlannedDisbursementViewSet
from .policy_marker import PolicyMarkerViewSet
from .project import (ProjectViewSet, ProjectExtraViewSet, ProjectExtraDeepViewSet,
                      ProjectIatiExportViewSet, ProjectUpViewSet)
from .project_editor import (project_editor,
                             log_project_addition,
                             project_editor_reorder_items,
                             project_editor_default_periods,
                             project_editor_upload_file,
                             project_editor_import_results,
                             project_editor_add_validation,
                             project_editor_remove_validation,
                             project_editor_remove_keyword,
                             project_editor_organisation_logo)
from .project_comment import ProjectCommentViewSet
from .project_document import ProjectDocumentViewSet, ProjectDocumentCategoryViewSet
from .project_condition import ProjectConditionViewSet
from .project_contact import ProjectContactViewSet
from .project_iati_checks import ProjectIatiCheckView
from .project_location import (ProjectLocationViewSet,
                               AdministrativeLocationViewSet,
                               MapProjectLocationViewSet)
from .project_update import (ProjectUpdateViewSet,
                             ProjectUpdateExtraViewSet,
                             upload_indicator_update_photo)
from .project_update_location import ProjectUpdateLocationViewSet, MapProjectUpdateLocationViewSet
from .publishing_status import PublishingStatusViewSet
from .recipient_country import RecipientCountryViewSet
from .related_project import RelatedProjectViewSet
from .region import RecipientRegionViewSet
from .report import reports, report_formats
from .result import ResultsViewSet, ResultsFrameworkViewSet
from .right_now_in_akvo import right_now_in_akvo_view
from .sector import SectorViewSet
from .server_info import server_info
from .transaction import TransactionViewSet, TransactionSectorViewSet
from .typeahead import (typeahead_country,
                        typeahead_keyword,
                        typeahead_organisation,
                        typeahead_user_organisations,
                        typeahead_project,
                        typeahead_project_filters,
                        typeahead_user_projects,
                        typeahead_impact_projects,
                        typeahead_projectupdate)
from .user import (UserViewSet, change_password, update_details,
                   request_organisation)
from .user_management import invite_user

__all__ = [
    'AdministrativeLocationViewSet',
    'approve_employment',
    'BenchmarknameViewSet',
    'BenchmarkViewSet',
    'BudgetItemLabelViewSet',
    'BudgetItemViewSet',
    'CategoryViewSet',
    'change_password',
    'CountryViewSet',
    'CountryBudgetItemViewSet',
    'CrsAddViewSet',
    'CrsAddOtherFlagViewSet',
    'EmploymentViewSet',
    'FocusAreaViewSet',
    'FssViewSet',
    'FssForecastViewSet',
    'GoalViewSet',
    'HumanitarianScopeViewSet',
    'IatiActivityExportViewSet',
    'IatiCheckViewSet',
    'IatiExportViewSet',
    'IndicatorViewSet',
    'IndicatorDimensionViewSet',
    'IndicatorFrameworkViewSet',
    'IndicatorLabelViewSet',
    'IndicatorPeriodActualDimensionViewSet',
    'IndicatorPeriodActualLocationViewSet',
    'IndicatorPeriodViewSet',
    'IndicatorPeriodFrameworkViewSet',
    'IndicatorPeriodDataViewSet',
    'IndicatorPeriodDataFrameworkViewSet',
    'DisaggregationViewSet',
    'IndicatorPeriodDataCommentViewSet',
    'IndicatorPeriodTargetDimensionViewSet',
    'IndicatorPeriodTargetLocationViewSet',
    'IndicatorReferenceViewSet',
    'indicator_upload_file',
    'InternalOrganisationIDViewSet',
    'invite_user',
    'KeywordViewSet',
    'LegacyDataViewSet',
    'LinkViewSet',
    'MapOrganisationLocationViewSet',
    'MapProjectLocationViewSet',
    'MapProjectUpdateLocationViewSet',
    'OrganisationViewSet',
    'OrganisationLocationViewSet',
    'OrganisationCountryBudgetViewSet',
    'OrganisationCountryBudgetLineViewSet',
    'OrganisationCustomFieldViewSet',
    'OrganisationExpenseLineViewSet',
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
    'ProjectCommentViewSet',
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
    'project_editor',
    'log_project_addition',
    'project_editor_upload_file',
    'project_editor_add_validation',
    'project_editor_remove_validation',
    'project_editor_import_results',
    'project_editor_organisation_logo',
    'PublishingStatusViewSet',
    'RecipientCountryViewSet',
    'RecipientRegionViewSet',
    'RelatedProjectViewSet',
    'reports',
    'report_formats',
    'request_organisation',
    'ResultsViewSet',
    'ResultsFrameworkViewSet',
    'right_now_in_akvo_view',
    'SectorViewSet',
    'server_info',
    'set_group',
    'TransactionViewSet',
    'TransactionSectorViewSet',
    'typeahead_country',
    'typeahead_keyword',
    'typeahead_organisation',
    'typeahead_user_organisations',
    'typeahead_project',
    'typeahead_project_filters',
    'typeahead_user_projects',
    'typeahead_impact_projects',
    'typeahead_projectupdate',
    'update_details',
    'upload_indicator_update_photo',
    'UserViewSet',
]
