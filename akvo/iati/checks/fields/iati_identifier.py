# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def iati_identifier(project):
    """
    Check if a project has an IATI identifier.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    if project.iati_activity_id:
        return True, [('success', 'has IATI identifier')]

    else:
        return False, [('error', 'IATI identifier missing')]
