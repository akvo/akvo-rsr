# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from akvo.rsr.models.result.utils import QUANTITATIVE

DGIS_VALIDATION_SET_NAME = "DGIS IATI"


def results(project):
    """
    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    DGIS_PROJECT = project.validations.filter(name=DGIS_VALIDATION_SET_NAME).count() == 1

    for result in project.results.all():
        if not result.type:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'result', 'id': result.pk, 'message': 'result has no type specified'})))

        if not result.title:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'result', 'id': result.pk, 'message': 'result has no title specified'})))

        if not result.indicators.exists():
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'result', 'id': result.pk, 'message': 'result has no indicators'})))

        for indicator in result.indicators.all():
            if indicator.type == QUANTITATIVE and not indicator.measure:
                all_checks_passed = False
                checks.append(('error', json.dumps({
                    'model': 'indicator', 'id': indicator.pk, 'result_id': result.pk,
                    'message': 'indicator has no measure specified'})))

            if not indicator.title:
                all_checks_passed = False
                checks.append(('error', json.dumps({
                    'model': 'indicator', 'id': indicator.pk, 'result_id': result.pk,
                    'message': 'indicator has no title specified'})))

            if not indicator.baseline_value:
                if DGIS_PROJECT:
                    all_checks_passed = False
                    checks.append(('warning', json.dumps({
                        'model': 'indicator', 'id': indicator.pk, 'result_id': result.pk,
                        'message': ('indicator baseline has no value specified, however the '
                                    'value of "N/A" has been set for the attribute')})))

                elif indicator.baseline_year or indicator.baseline_comment:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator', 'id': indicator.pk, 'result_id': result.pk,
                        'message': 'indicator baseline has no value specified'})))

            if not indicator.baseline_year:
                if DGIS_PROJECT:
                    all_checks_passed = False
                    checks.append(('warning', json.dumps({
                        'model': 'indicator', 'id': indicator.pk, 'result_id': result.pk,
                        'message': ('indicator baseline has no year specified, '
                                    'however the value of "1" has been set for the attribute')})))

                elif indicator.baseline_value or indicator.baseline_comment:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator', 'id': indicator.pk, 'result_id': result.pk,
                        'message': 'indicator baseline has no year specified'})))

            for reference in indicator.references.all():
                if not reference.reference:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator_reference', 'id': reference.pk,
                        'indicator_id': indicator.pk, 'result_id': result.pk,
                        'message': 'indicator reference has no code specified'})))

                if not reference.vocabulary:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator_reference', 'id': reference.pk,
                        'indicator_id': indicator.pk, 'result_id': result.pk,
                        'message': 'indicator reference has no vocabulary specified'})))

                if reference.vocabulary == '99' and not reference.vocabulary_uri:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator_reference', 'id': reference.pk,
                        'indicator_id': indicator.pk, 'result_id': result.pk,
                        'message': ('indicator reference has vocabulary 99 '
                                    '(reporting organisation) but no vocabulary URI specified')})))

            for period in indicator.periods.all():
                if not period.period_start:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator_period', 'id': period.pk,
                        'indicator_id': indicator.pk, 'result_id': result.pk,
                        'message': 'indicator period has no start date specified'})))

                if not period.period_end:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator_period', 'id': period.pk,
                        'indicator_id': indicator.pk, 'result_id': result.pk,
                        'message': 'indicator period has no end date specified'})))

                if period.period_start and period.period_end and \
                   period.period_start > period.period_end:
                    all_checks_passed = False
                    checks.append(('error', json.dumps({
                        'model': 'indicator_period', 'id': period.pk,
                        'indicator_id': indicator.pk, 'result_id': result.pk,
                        'message': 'indicator period has a start date later than the end date'})))

                if indicator.type == QUANTITATIVE and not period.target_value:
                    if DGIS_PROJECT:
                        all_checks_passed = False
                        checks.append(('warning', json.dumps({
                            'model': 'indicator_period', 'id': period.pk,
                            'indicator_id': indicator.pk, 'result_id': result.pk,
                            'message': ('indicator period has no target value specified. The value'
                                        ' "N/A" has been set for the target value attribute')})))

                    elif (period.target_comment or period.target_locations.all()):
                        all_checks_passed = False
                        checks.append(('error', json.dumps({
                            'model': 'indicator_period', 'id': period.pk,
                            'indicator_id': indicator.pk, 'result_id': result.pk,
                            'message': ('indicator period has no target value, but does have '
                                        'a target comment or target location(s)')})))

                if indicator.type == QUANTITATIVE and not period.actual_value:
                    if DGIS_PROJECT:
                        all_checks_passed = False
                        checks.append(('warning', json.dumps({
                            'model': 'indicator_period', 'id': period.pk,
                            'indicator_id': indicator.pk, 'result_id': result.pk,
                            'message': ('indicator period has no actual value specified. The value'
                                        ' "N/A" has been set for the actual value attribute')})))

                    elif (period.actual_comment or period.actual_locations.all()):
                        all_checks_passed = False
                        checks.append(('error', json.dumps({
                            'model': 'indicator_period', 'id': period.pk,
                            'indicator_id': indicator.pk, 'result_id': result.pk,
                            'message': ('indicator period has no actual value, but does have '
                                        'an actual comment or actual location(s)')})))

    if project.results.all() and all_checks_passed:
        checks.append(('success', 'has valid result(s)'))

    return all_checks_passed, checks
