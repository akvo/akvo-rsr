# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.indicator import Indicator, IndicatorPeriod
from ....rsr.models.result import Result

from ..utils import ImportHelper


class Results(ImportHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(Results, self).__init__(iati_import, parent_elem, project, globals, related_obj)
        self.model = Result

    def do_import(self):
        """
        Retrieve and store the result information.
        The results will be extracted from the 'result' elements.

        :return: List; contains fields that have changed
        """
        imported_results = []
        changes = []

        for result in self.parent_elem.findall('result'):

            result_type = self.get_attrib(result, 'type', 'type')
            title = self.get_child_element_text(result, 'title', 'title')
            description = self.get_child_element_text(result, 'description', 'description')

            aggregation_status = self.get_attrib(result, 'aggregation-status', 'aggregation_status')
            aggregation_status = self.to_boolean(aggregation_status)

            result_obj, created = Result.objects.get_or_create(
                project=self.project,
                type=result_type,
                title=title,
                aggregation_status=aggregation_status,
                description=description
            )
            # Disregard double results
            if not result_obj in imported_results:
                if created:
                    changes.append(u'added result (id: {}): {}'.format(result_obj.pk, result_obj))
                imported_results.append(result_obj)

                # Process indicators
                indicators = Indicators(
                    self.iati_import, result, self.project, self.globals, related_obj=result_obj)
                for indicator_change in indicators.do_import():
                    changes.append(indicator_change)

        changes += self.delete_objects(self.project.results, imported_results, 'result')
        return changes


class Indicators(ImportHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(Indicators, self).__init__(iati_import, parent_elem, project, globals, related_obj)
        self.model = Indicator

    def do_import(self):
        """
        Retrieve and store the indicator information of a result.
        The indicators will be extracted from the 'indicator' elements.

        :return: List; contains fields that have changed
        """
        imported_indicators = []
        changes = []

        for indicator in self.parent_elem.findall('indicator'):

            measure = self.get_attrib(indicator, 'measure', 'measure')

            ascending = self.get_attrib(indicator, 'ascending', 'ascending')
            ascending = self.to_boolean(ascending)

            title = self.get_child_element_text(indicator, 'title', 'title')
            description = self.get_child_element_text(indicator, 'description', 'description')

            baseline_element = indicator.find('baseline')
            if baseline_element is not None:
                baseline_year = self.get_attrib(baseline_element, 'year', 'baseline_year', None)
                baseline_value = self.get_attrib(baseline_element, 'value', 'baseline_value')
                baseline_comment = self.get_child_element_text(
                        baseline_element, 'comment', 'baseline_comment')
            else:
                baseline_year = None,
                baseline_value = '',
                baseline_comment = ''

            indicator_obj, created = Indicator.objects.get_or_create(
                result=self.related_obj,
                measure=measure,
                ascending=ascending,
                title=title,
                description=description,
                baseline_year=baseline_year,
                baseline_value=baseline_value,
                baseline_comment=baseline_comment
            )
            # Disregard double indicators
            if not indicator_obj in imported_indicators:
                if created:
                    changes.append(u'added indicator (id: {}): {}'.format(
                            indicator_obj.pk, indicator_obj))
                imported_indicators.append(indicator_obj)

                # Process indicator periods
                indicator_periods = IndicatorPeriods(
                    self.iati_import, indicator, self.project, self.globals,
                    related_obj=indicator_obj)
                for period_change in indicator_periods.do_import():
                    changes.append(period_change)

        changes += self.delete_objects(self.related_obj.indicators, imported_indicators, 'indicator')
        return changes


class IndicatorPeriods(ImportHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(IndicatorPeriods, self).__init__(iati_import, parent_elem, project, globals, related_obj)
        self.model = IndicatorPeriod

    def do_import(self):
        """
        Retrieve and store the indicator period information of an indicator.
        The indicator periods will be extracted from the 'period' elements.

        :return: List; contains fields that have changed
        """
        imported_periods = []
        changes = []

        for period in self.parent_elem.findall('period'):

            period_start = self.get_child_as_date(
                    period, 'period-start', 'iso-date', 'period_start')
            period_end = self.get_child_as_date(period, 'period-end', 'iso-date', 'period_end')

            target_element = period.find('target')
            if target_element is not None:
                target_value = self.get_child_elem_attrib(period, 'target', 'value', 'target_value')
                target_comment = self.get_child_element_text(
                        target_element, 'comment', 'target_comment')
            else:
                target_value = ''
                target_comment = ''

            actual_element = period.find('actual')
            if actual_element is not None:
                actual_value = self.get_child_elem_attrib(period, 'actual', 'value', 'actual_value')
                actual_comment = self.get_child_element_text(
                        actual_element, 'comment', 'actual_comment')
            else:
                actual_value = ''
                actual_comment = ''

            period_obj, created = IndicatorPeriod.objects.get_or_create(
                indicator=self.related_obj,
                period_start=period_start,
                period_end=period_end,
                target_value=target_value,
                target_comment=target_comment,
                actual_value=actual_value,
                actual_comment=actual_comment
            )
            if created:
                changes.append(u'added indicator period (id: {}): {}'.format(
                        period_obj.pk, period_obj))
            imported_periods.append(period_obj)

        changes += self.delete_objects(self.related_obj.periods, imported_periods, 'indicator period')
        return changes
