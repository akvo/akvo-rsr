# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from .benchmark import BenchmarkViewSet
from .benchmark_name import BenchmarknameViewSet
from .budget_item import BudgetItemViewSet
from .budget_item_label import BudgetItemLabelViewSet
from .category import CategoryViewSet
from .country import CountryViewSet
from .employment import EmploymentViewSet, approve_employment, set_group
from .focus_area import FocusAreaViewSet
from .goal import GoalViewSet
from .indicator import IndicatorViewSet, IndicatorPeriodViewSet
from .internal_organisation_id import InternalOrganisationIDViewSet
from .invoice import InvoiceViewSet
from .keyword import KeywordViewSet
from .legacy_data import LegacyDataViewSet
from .link import LinkViewSet
from .organisation import OrganisationViewSet
from .organisation_location import OrganisationLocationViewSet
from .partner_site import PartnerSiteViewSet
from .partner_type import PartnerTypeViewSet
from .partnership import PartnershipViewSet
from .planned_disbursement import PlannedDisbursementViewSet
from .policy_marker import PolicyMarkerViewSet
from .project import ProjectViewSet, ProjectExtraViewSet
from .project_comment import ProjectCommentViewSet
from .project_condition import ProjectConditionViewSet
from .project_contact import ProjectContactViewSet
from .project_location import ProjectLocationViewSet
from .project_update import ProjectUpdateViewSet, ProjectUpdateExtraViewSet
from .project_update_location import ProjectUpdateLocationViewSet
from .publishing_status import PublishingStatusViewSet
from .recipient_country import RecipientCountryViewSet
from .related_project import RelatedProjectViewSet
from .region import RecipientRegionViewSet
from .result import ResultViewSet
from .sector import SectorViewSet
from .transaction import TransactionViewSet
from .user import UserViewSet, change_password, update_details, request_organisation

__all__ = [
    'BenchmarkViewSet',
    'BenchmarknameViewSet',
    'BudgetItemViewSet',
    'BudgetItemLabelViewSet',
    'CategoryViewSet',
    'CountryViewSet',
    'EmploymentViewSet',
    'approve_employment',
    'set_group',
    'FocusAreaViewSet',
    'GoalViewSet',
    'IndicatorViewSet',
    'IndicatorPeriodViewSet',
    'InternalOrganisationIDViewSet',
    'InvoiceViewSet',
    'KeywordViewSet',
    'LegacyDataViewSet',
    'LinkViewSet',
    'OrganisationViewSet',
    'OrganisationLocationViewSet',
    'PartnerSiteViewSet',
    'PartnerTypeViewSet',
    'PartnershipViewSet',
    'PlannedDisbursementViewSet',
    'PolicyMarkerViewSet',
    'ProjectViewSet',
    'ProjectExtraViewSet',
    'ProjectCommentViewSet',
    'ProjectConditionViewSet',
    'ProjectContactViewSet',
    'ProjectLocationViewSet',
    'ProjectUpdateLocationViewSet',
    'ProjectUpdateViewSet',
    'ProjectUpdateExtraViewSet',
    'PublishingStatusViewSet',
    'RecipientCountryViewSet',
    'RecipientRegionViewSet',
    'RelatedProjectViewSet',
    'ResultViewSet',
    'SectorViewSet',
    'TransactionViewSet',
    'UserViewSet',
    'change_password',
    'update_details',
    'request_organisation',
]
