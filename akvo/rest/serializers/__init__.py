# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .benchmark import BenchmarkSerializer
from .benchmark_name import BenchmarknameSerializer
from .budget_item import BudgetItemSerializer
from .budget_item_label import BudgetItemLabelSerializer
from .category import CategorySerializer
from .country import CountrySerializer
from .employment import EmploymentSerializer
from .focus_area import FocusAreaSerializer
from .goal import GoalSerializer
from .indicator import IndicatorPeriodSerializer, IndicatorSerializer
from .internal_organisation_id import InternalOrganisationIDSerializer
from .invoice import InvoiceSerializer
from .keyword import KeywordSerializer
from .legacy_data import LegacyDataSerializer
from .link import LinkSerializer
from .organisation import OrganisationSerializer
from .organisation_location import OrganisationLocationSerializer
from .partner_site import PartnerSiteSerializer
from .partner_type import PartnerTypeSerializer
from .partnership import PartnershipSerializer
from .planned_disbursement import PlannedDisbursementSerializer
from .policy_marker import PolicyMarkerSerializer
from .project import ProjectSerializer, ProjectExtraSerializer
from .project_comment import ProjectCommentSerializer
from .project_condition import ProjectConditionSerializer
from .project_contact import ProjectContactSerializer
from .project_document import ProjectDocumentSerializer
from .project_location import ProjectLocationSerializer
from .project_update import ProjectUpdateSerializer, ProjectUpdateExtraSerializer
from .project_update_location import ProjectUpdateLocationSerializer
from .publishing_status import PublishingStatusSerializer
from .recipient_country import RecipientCountrySerializer
from .region import RecipientRegionSerializer
from .related_project import RelatedProjectSerializer
from .result import ResultSerializer
from .sector import SectorSerializer
from .transaction import TransactionSerializer
from .user import UserSerializer, UserDetailsSerializer, UserPasswordSerializer
from .project import ProjectSerializer, ProjectExtraSerializer

__all__ = [
    'BenchmarkSerializer',
    'BenchmarknameSerializer',
    'BudgetItemSerializer',
    'BudgetItemLabelSerializer',
    'CategorySerializer',
    'CountrySerializer',
    'EmploymentSerializer',
    'FocusAreaSerializer',
    'GoalSerializer',
    'IndicatorPeriodSerializer',
    'IndicatorSerializer',
    'InternalOrganisationIDSerializer',
    'InvoiceSerializer',
    'KeywordSerializer',
    'LegacyDataSerializer',
    'LinkSerializer',
    'OrganisationSerializer',
    'OrganisationLocationSerializer',
    'PartnerSiteSerializer',
    'PartnerTypeSerializer',
    'PartnershipSerializer',
    'PlannedDisbursementSerializer',
    'PolicyMarkerSerializer',
    'ProjectSerializer',
    'ProjectExtraSerializer',
    'ProjectCommentSerializer',
    'ProjectConditionSerializer',
    'ProjectContactSerializer',
    'ProjectDocumentSerializer',
    'ProjectLocationSerializer',
    'ProjectUpdateSerializer',
    'ProjectUpdateExtraSerializer',
    'ProjectUpdateLocationSerializer',
    'PublishingStatusSerializer',
    'RecipientCountrySerializer',
    'RecipientRegionSerializer',
    'RelatedProjectSerializer',
    'ResultSerializer',
    'SectorSerializer',
    'TransactionSerializer',
    'UserSerializer',
    'UserDetailsSerializer',
    'UserPasswordSerializer',
    'ProjectSerializer',
    'ProjectExtraSerializer',
]
