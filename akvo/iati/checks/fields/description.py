# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def description(project):
    """
    Check if a project has a description field.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    if project.subtitle or project.project_plan_summary or project.background or \
            project.project_plan or project.current_status or project.sustainability or \
            project.goals_overview or project.target_group or project.project_updates.all():
        return True, [('success', 'has description field(s)')]

    else:
        return False, [('error', 'description field(s) missing')]
