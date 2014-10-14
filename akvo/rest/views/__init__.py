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
from .employment import EmploymentViewSet
from .focus_area import FocusAreaViewSet
from .goal import GoalViewSet
from .internal_organisation_id import InternalOrganisationIDViewSet
from .invoice import InvoiceViewSet
from .link import LinkViewSet
from .organisation import OrganisationViewSet
from .organisation_location import OrganisationLocationViewSet
from .partner_site import PartnerSiteViewSet
from .partner_type import PartnerTypeViewSet
from .partnership import PartnershipViewSet
from .project import ProjectViewSet
from .project_comment import ProjectCommentViewSet
from .project_location import ProjectLocationViewSet
from .project_update import ProjectUpdateViewSet, ProjectUpdateExtraViewSet
from .project_update_location import ProjectUpdateLocationViewSet
from .publishing_status import PublishingStatusViewSet
from .user import UserViewSet

__all__ = [
    'BenchmarkViewSet',
    'BenchmarknameViewSet',
    'BudgetItemViewSet',
    'BudgetItemLabelViewSet',
    'CategoryViewSet',
    'CountryViewSet',
    'EmploymentViewSet',
    'FocusAreaViewSet',
    'GoalViewSet',
    'InternalOrganisationIDViewSet',
    'InvoiceViewSet',
    'LinkViewSet',
    'OrganisationViewSet',
    'OrganisationLocationViewSet',
    'PartnerSiteViewSet',
    'PartnerTypeViewSet',
    'PartnershipViewSet',
    'ProjectViewSet',
    'ProjectCommentViewSet',
    'ProjectLocationViewSet',
    'ProjectUpdateLocationViewSet',
    'ProjectUpdateViewSet',
    'ProjectUpdateExtraViewSet',
    'PublishingStatusViewSet',
    'UserViewSet'
]