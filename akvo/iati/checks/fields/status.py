# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def status(project):
    """
    Check if a project has a status.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    if project.status:
        return True, [(u'success', u'has status')]

    else:
        return False, [(u'error', u'status missing')]
