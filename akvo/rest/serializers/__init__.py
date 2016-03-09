# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


from .benchmark import BenchmarkSerializer
from .benchmark_name import BenchmarknameSerializer
from .budget_item import BudgetItemSerializer, CountryBudgetItemSerializer
from .budget_item_label import BudgetItemLabelSerializer
from .category import CategorySerializer
from .country import CountrySerializer
from .custom_field import OrganisationCustomFieldSerializer, ProjectCustomFieldSerializer
from .employment import EmploymentSerializer
from .focus_area import FocusAreaSerializer
from .goal import GoalSerializer
from .humanitarian_scope import HumanitarianScopeSerializer
from .indicator import (IndicatorSerializer, IndicatorFrameworkSerializer)
from .indicator_period import IndicatorPeriodSerializer, IndicatorPeriodFrameworkSerializer
from .indicator_period_data import (IndicatorPeriodDataSerializer,
                                    IndicatorPeriodDataFrameworkSerializer,
                                    IndicatorPeriodDataCommentSerializer)
from .indicator_reference import IndicatorReferenceSerializer
from .internal_organisation_id import InternalOrganisationIDSerializer
from .invoice import InvoiceSerializer
from .keyword import KeywordSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .organisation import OrganisationSerializer, OrganisationBasicSerializer
from .organisation_location import (OrganisationLocationSerializer,
                                    MapOrganisationLocationSerializer)
from .partner_site import PartnerSiteSerializer
from .partnership import PartnershipSerializer
from .planned_disbursement import PlannedDisbursementSerializer
from .policy_marker import PolicyMarkerSerializer
from .project import ProjectSerializer, ProjectExtraSerializer, ProjectUpSerializer
from .project_comment import ProjectCommentSerializer
from .project_condition import ProjectConditionSerializer
from .project_contact import ProjectContactSerializer
from .project_document import ProjectDocumentSerializer, ProjectDocumentCategorySerializer
from .project_location import (ProjectLocationSerializer, AdministrativeLocationSerializer,
                               MapProjectLocationSerializer)
from .project_update import (ProjectUpdateSerializer,
                             ProjectUpdateExtraSerializer)
from .project_update_location import (ProjectUpdateLocationSerializer,
                                      ProjectUpdateLocationNestedSerializer,
                                      MapProjectUpdateLocationSerializer)
from .publishing_status import PublishingStatusSerializer
from .recipient_country import RecipientCountrySerializer
from .region import RecipientRegionSerializer
from .related_project import RelatedProjectSerializer
from .result import ResultSerializer, ResultsFrameworkSerializer
from .sector import SectorSerializer
from .transaction import TransactionSerializer, TransactionSectorSerializer
from .typeahead import (TypeaheadCountrySerializer,
                        TypeaheadOrganisationSerializer,
                        TypeaheadProjectSerializer,
                        TypeaheadProjectUpdateSerializer)
from .user import UserSerializer, UserDetailsSerializer, UserPasswordSerializer

__all__ = [
    'AdministrativeLocationSerializer',
    'BenchmarknameSerializer',
    'BenchmarkSerializer',
    'BudgetItemLabelSerializer',
    'BudgetItemSerializer',
    'CategorySerializer',
    'CountrySerializer',
    'CountryBudgetItemSerializer',
    'EmploymentSerializer',
    'FocusAreaSerializer',
    'GoalSerializer',
    'HumanitarianScopeSerializer',
    'IndicatorSerializer',
    'IndicatorFrameworkSerializer',
    'IndicatorPeriodSerializer',
    'IndicatorPeriodFrameworkSerializer',
    'IndicatorPeriodDataSerializer',
    'IndicatorPeriodDataFrameworkSerializer',
    'IndicatorPeriodDataCommentSerializer',
    'IndicatorReferenceSerializer',
    'InternalOrganisationIDSerializer',
    'InvoiceSerializer',
    'KeywordSerializer',
    'LegacyDataSerializer',
    'LinkSerializer',
    'MapOrganisationLocationSerializer',
    'MapProjectLocationSerializer',
    'MapProjectUpdateLocationSerializer',
    'OrganisationSerializer',
    'OrganisationBasicSerializer',
    'OrganisationCustomFieldSerializer',
    'OrganisationLocationSerializer',
    'PartnershipSerializer',
    'PartnerSiteSerializer',
    'PlannedDisbursementSerializer',
    'PolicyMarkerSerializer',
    'ProjectCommentSerializer',
    'ProjectConditionSerializer',
    'ProjectContactSerializer',
    'ProjectCustomFieldSerializer',
    'ProjectDocumentSerializer',
    'ProjectDocumentCategorySerializer',
    'ProjectExtraSerializer',
    'ProjectLocationSerializer',
    'ProjectSerializer',
    'ProjectUpdateExtraSerializer',
    'ProjectUpdateLocationSerializer',
    'ProjectUpdateLocationNestedSerializer',
    'ProjectUpdateSerializer',
    'ProjectUpSerializer',
    'PublishingStatusSerializer',
    'RecipientCountrySerializer',
    'RecipientRegionSerializer',
    'RelatedProjectSerializer',
    'ResultSerializer',
    'ResultsFrameworkSerializer',
    'SectorSerializer',
    'TransactionSerializer',
    'TransactionSectorSerializer',
    'TypeaheadCountrySerializer',
    'TypeaheadOrganisationSerializer',
    'TypeaheadProjectSerializer',
    'TypeaheadProjectUpdateSerializer',
    'UserDetailsSerializer',
    'UserPasswordSerializer',
    'UserSerializer',
]
