# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


from .benchmark import BenchmarkSerializer
from .benchmark_name import BenchmarknameSerializer
from .budget_item import BudgetItemRawSerializer, BudgetItemSerializer, CountryBudgetItemSerializer
from .budget_item_label import BudgetItemLabelSerializer
from .category import CategorySerializer
from .country import CountrySerializer
from .crs_add import CrsAddSerializer, CrsAddOtherFlagSerializer
from .custom_field import OrganisationCustomFieldSerializer, ProjectCustomFieldSerializer
from .default_period import DefaultPeriodSerializer
from .disaggregation import DisaggregationSerializer
from .disaggregation_target import DisaggregationTargetSerializer
from .employment import EmploymentSerializer
from .focus_area import FocusAreaSerializer
from .fss import FssSerializer, FssForecastSerializer
from .goal import GoalSerializer
from .humanitarian_scope import HumanitarianScopeSerializer
from .iati_check import IatiCheckSerializer
from .iati_export import IatiActivityExportSerializer, IatiExportSerializer
from .indicator import (IndicatorSerializer, IndicatorFrameworkSerializer, IndicatorFrameworkLiteSerializer)
from .indicator_label import IndicatorLabelSerializer
from .indicator_period import IndicatorPeriodSerializer, IndicatorPeriodFrameworkSerializer
from .indicator_period_data import (IndicatorPeriodDataSerializer,
                                    IndicatorPeriodDataFrameworkSerializer,
                                    IndicatorPeriodDataCommentSerializer)
from .indicator_period_disaggregation import IndicatorPeriodDisaggregationSerializer
from .indicator_period_location import (IndicatorPeriodActualLocationSerializer,
                                        IndicatorPeriodTargetLocationSerializer)
from indicator_dimension_name import IndicatorDimensionNameSerializer
from indicator_dimension_value import IndicatorDimensionValueSerializer
from .indicator_reference import IndicatorReferenceSerializer
from .internal_organisation_id import InternalOrganisationIDSerializer
from .keyword import KeywordSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .narrative_report import NarrativeReportSerializer
from .organisation import OrganisationSerializer, OrganisationBasicSerializer, OrganisationDirectorySerializer
from .organisation_budget import (OrganisationCountryBudgetSerializer,
                                  OrganisationCountryBudgetLineSerializer,
                                  OrganisationExpenseLineSerializer,
                                  OrganisationRecipientOrgBudgetSerializer,
                                  OrganisationRecipientOrgBudgetLineSerializer,
                                  OrganisationRegionBudgetSerializer,
                                  OrganisationRegionBudgetLineSerializer,
                                  OrganisationTotalBudgetSerializer,
                                  OrganisationTotalBudgetLineSerializer,
                                  OrganisationTotalExpenditureSerializer)
from .organisation_document import (OrganisationDocumentCategorySerializer,
                                    OrganisationDocumentCountrySerializer,
                                    OrganisationDocumentSerializer)
from organisation_indicator_label import OrganisationIndicatorLabelSerializer
from .organisation_location import (OrganisationLocationSerializer,
                                    MapOrganisationLocationSerializer)
from .partner_site import PartnerSiteSerializer
from .partnership import (PartnershipSerializer,
                          PartnershipBasicSerializer,
                          PartnershipRawSerializer,
                          PartnershipRawDeepSerializer)
from .planned_disbursement import (PlannedDisbursementSerializer,
                                   PlannedDisbursementRawDeepSerializer,
                                   PlannedDisbursementRawSerializer)
from .policy_marker import PolicyMarkerSerializer, PolicyMarkerRawSerializer
from .project import (ProjectSerializer, ProjectExtraSerializer, ProjectExtraDeepSerializer,
                      ProjectIatiExportSerializer, ProjectDirectorySerializer, ProjectUpSerializer,
                      ProjectMetadataSerializer, ProjectHierarchyRootSerializer,
                      ProjectHierarchyTreeSerializer)
from .project_comment import ProjectCommentSerializer
from .project_condition import ProjectConditionSerializer, ProjectConditionRawSerializer
from .project_contact import (ProjectContactSerializer,
                              ProjectContactRawSerializer,
                              ProjectContactRawDeepSerializer)
from .project_document import (ProjectDocumentSerializer, ProjectDocumentCategorySerializer,
                               ProjectDocumentRawSerializer)
from .project_location import (ProjectLocationSerializer, AdministrativeLocationSerializer,
                               MapProjectLocationSerializer, ProjectLocationRawSerializer,
                               ProjectLocationCountryNameSerializer)
from .project_update import (ProjectUpdateSerializer,
                             ProjectUpdateDeepSerializer,
                             ProjectUpdateDirectorySerializer,
                             ProjectUpdateExtraSerializer)
from .project_update_location import (ProjectUpdateLocationSerializer,
                                      ProjectUpdateLocationNestedSerializer,
                                      MapProjectUpdateLocationSerializer)
from .publishing_status import PublishingStatusSerializer
from .recipient_country import RecipientCountrySerializer, RecipientCountryRawSerializer
from .region import RecipientRegionSerializer, RecipientRegionRawSerializer
from .report import ReportSerializer, ReportFormatSerializer
from .related_project import RelatedProjectSerializer, RelatedProjectRawSerializer
from .result import (ResultSerializer, ResultsFrameworkSerializer, ResultRawSerializer,
                     ResultSerializerV2, ResultsFrameworkLiteSerializer)
from .sector import SectorSerializer, SectorRawSerializer
from .transaction import (TransactionSerializer, TransactionSectorSerializer,
                          TransactionRawSerializer, TransactionRawDeepSerializer)
