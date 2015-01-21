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
from .internal_organisation_id import InternalOrganisationIDSerializer
from .invoice import InvoiceSerializer
from .link import LinkSerializer
from .organisation import OrganisationSerializer
from .organisation_location import OrganisationLocationSerializer
from .partner_site import PartnerSiteSerializer
from .partner_type import PartnerTypeSerializer
from .partnership import PartnershipSerializer
from .project import ProjectSerializer, ProjectExtraSerializer
from .project_comment import ProjectCommentSerializer
from .project_location import ProjectLocationSerializer
from .project_update import ProjectUpdateSerializer, ProjectUpdateExtraSerializer
from .project_update_location import ProjectUpdateLocationSerializer
from .publishing_status import PublishingStatusSerializer
from .user import UserSerializer, UserDetailsSerializer, UserPasswordSerializer

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
    'InternalOrganisationIDSerializer',
    'InvoiceSerializer',
    'LinkSerializer',
    'OrganisationSerializer',
    'OrganisationLocationSerializer',
    'PartnerSiteSerializer',
    'PartnerTypeSerializer',
    'PartnershipSerializer',
    'ProjectSerializer',
    'ProjectExtraSerializer',
    'ProjectCommentSerializer',
    'ProjectLocationSerializer',
    'ProjectUpdateSerializer',
    'ProjectUpdateExtraSerializer',
    'ProjectUpdateLocationSerializer',
    'PublishingStatusSerializer',
    'UserSerializer',
    'UserDetailsSerializer',
    'UserPasswordSerializer',
]
