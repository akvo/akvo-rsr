# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


from .budget_item import BudgetItemRawSerializer, BudgetItemSerializer, CountryBudgetItemSerializer
from .budget_item_label import BudgetItemLabelSerializer
from .country import CountrySerializer
from .crs_add import CrsAddSerializer, CrsAddOtherFlagSerializer
from .custom_field import OrganisationCustomFieldSerializer, ProjectCustomFieldSerializer
from .default_period import DefaultPeriodSerializer
from .disaggregation import DisaggregationSerializer
from .disaggregation_target import DisaggregationTargetSerializer
from .external_project import ExternalProjectSerializer
from .indicator_disaggregation_target import IndicatorDisaggregationTargetSerializer
from .employment import EmploymentSerializer
from .fss import FssSerializer, FssForecastSerializer
from .humanitarian_scope import HumanitarianScopeSerializer
from .iati_export import IatiExportSerializer
from .indicator import (IndicatorSerializer, IndicatorFrameworkSerializer, IndicatorFrameworkLiteSerializer,
                        IndicatorFrameworkNotSoLiteSerializer)
from .indicator_period import IndicatorPeriodSerializer, IndicatorPeriodFrameworkSerializer
from .indicator_period_aggregation_job import IndicatorPeriodAggregationJobSerializer
from .indicator_period_data import (IndicatorPeriodDataSerializer,
                                    IndicatorPeriodDataFrameworkSerializer,
                                    IndicatorPeriodDataCommentSerializer)
from .indicator_period_label import IndicatorPeriodLabelSerializer
from .indicator_custom_field import IndicatorCustomFieldSerializer, IndicatorCustomValueSerializer
from .indicator_dimension_name import IndicatorDimensionNameSerializer
from .indicator_dimension_value import IndicatorDimensionValueSerializer
from .indicator_reference import IndicatorReferenceSerializer
from .keyword import KeywordSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .organisation import OrganisationSerializer, OrganisationBasicSerializer
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
from .organisation_indicator_label import OrganisationIndicatorLabelSerializer
from .organisation_location import OrganisationLocationSerializer
from .partnership import (PartnershipSerializer,
                          PartnershipBasicSerializer,
                          PartnershipRawSerializer,
                          PartnershipRawDeepSerializer)
from .planned_disbursement import (PlannedDisbursementSerializer,
                                   PlannedDisbursementRawDeepSerializer,
                                   PlannedDisbursementRawSerializer)
from .policy_marker import PolicyMarkerSerializer, PolicyMarkerRawSerializer
from .project import (ProjectSerializer, ProjectExtraSerializer,
                      ProjectIatiExportSerializer, ProjectDirectorySerializer, ProjectUpSerializer,
                      ProjectMetadataSerializer, ProjectDirectoryDynamicFieldsSerializer)
from .project_condition import ProjectConditionRawSerializer
from .project_contact import (ProjectContactSerializer,
                              ProjectContactRawSerializer,
                              ProjectContactRawDeepSerializer)
from .project_document import ProjectDocumentSerializer, ProjectDocumentRawSerializer
from .project_hierarchy import ProjectHierarchySerializer
from .project_location import (ProjectLocationSerializer, AdministrativeLocationSerializer,
                               ProjectLocationRawSerializer,
                               ProjectLocationCountryNameSerializer)
from .project_role import ProjectRoleSerializer
from .project_update import (ProjectUpdateSerializer,
                             ProjectUpdateDeepSerializer,
                             ProjectUpdatePhotoSerializer,
                             ProjectUpdateExtraSerializer,)
