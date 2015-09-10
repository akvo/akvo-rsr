# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.db.models import get_model

from datetime import datetime

TRUE_VALUES = [
    'true',
    '1',
    't',
    'yes'
]

FALSE_VALUES = [
    'false',
    '0',
    'f',
    'no'
]


def results(activity, project, activities_globals):
    """
    Retrieve and store the result information.
    The results will be extracted from the 'result' elements.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_results = []
    changes = []

    for result in activity.findall('result'):
        result_type = ''
        result_title_text = ''
        result_description_text = ''
        result_aggregation_status = None

        if 'type' in result.attrib.keys() and len(result.attrib['type']) < 2:
            result_type = result.attrib['type']

        result_title_element = result.find('title')
        if not result_title_element is None:
            result_title_text = get_text(result_title_element, activities_globals['version'])[:255]

        result_desc_element = result.find('description')
        if not result_desc_element is None:
            result_description_text = get_text(result_desc_element,
                                               activities_globals['version'])[:2000]

        if 'aggregation-status' in result.attrib.keys():
            result_aggregation_status = result.attrib['aggregation-status']
        if result_aggregation_status and result_aggregation_status.lower() in TRUE_VALUES:
            result_aggregation_status = True
        elif result_aggregation_status and result_aggregation_status.lower() in FALSE_VALUES:
            result_aggregation_status = False

        res, created = get_model('rsr', 'result').objects.get_or_create(
            project=project,
            type=result_type,
            title=result_title_text,
            aggregation_status=result_aggregation_status,
            description=result_description_text
        )

        # Disregard double results
        if not res in imported_results:
            if created:
                changes.append(u'added result (id: %s): %s' % (str(res.pk), res))

            imported_results.append(res)

            # Process indicators
            for ind_change in indicators(result, res, activities_globals):
                changes.append(ind_change)

    for result in project.results.all():
        if not result in imported_results:
            changes.append(u'deleted result (id: %s): %s' %
                           (str(result.pk),
                            result.__unicode__()))
            result.delete()

    return changes


def indicators(result_element, result, activities_globals):
    """
    Retrieve and store the indicator information of a result.
    The indicators will be extracted from the 'indicator' elements.

    :param result_element: ElementTree; contains all data of the result
    :param result: Result instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_indicators = []
    changes = []

    for indicator in result_element.findall('indicator'):
        indicator_measure = ''
        indicator_ascending = None
        indicator_title_text = ''
        indicator_desc_text = ''
        baseline_year = None
        baseline_value = ''
        baseline_comment_text = ''

        if 'measure' in indicator.attrib.keys() and len(indicator.attrib['measure']) < 2:
            indicator_measure = indicator.attrib['measure']

        if 'ascending' in indicator.attrib.keys():
            indicator_ascending = indicator.attrib['ascending']
        if indicator_ascending and indicator_ascending.lower() in TRUE_VALUES:
            indicator_ascending = True
        elif indicator_ascending and indicator_ascending.lower() in FALSE_VALUES:
            indicator_ascending = False

        indicator_title_element = indicator.find('title')
        if not indicator_title_element is None:
            indicator_title_text = get_text(indicator_title_element,
                                            activities_globals['version'])[:255]

        indicator_desc_element = indicator.find('description')
        if not indicator_desc_element is None:
            indicator_desc_text = get_text(indicator_desc_element,
                                           activities_globals['version'])[:2000]

        baseline_element = indicator.find('baseline')
        if not baseline_element is None:
            if 'year' in baseline_element.attrib.keys() and \
                    len(baseline_element.attrib['year']) < 5:
                try:
                    baseline_year = int(baseline_element.attrib['year'])
                except ValueError:
                    pass

            if 'value' in baseline_element.attrib.keys() and \
                    len(baseline_element.attrib['value']) < 51:
                baseline_value = baseline_element.attrib['value']

            baseline_comment = baseline_element.find('comment')
            if not baseline_comment is None:
                baseline_comment_text = get_text(baseline_comment,
                                                 activities_globals['version'])[:2000]

        ind, created = get_model('rsr', 'indicator').objects.get_or_create(
            result=result,
            measure=indicator_measure,
            ascending=indicator_ascending,
            title=indicator_title_text,
            description=indicator_desc_text,
            baseline_year=baseline_year,
            baseline_value=baseline_value,
            baseline_comment=baseline_comment_text
        )

        # Disregard double indicators
        if not ind in imported_indicators:
            if created:
                changes.append(u'added indicator (id: %s): %s' % (str(ind.pk), ind))

            imported_indicators.append(ind)

            # Process indicator periods
            for period_change in indicator_periods(indicator, ind, activities_globals):
                changes.append(period_change)

    for indicator in result.indicators.all():
        if not indicator in imported_indicators:
            changes.append(u'deleted indicator (id: %s): %s' %
                           (str(indicator.pk),
                            indicator.__unicode__()))
            indicator.delete()

    return changes


def indicator_periods(indicator_element, indicator, activities_globals):
    """
    Retrieve and store the indicator period information of an indicator.
    The indicator periods will be extracted from the 'period' elements.

    :param indicator_element: ElementTree; contains all data of the indicator
    :param indicator: Indicator instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_periods = []
    changes = []

    for period in indicator_element.findall('period'):
        period_start = None
        period_end = None
        target_value = ''
        target_comment = ''
        actual_value = ''
        actual_comment = ''

        pstart_elem = period.find('period-start')
        if not pstart_elem is None and 'iso-date' in pstart_elem.attrib.keys():
            try:
                period_start = datetime.strptime(pstart_elem.attrib['iso-date'], '%Y-%m-%d').date()
            except ValueError:
                pass

        pend_element = period.find('period-end')
        if not pend_element is None and 'iso-date' in pend_element.attrib.keys():
            try:
                period_end = datetime.strptime(pend_element.attrib['iso-date'], '%Y-%m-%d').date()
            except ValueError:
                pass

        target_element = period.find('target')
        if not target_element is None:
            if 'value' in target_element.attrib.keys() and len(target_element.attrib['value']) < 51:
                target_value = target_element.attrib['value']

            target_comment_element = target_element.find('comment')
            if not target_comment_element is None:
                target_comment = get_text(target_comment_element,
                                          activities_globals['version'])[:2000]

        actual_element = period.find('actual')
        if not actual_element is None:
            if 'value' in actual_element.attrib.keys() and len(actual_element.attrib['value']) < 51:
                actual_value = actual_element.attrib['value']

            actual_comment_element = actual_element.find('comment')
            if not actual_comment_element is None:
                actual_comment = get_text(actual_comment_element,
                                          activities_globals['version'])[:2000]

        per, created = get_model('rsr', 'indicatorperiod').objects.get_or_create(
            indicator=indicator,
            period_start=period_start,
            period_end=period_end,
            target_value=target_value,
            target_comment=target_comment,
            actual_value=actual_value,
            actual_comment=actual_comment
        )

        if created:
            changes.append(u'added indicator period (id: %s): %s' % (str(per.pk), per))

        imported_periods.append(per)

    for indicator_period in indicator.periods.all():
        if not indicator_period in imported_periods:
            changes.append(u'deleted indicator period (id: %s): %s' %
                           (str(indicator_period.pk),
                            indicator_period.__unicode__()))
            indicator_period.delete()

    return changes
