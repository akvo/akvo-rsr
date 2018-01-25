# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.result.utils import QUALITATIVE

DGIS_VALIDATION_SET_ID = 3


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

    DGIS_PROJECT = project.validations.filter(pk=DGIS_VALIDATION_SET_ID).count() == 1

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
            if indicator.type != QUALITATIVE and not indicator.measure:
                all_checks_passed = False
                checks.append((u'error', u'indicator (id: %s) has no measure specified' %
                               str(indicator.pk)))

            if not indicator.title:
                all_checks_passed = False
                checks.append((u'error', u'indicator (id: %s) has no title specified' %
                               str(indicator.pk)))

            if (not indicator.baseline_value and
                    (indicator.baseline_year or indicator.baseline_comment)):
                all_checks_passed = False
                if DGIS_PROJECT:
                    checks.append((u'warning', u'indicator (id: %s) baseline has no value '
                                               u'specified, however the value of "N/A" has been '
                                               u'set for the attribute' % str(indicator.pk)))
                else:
                    checks.append((u'error', u'indicator (id: %s) baseline has no value specified' %
                                   str(indicator.pk)))

            if (not indicator.baseline_year and
                    (indicator.baseline_value or indicator.baseline_comment)):
                all_checks_passed = False
                if DGIS_PROJECT:
                    checks.append((u'warning', u'indicator (id: %s) baseline has no year '
                                               u'specified, however the value of "N/A" has been '
                                               u'set for the attribute' % str(indicator.pk)))
                else:
                    checks.append((u'error', u'indicator (id: %s) baseline has no year specified' %
                                   str(indicator.pk)))

            for reference in indicator.references.all():
                if not reference.reference:
                    all_checks_passed = False
                    checks.append((u'error', u'indicator reference (id: %s) has no code '
                                             u'specified' % str(reference.pk)))

                if not reference.vocabulary:
                    all_checks_passed = False
                    checks.append((u'error', u'indicator reference (id: %s) has no vocabulary '
                                             u'specified' % str(reference.pk)))

                if reference.vocabulary == '99' and not reference.vocabulary_uri:
                    all_checks_passed = False
                    checks.append((u'error', u'indicator reference (id: %s) has vocabulary 99 '
                                             u'(reporting organisation) but no vocabulary URI '
                                             u'specified' % str(reference.pk)))

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

                if not period.target_value:
                    if DGIS_PROJECT:
                        all_checks_passed = False
                        checks.append((u'warning', u'indicator period (id: %s) has no target value '
                                                   u'specified. The value "N/A" has been set for '
                                                   u'the target value attribute' % str(indicator.pk)))
                    elif (period.target_comment or period.target_locations.all() or
                          period.target_dimensions.all()):
                        all_checks_passed = False
                        checks.append((u'error', u'indicator period (id: %s) has no target value, '
                                                 u'but does have a target comment, target '
                                                 u'location(s) or target dimension(s)' %
                                       str(period.pk)))

                if not period.actual_value:
                    if DGIS_PROJECT:
                        all_checks_passed = False
                        checks.append((u'warning', u'indicator period (id: %s) has no actual value '
                                                   u'specified. The value "N/A" has been set for '
                                                   u'the actual value attribute' % str(indicator.pk)))
                    elif (period.actual_comment or period.actual_locations.all() or
                          period.actual_dimensions.all()):
                        all_checks_passed = False
                        checks.append((u'error', u'indicator period (id: %s) has no actual value, '
                                                 u'but does have a actual comment, actual '
                                                 u'location(s) or actual dimension(s)' %
                                       str(period.pk)))

    if project.results.all() and all_checks_passed:
        checks.append((u'success', u'has valid result(s)'))

    return all_checks_passed, checks
