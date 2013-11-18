# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from .benchmark import BenchmarknameResource, BenchmarkResource, IATIBenchmarkResource
from .budget_item import BudgetItemLabelResource, BudgetItemResource, IATIBudgetItemResource
from .category import CategoryResource, IATICategoryResource
from .country import CountryResource
from .focus_area import FocusAreaResource
from .goal import GoalResource, IATIGoalResource
from .invoice import InvoiceResource
from .link import LinkResource
from .location import IATIProjectLocationResource, OrganisationLocationResource, ProjectLocationResource, ProjectMapLocationResource
from .map import OrganisationMapResource, ProjectMapResource
from .organisation import OrganisationResource
from .partnership import PartnershipResource, IATIPartnershipResource
from .project import ProjectResource, IATIProjectResource
from .project_comment import ProjectCommentResource
from .project_update import ProjectUpdateResource
from .right_now_in_akvo import RightNowInAkvoResource
from .user import UserResource
from .user_profile import UserProfileResource

__all__ = [
    'BenchmarkResource',
    'BenchmarknameResource',
    'BudgetItemResource',
    'BudgetItemLabelResource',
    'CategoryResource',
    'CountryResource',
    'FocusAreaResource',
    'GoalResource',
    'IATIBenchmarkResource',
    'IATIBudgetItemResource',
    'IATICategoryResource',
    'IATIGoalResource',
    'IATIPartnershipResource',
    'IATIProjectLocationResource',
    'IATIProjectResource',
    'InvoiceResource',
    'LinkResource',
    'OrganisationResource',
    'OrganisationLocationResource',
    'OrganisationMapLocationResource',
    'OrganisationMapResource',
    'PartnershipResource',
    'ProjectResource',
    'ProjectCommentResource',
    'ProjectLocationResource',
    'ProjectMapLocationResource',
    'ProjectMapResource',
    'ProjectUpdateResource',
    'RightNowInAkvoResource',
    'UserResource',
    'UserProfileResource',
]

