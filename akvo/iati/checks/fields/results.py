# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def results(project):
    """
    Check if result has a type, title and at least one indicator.
    Check if indicator has a measure and title.
    Check if indicator baseline has year and value.
    Check if indicator period has a start and end date, and start before end.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for result in project.results.all():
        if not result.type:
            all_checks_passed = False
            checks.append((u'error', u'result (id: %s) has no type specified' % str(result.pk)))

        if not result.title:
            all_checks_passed = False
            checks.append((u'error', u'result (id: %s) has no title specified' % str(result.pk)))

        if not result.indicators.all():
            all_checks_passed = False
            checks.append((u'error', u'result (id: %s) has no indicator(s)' % str(result.pk)))

        for indicator in result.indicators.all():
            if not indicator.measure:
                all_checks_passed = False
                checks.append((u'error', u'indicator (id: %s) has no measure specified' %
                               str(indicator.pk)))

            if not indicator.title:
                all_checks_passed = False
                checks.append((u'error', u'indicator (id: %s) has no title specified' %
                               str(indicator.pk)))

            if (indicator.baseline_value and not indicator.baseline_year) or \
                    (not indicator.baseline_value and indicator.baseline_year):
                all_checks_passed = False
                checks.append((u'error', u'indicator (id: %s) baseline has no value or year '
                                         u'specified' % str(indicator.pk)))

            for period in indicator.periods.all():
                if not period.period_start:
                    all_checks_passed = False
                    checks.append((u'error', u'indicator period (id: %s) has no start date '
                                             u'specified' % str(period.pk)))

                if not period.period_end:
                    all_checks_passed = False
                    checks.append((u'error', u'indicator period (id: %s) has no end date '
                                             u'specified' % str(period.pk)))

                if period.period_start and period.period_end and \
                        period.period_start > period.period_end:
                    all_checks_passed = False
                    checks.append((u'error', u'indicator period (id: %s) has a start date '
                                             u'later than the end date' % str(period.pk)))

    if project.results.all() and all_checks_passed:
        checks.append((u'success', u'has valid result(s)'))

    return all_checks_passed, checks
