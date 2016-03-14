# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def planned_disbursements(project):
    """
    Check if planned disbursement has start date, end date and a value.
    Check that start date lies before the end date.
    Check if the planned disbursement has a currency if there is not default currency.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for pd in project.planned_disbursements.all():
        if not pd.value:
            all_checks_passed = False
            checks.append((u'error', u'planned disbursement (id: %s) has no amount' % str(pd.pk)))

        if not pd.value_date:
            all_checks_passed = False
            checks.append((u'error', u'planned disbursement (id: %s) has no value date' %
                           str(pd.pk)))

        if not pd.period_start:
            all_checks_passed = False
            checks.append((u'error', u'planned disbursement (id: %s) has no start date' %
                           str(pd.pk)))

        if pd.period_start and pd.period_end and pd.period_start > pd.period_end:
            all_checks_passed = False
            checks.append((u'error', u'planned disbursement (id: %s) has a start date before the '
                                     u'end date' % str(pd.pk)))

        if not (pd.currency or project.currency):
            all_checks_passed = False
            checks.append((u'error', u'planned disbursement (id: %s) has no currency and no '
                                     u'default currency specified' % str(pd.pk)))

    if project.planned_disbursements.all() and all_checks_passed:
        checks.append((u'success', u'has valid planned disbursements'))

    return all_checks_passed, checks
