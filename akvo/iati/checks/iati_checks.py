# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from . import fields


class IatiChecks(object):
    def perform_checks(self):
        """
        Perform all IATI checks.

        :return: All checks passed boolean, [Check results]
        """
        for field in fields.__all__:
            field_check_results = getattr(fields, field)(self.project)

            if not field_check_results[0]:
                self.all_checks_passed = False

            for check_result in field_check_results[1]:
                self.checks_results.append(check_result)

        return self.all_checks_passed, self.checks_results

    def __init__(self, project):
        """
        Initialise the IATI checks object.

        :param project: Project object
        """
        self.project = project
        self.all_checks_passed = True
        self.checks_results = []