from .project_update_location import ProjectUpdateLocationSerializer, ProjectUpdateLocationNestedSerializer
from .publishing_status import PublishingStatusSerializer
from .recipient_country import RecipientCountrySerializer, RecipientCountryRawSerializer
from .region import RecipientRegionSerializer, RecipientRegionRawSerializer
from .report import ReportSerializer, ReportFormatSerializer
from .related_project import RelatedProjectSerializer, RelatedProjectRawSerializer
from .result import (ResultSerializer, ResultsFrameworkSerializer, ResultRawSerializer,
                     ResultSerializerV2, ResultsFrameworkLiteSerializer,
                     ResultFrameworkNotSoLiteSerializer)
from .sector import SectorSerializer, SectorRawSerializer
from .transaction import (TransactionSerializer, TransactionSectorSerializer,
                          TransactionRawSerializer, TransactionRawDeepSerializer)
from .typeahead import (TypeaheadOrganisationSerializer,
                        TypeaheadProjectSerializer,
                        TypeaheadProjectUpdateSerializer,
                        TypeaheadSectorSerializer)
from .user import UserSerializer, UserDetailsSerializer, UserPasswordSerializer, UserRawSerializer

__all__ = [
    'AdministrativeLocationSerializer',
    'BudgetItemLabelSerializer',
    'BudgetItemRawSerializer',
    'BudgetItemSerializer',
    'CountrySerializer',
    'CountryBudgetItemSerializer',
    'CrsAddSerializer',
    'CrsAddOtherFlagSerializer',
    'DefaultPeriodSerializer',
    'DisaggregationSerializer',
    'DisaggregationTargetSerializer',
    'ExternalProjectSerializer',
    'IndicatorDisaggregationTargetSerializer',
    'EmploymentSerializer',
    'FssSerializer',
    'FssForecastSerializer',
    'HumanitarianScopeSerializer',
    'IatiExportSerializer',
    'IndicatorCustomFieldSerializer',
    'IndicatorCustomValueSerializer',
    'IndicatorSerializer',
    'IndicatorFrameworkSerializer',
    'IndicatorPeriodAggregationJobSerializer',
    'IndicatorPeriodDataCommentSerializer',
    'IndicatorPeriodDataFrameworkSerializer',
    'IndicatorPeriodDataSerializer',
    'IndicatorPeriodFrameworkSerializer',
    'IndicatorPeriodLabelSerializer',
    'IndicatorPeriodSerializer',
    'IndicatorReferenceSerializer',
    'KeywordSerializer',
    'LegacyDataSerializer',
    'LinkSerializer',
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
    'PlannedDisbursementSerializer',
    'PlannedDisbursementRawSerializer',
    'PlannedDisbursementRawDeepSerializer',
    'PolicyMarkerSerializer',
    'PolicyMarkerRawSerializer',
    'ProjectConditionRawSerializer',
    'ProjectContactSerializer',
    'ProjectContactRawSerializer',
    'ProjectContactRawDeepSerializer',
    'ProjectCustomFieldSerializer',
    'ProjectDocumentSerializer',
    'ProjectDocumentRawSerializer',
    'ProjectExtraSerializer',
    'ProjectIatiExportSerializer',
    'ProjectDirectorySerializer',
    'ProjectDirectoryDynamicFieldsSerializer',
    'ProjectLocationSerializer',
    'ProjectLocationCountryNameSerializer',
    'ProjectLocationRawSerializer',
    'ProjectHierarchySerializer',
    'ProjectMetadataSerializer',
    'ProjectSerializer',
    'ProjectRoleSerializer',
    'ProjectUpdatePhotoSerializer',
    'ProjectUpdateExtraSerializer',
    'ProjectUpdateLocationSerializer',
    'ProjectUpdateLocationNestedSerializer',
    'ProjectUpdateSerializer',
    'ProjectUpdateDeepSerializer',
    'ProjectUpSerializer',
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
    'TypeaheadOrganisationSerializer',
    'TypeaheadProjectSerializer',
    'TypeaheadProjectUpdateSerializer',
    'TypeaheadSectorSerializer',
    'UserDetailsSerializer',
    'UserPasswordSerializer',
    'UserSerializer',
    'UserRawSerializer',
]
