# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.indicator import Indicator, IndicatorPeriod
from ....rsr.models.result import Result

from ..utils import add_log, get_text, ImporterHelper

# from datetime import datetime


class Results(ImporterHelper):

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
            # result_type = ''
            # result_title_text = ''
            # result_description_text = ''
            # result_aggregation_status = None

            result_type = self.get_attrib(result, 'type', 'type')
            # if 'type' in result.attrib.keys():
            #     if not len(result.attrib['type']) > 1:
            #         result_type = result.attrib['type']
            #     else:
            #         add_log(iati_import, 'result_type', 'type too long (1 character allowed)', project)

            title = self.get_child_element_text(result, 'title', 'title')
            # result_title_element = result.find('title')
            # if not result_title_element is None:
            #     result_title_text = get_text(result_title_element, activities_globals['version'])
            #     if len(result_title_text) > 255:
            #         add_log(iati_import, 'result_title', 'title too long (255 characters allowed)',
            #                 project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         result_title_text = result_title_text[:255]

            description = self.get_child_element_text(result, 'description', 'description')
            # result_desc_element = result.find('description')
            # if not result_desc_element is None:
            #     result_description_text = get_text(result_desc_element, activities_globals['version'])
            #     if len(result_description_text) > 2000:
            #         add_log(iati_import, 'result_description',
            #                 'description too long (2000 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         result_description_text = result_description_text[:2000]

            aggregation_status = self.get_attrib(result, 'aggregation-status', 'aggregation_status')
            aggregation_status = self.to_boolean(aggregation_status)

            # if 'aggregation-status' in result.attrib.keys():
            #     result_aggregation_status = result.attrib['aggregation-status']
            # if result_aggregation_status and result_aggregation_status.lower() in TRUE_VALUES:
            #     result_aggregation_status = True
            # elif result_aggregation_status and result_aggregation_status.lower() in FALSE_VALUES:
            #     result_aggregation_status = False

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
                # for ind_change in indicators(iati_import, result, result_obj, activities_globals):
                #     changes.append(ind_change)

        changes += self.delete_objects(self.project.results, imported_results, 'result')
        # for result in self.project.results.all():
        #     if not result in imported_results:
        #         changes.append(u'deleted result (id: %s): {}'.format(
        #                 result.pk, result.__unicode__()))
        #         result.delete()
        return changes


class Indicators(ImporterHelper):

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
            # indicator_measure = ''
            # indicator_ascending = None
            # indicator_title_text = ''
            # indicator_desc_text = ''
            # baseline_year = None
            # baseline_value = ''
            # baseline_comment_text = ''

            measure = self.get_attrib(indicator, 'measure', 'measure')
            # if 'measure' in indicator.attrib.keys():
            #     if not len(indicator.attrib['measure']) > 1:
            #         indicator_measure = indicator.attrib['measure']
            #     else:
            #         add_log(iati_import, 'indicator_measure', 'measure too long (1 character allowed)',
            #                 result.project)

            ascending = self.get_attrib(indicator, 'ascending', 'ascending')
            ascending = self.to_boolean(ascending)
            #
            # if 'ascending' in indicator.attrib.keys():
            #     indicator_ascending = indicator.attrib['ascending']
            # if indicator_ascending and indicator_ascending.lower() in TRUE_VALUES:
            #     indicator_ascending = True
            # elif indicator_ascending and indicator_ascending.lower() in FALSE_VALUES:
            #     indicator_ascending = False

            title = self.get_child_element_text(indicator, 'title', 'title')
            # indicator_title_element = indicator.find('title')
            # if not indicator_title_element is None:
            #     indicator_title_text = get_text(indicator_title_element, activities_globals['version'])
            #     if len(indicator_title_text) > 255:
            #         add_log(iati_import, 'indicator_title', 'title too long (255 characters allowed)',
            #                 result.project, IatiImportLog.VALUE_PARTLY_SAVED)
            #         indicator_title_text = indicator_title_text[:255]

            description = self.get_child_element_text(indicator, 'description', 'description')
            # indicator_desc_element = indicator.find('description')
            # if not indicator_desc_element is None:
            #     indicator_desc_text = get_text(indicator_desc_element, activities_globals['version'])
            #     if len(indicator_desc_text) > 2000:
            #         add_log(iati_import, 'indicator_description',
            #                 'description too long (2000 characters allowed)', result.project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         indicator_desc_text = indicator_desc_text[:2000]

            baseline_element = indicator.find('baseline')
            if baseline_element is not None:
                baseline_year = self.get_attrib(baseline_element, 'year', 'baseline_year', None)
                # if 'year' in baseline_element.attrib.keys():
                #     if not len(baseline_element.attrib['year']) > 4:
                #         try:
                #             baseline_year = int(baseline_element.attrib['year'])
                #         except ValueError as e:
                #             add_log(iati_import, 'indicator_baseline_year', str(e), result.project)
                #     else:
                #         add_log(iati_import, 'indicator_baseline_year',
                #                 'year too long (4 characters allowed)', result.project)

                baseline_value = self.get_attrib(baseline_element, 'value', 'baseline_value')
                # if 'value' in baseline_element.attrib.keys():
                #     if not len(baseline_element.attrib['value']) > 50:
                #         baseline_value = baseline_element.attrib['value']
                #     else:
                #         add_log(iati_import, 'indicator_baseline_value',
                #                 'value too long (50 characters allowed)', result.project)
                baseline_comment = self.get_child_element_text(
                        baseline_element, 'comment', 'baseline_comment')
                # baseline_comment = baseline_element.find('comment')
                # if not baseline_comment is None:
                #     baseline_comment_text = get_text(baseline_comment, activities_globals['version'])
                #     if len(baseline_comment_text) > 2000:
                #         add_log(iati_import, 'indicator_baseline_comment',
                #                 'comment too long (2000 characters allowed)', result.project,
                #                 IatiImportLog.VALUE_PARTLY_SAVED)
                #         baseline_comment_text = baseline_comment_text[:2000]
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
                #
                # for period_change in indicator_periods(iati_import, indicator, indicator_obj, activities_globals):
                #     changes.append(period_change)

        changes += self.delete_objects(self.related_obj.indicators, imported_indicators, 'indicator')
        # for indicator in self.related_obj.indicators.all():
        #     if not indicator in imported_indicators:
        #         changes.append(u'deleted indicator (id: {}): {}'.format(
        #                 indicator.pk, indicator.__unicode__()))
        #         indicator.delete()

        return changes


