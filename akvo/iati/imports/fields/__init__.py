# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .dates import actual_end_date, actual_start_date, planned_end_date, planned_start_date
from .defaults import (currency, default_aid_type, default_finance_type, default_flow_type,
                       default_tied_status, hierarchy, language, scope)
from .descriptions import (background, current_status, goals_overview, project_plan,
                           project_plan_summary, sustainability, target_group)
from .image import current_image
from .partnerships import partnerships
from .related_projects import related_projects
from .status import status
from .titles import title, subtitle

__all__ = [
    'actual_end_date',
    'actual_start_date',
    'background',
    'currency',
    'current_image',
    'current_status',
    'default_aid_type',
    'default_finance_type',
    'default_flow_type',
    'default_tied_status',
    'goals_overview',
    'hierarchy',
    'language',
    'partnerships',
    'planned_end_date',
    'planned_start_date',
    'project_plan',
    'project_plan_summary',
    'related_projects',
    'scope',
    'status',
    'subtitle',
    'sustainability',
    'target_group',
    'title',
]
