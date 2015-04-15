# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import checks


def check_export_fields(project, version='2.01'):
    """
    :param project: Project object
    :param version: String of IATI version
    :return: List of checks
    """
    # TODO: Add check for IATI versions (generic)
    version_file = "V%sChecks" % version.replace('.', '')
    project_checks = getattr(checks, version_file)(project)
    project_checks.execute_all_checks()
    return project_checks.all_checks_passed, project_checks.checks_results