class IndicatorPeriods(ImporterHelper):

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
            # period_start = None
            # period_end = None
            # target_value = ''
            # target_comment = ''
            # actual_value = ''
            # actual_comment = ''

            period_start = self.get_child_as_date(
                    period, 'period-start', 'iso-date', 'period_start')
            # pstart_elem = period.find('period-start')
            # if not pstart_elem is None and 'iso-date' in pstart_elem.attrib.keys():
            #     try:
            #         period_start = datetime.strptime(pstart_elem.attrib['iso-date'], '%Y-%m-%d').date()
            #     except ValueError as e:
            #         add_log(iati_import, 'indicator_period_start', str(e), indicator.result.project)

            period_end = self.get_child_as_date(period, 'period-end', 'iso-date', 'period_end')
            # pend_element = period.find('period-end')
            # if not pend_element is None and 'iso-date' in pend_element.attrib.keys():
            #     try:
            #         period_end = datetime.strptime(pend_element.attrib['iso-date'], '%Y-%m-%d').date()
            #     except ValueError as e:
            #         add_log(iati_import, 'indicator_period_end', str(e), indicator.result.project)


            target_element = period.find('target')
            if target_element is not None:
                target_value = self.get_child_elem_attrib(period, 'target', 'value', 'target_value')
                target_comment = self.get_child_element_text(
                        target_element, 'comment', 'target_comment')
            else:
                target_value = ''
                target_comment = ''
            # target_element = period.find('target')
            # if not target_element is None:
            #     if 'value' in target_element.attrib.keys():
            #         if not len(target_element.attrib['value']) > 50:
            #             target_value = target_element.attrib['value']
            #         else:
            #             add_log(iati_import, 'indicator_period_target_value',
            #                     'value too long (50 characters allowed', indicator.result.project)
            #     target_comment_element = target_element.find('comment')
            #     if not target_comment_element is None:
            #         target_comment = get_text(target_comment_element, activities_globals['version'])
            #         if len(target_comment) > 2000:
            #             add_log(iati_import, 'indicator_period_target_comment',
            #                     'comment too long (2000 characters allowed',
            #                     indicator.result.project, IatiImportLog.VALUE_PARTLY_SAVED)
            #             target_comment = target_comment[:2000]

            actual_element = period.find('actual')
            if actual_element is not None:
                actual_value = self.get_child_elem_attrib(period, 'actual', 'value', 'actual_value')
                actual_comment = self.get_child_element_text(
                        actual_element, 'comment', 'actual_comment')
            else:
                actual_value = ''
                actual_comment = ''

                # if 'value' in actual_element.attrib.keys():
                #     if not len(actual_element.attrib['value']) > 50:
                #         actual_value = actual_element.attrib['value']
                #     else:
                #         add_log(iati_import, 'indicator_period_actual_value',
                #                 'value too long (50 characters allowed', indicator.result.project)
                #
                # actual_comment_element = actual_element.find('comment')
                # if not actual_comment_element is None:
                #     actual_comment = get_text(actual_comment_element, activities_globals['version'])
                #     if len(actual_comment) > 2000:
                #         add_log(iati_import, 'indicator_period_actual_comment',
                #                 'comment too long (2000 characters allowed',
                #                 indicator.result.project, IatiImportLog.VALUE_PARTLY_SAVED)
                #         actual_comment = actual_comment[:2000]

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
        # for indicator_period in self.related_obj.periods.all():
        #     if not indicator_period in imported_periods:
        #         changes.append(u'deleted indicator period (id: {}): {}'.format(
        #                 indicator_period.pk, indicator_period.__unicode__()))
        #         indicator_period.delete()
        return changes