from .typeahead import (TypeaheadCountrySerializer,
                        TypeaheadOrganisationSerializer,
                        TypeaheadProjectSerializer,
                        TypeaheadProjectUpdateSerializer,
                        TypeaheadKeywordSerializer,
                        TypeaheadSectorSerializer)
from .user import UserSerializer, UserDetailsSerializer, UserPasswordSerializer, UserRawSerializer
from .user_projects import UserProjectAccessSerializer, UserProjectsSerializer

__all__ = [
    'AdministrativeLocationSerializer',
    'BenchmarknameSerializer',
    'BenchmarkSerializer',
    'BudgetItemLabelSerializer',
    'BudgetItemRawSerializer',
    'BudgetItemSerializer',
    'CategorySerializer',
    'CountrySerializer',
    'CountryBudgetItemSerializer',
    'CrsAddSerializer',
    'CrsAddOtherFlagSerializer',
    'DefaultPeriodSerializer',
    'DisaggregationSerializer',
    'DisaggregationTargetSerializer',
    'EmploymentSerializer',
    'FocusAreaSerializer',
    'FssSerializer',
    'FssForecastSerializer',
    'GoalSerializer',
    'HumanitarianScopeSerializer',
    'IatiActivityExportSerializer',
    'IatiCheckSerializer',
    'IatiExportSerializer',
    'IndicatorSerializer',
    'IndicatorFrameworkSerializer',
    'IndicatorLabelSerializer',
    'IndicatorPeriodActualLocationSerializer',
    'IndicatorPeriodDataCommentSerializer',
    'IndicatorPeriodDataFrameworkSerializer',
    'IndicatorPeriodDataSerializer',
    'IndicatorPeriodFrameworkSerializer',
    'IndicatorPeriodSerializer',
    'IndicatorPeriodDisaggregationSerializer',
    'IndicatorPeriodTargetLocationSerializer',
    'IndicatorReferenceSerializer',
    'InternalOrganisationIDSerializer',
    'KeywordSerializer',
    'LegacyDataSerializer',
    'LinkSerializer',
    'MapOrganisationLocationSerializer',
    'MapProjectLocationSerializer',
    'MapProjectUpdateLocationSerializer',
    'NarrativeReportSerializer',
    'OrganisationSerializer',
    'OrganisationBasicSerializer',
    'OrganisationCountryBudgetLineSerializer',
    'OrganisationCountryBudgetSerializer',
    'OrganisationCustomFieldSerializer',
    'OrganisationDocumentCategorySerializer',
    'OrganisationDocumentCountrySerializer',
    'OrganisationDocumentSerializer',
    'OrganisationExpenseLineSerializer',
    'OrganisationIndicatorLabelSerializer',
    'OrganisationLocationSerializer',
    'OrganisationRecipientOrgBudgetLineSerializer',
    'OrganisationRecipientOrgBudgetSerializer',
    'OrganisationRegionBudgetLineSerializer',
    'OrganisationRegionBudgetSerializer',
    'OrganisationTotalBudgetSerializer',
    'OrganisationTotalBudgetLineSerializer',
    'OrganisationTotalExpenditureSerializer',
    'PartnershipSerializer',
    'PartnershipRawSerializer',
    'PartnershipBasicSerializer',
    'PartnershipRawDeepSerializer',
    'PartnerSiteSerializer',
    'PlannedDisbursementSerializer',
    'PlannedDisbursementRawSerializer',
    'PlannedDisbursementRawDeepSerializer',
    'PolicyMarkerSerializer',
    'PolicyMarkerRawSerializer',
    'ProjectCommentSerializer',
    'ProjectConditionSerializer',
    'ProjectConditionRawSerializer',
    'ProjectContactSerializer',
    'ProjectContactRawSerializer',
    'ProjectContactRawDeepSerializer',
    'ProjectCustomFieldSerializer',
    'ProjectDocumentSerializer',
    'ProjectDocumentRawSerializer',
    'ProjectDocumentCategorySerializer',
    'ProjectExtraSerializer',
    'ProjectExtraDeepSerializer',
    'ProjectIatiExportSerializer',
    'ProjectDirectorySerializer',
    'ProjectLocationSerializer',
    'ProjectLocationCountryNameSerializer',
    'ProjectLocationRawSerializer',
    'ProjectSerializer',
    'ProjectUpdateDirectorySerializer',
    'ProjectUpdateExtraSerializer',
    'ProjectUpdateLocationSerializer',
    'ProjectUpdateLocationNestedSerializer',
    'ProjectUpdateSerializer',
    'ProjectUpdateDeepSerializer',
    'ProjectUpSerializer',
    'ProjectHierarchyRootSerializer',
    'ProjectHierarchyTreeSerializer',
    'PublishingStatusSerializer',
    'RecipientCountrySerializer',
    'RecipientCountryRawSerializer',
    'RecipientRegionSerializer',
    'RecipientRegionRawSerializer',
    'RelatedProjectSerializer',
    'RelatedProjectRawSerializer',
    'ReportSerializer',
    'ReportFormatSerializer',
    'ResultSerializer',
    'ResultSerializerV2',
    'ResultRawSerializer',
    'ResultsFrameworkSerializer',
    'SectorSerializer',
    'SectorRawSerializer',
    'TransactionSerializer',
    'TransactionRawSerializer',
    'TransactionSectorSerializer',
    'TransactionRawDeepSerializer',
    'TypeaheadCountrySerializer',
    'TypeaheadKeywordSerializer',
    'TypeaheadOrganisationSerializer',
    'TypeaheadProjectSerializer',
    'TypeaheadProjectUpdateSerializer',
    'TypeaheadSectorSerializer',
    'UserDetailsSerializer',
    'UserPasswordSerializer',
    'UserProjectAccessSerializer',
    'UserProjectsSerializer',
    'UserSerializer',
    'UserRawSerializer',
]
