# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date


def dates(project):
    """
    Check if a date start planned or actual is present.
    Check if the actual dates are today, or in the past.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    if project.date_start_planned or project.date_start_actual:
        checks.append(('success', 'has planned or actual start date'))

    else:
        all_checks_passed = False
        checks.append(('error', 'planned or actual start date missing'))

    if project.date_start_actual and project.date_start_actual > date.today():
        all_checks_passed = False
        checks.append(('error', 'actual start date must be in the past'))

    if project.date_end_actual and project.date_end_actual > date.today():
        all_checks_passed = False
        checks.append(('error', 'actual end date must be in the past'))

    return all_checks_passed, checks
