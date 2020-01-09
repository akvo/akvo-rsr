# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def title(project):
    """
    Check if a project has a title.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    if project.title:
        return True, [('success', 'has title')]

    else:
        return False, [('error', 'title missing')]
