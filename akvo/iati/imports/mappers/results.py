# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.indicator import (Indicator, IndicatorPeriod, IndicatorPeriodActualDimension,
                                      IndicatorPeriodActualLocation, IndicatorPeriodTargetDimension,
                                      IndicatorPeriodTargetLocation, IndicatorReference)
from ....rsr.models.result import Result

from .. import ImportMapper


class Results(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(Results, self).__init__(iati_import_job, parent_elem, project, globals, related_obj)
        self.model = Result

    def do_import(self):
        """
        Retrieve and store the result information.
        The results will be extracted from the 'result' elements.

        :return: List; contains fields that have changed
        """
        imported_results = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('result'):
            return changes

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
            if result_obj not in imported_results:
                if created:
                    changes.append(u'added result (id: {}): {}'.format(result_obj.pk, result_obj))
                imported_results.append(result_obj)

                # Process indicators
                indicators = Indicators(self.iati_import_job, result,
                                        self.project, self.globals, related_obj=result_obj)
                for indicator_change in indicators.do_import():
                    changes.append(indicator_change)

        changes += self.delete_objects(self.project.results, imported_results, 'result')
        return changes


class Indicators(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Indicators, self).__init__(iati_import_job, parent_elem,
                                         project, globals, related_obj)
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
                baseline_year = self.get_attrib_as_int(
                    baseline_element, 'year', 'baseline_year', None)
                baseline_value = self.get_attrib(baseline_element, 'value', 'baseline_value')
                baseline_comment = self.get_child_element_text(
                    baseline_element, 'comment', 'baseline_comment')
            else:
                baseline_year = None
                baseline_value = ''
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
            if indicator_obj not in imported_indicators:
                if created:
                    changes.append(u'added indicator (id: {}): {}'.format(
                        indicator_obj.pk, indicator_obj))
                imported_indicators.append(indicator_obj)

                # Process indicator references
                indicator_references = IndicatorReferences(self.iati_import_job, indicator,
                                                           self.project, self.globals,
                                                           related_obj=indicator_obj)
                for reference_change in indicator_references.do_import():
                    changes.append(reference_change)

                # Process indicator periods
                indicator_periods = IndicatorPeriods(self.iati_import_job, indicator, self.project,
                                                     self.globals, related_obj=indicator_obj)
                for period_change in indicator_periods.do_import():
                    changes.append(period_change)

        changes += self.delete_objects(
            self.related_obj.indicators, imported_indicators, 'indicator')
        return changes


class IndicatorReferences(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(IndicatorReferences, self).__init__(iati_import_job, parent_elem, project, globals,
                                                  related_obj)
        self.model = IndicatorReference

    def do_import(self):
        """
        Retrieve and store the reference information of an indicator.
        The references will be extracted from the 'reference' elements within an 'indicator'
        element.

        :return: List; contains fields that have changed
        """
        imported_references = []
        changes = []

        for reference in self.parent_elem.findall('reference'):

            reference_code = self.get_attrib(reference, 'code', 'code')
            vocabulary = self.get_attrib(reference, 'vocabulary', 'vocabulary')
            vocabulary_uri = self.get_attrib(reference, 'indicator-uri', 'vocabulary_uri')

            reference_obj, created = IndicatorReference.objects.get_or_create(
                indicator=self.related_obj,
                reference=reference_code,
                vocabulary=vocabulary,
                vocabulary_uri=vocabulary_uri,
            )
            if created:
                changes.append(u'added indicator reference (id: {}): {}'.format(reference_obj.pk,
                                                                                reference_obj))
            imported_references.append(reference_obj)

        changes += self.delete_objects(self.related_obj.references, imported_references,
                                       'indicator reference')
        return changes


class IndicatorPeriods(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(IndicatorPeriods, self).__init__(
            iati_import_job, parent_elem, project, globals, related_obj)
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
                target_comment = self.get_child_element_text(target_element, 'comment',
                                                             'target_comment')
            else:
                target_value = ''
                target_comment = ''

            actual_element = period.find('actual')
            if actual_element is not None:
                actual_value = self.get_child_elem_attrib(period, 'actual', 'value', 'actual_value')
                actual_comment = self.get_child_element_text(actual_element, 'comment',
                                                             'actual_comment')
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
            # Disregard double periods
            if period_obj not in imported_periods:
                if created:
                    changes.append(u'added indicator period (id: {}): {}'.format(period_obj.pk,
                                                                                 period_obj))
                imported_periods.append(period_obj)

                # Process target dimensions and locations
                if target_element is not None:
                    target_dimensions = PeriodTargetDimensions(self.iati_import_job, target_element,
                                                               self.project, self.globals,
                                                               related_obj=period_obj)
                    for dimension_change in target_dimensions.do_import():
                        changes.append(dimension_change)

                    target_locations = PeriodTargetLocations(self.iati_import_job, target_element,
                                                             self.project, self.globals,
                                                             related_obj=period_obj)
                    for location_change in target_locations.do_import():
                        changes.append(location_change)

                # Process actual dimensions and locations
                if actual_element is not None:
                    actual_dimensions = PeriodActualDimensions(self.iati_import_job, actual_element,
                                                               self.project, self.globals,
                                                               related_obj=period_obj)
                    for dimension_change in actual_dimensions.do_import():
                        changes.append(dimension_change)

                    actual_locations = PeriodActualLocations(self.iati_import_job, actual_element,
                                                             self.project, self.globals,
                                                             related_obj=period_obj)
                    for location_change in actual_locations.do_import():
                        changes.append(location_change)

        changes += self.delete_objects(
            self.related_obj.periods, imported_periods, 'indicator period')
        return changes


class PeriodActualLocations(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(PeriodActualLocations, self).__init__(iati_import_job, parent_elem, project, globals,
                                                    related_obj)
        self.model = IndicatorPeriodActualLocation

    def do_import(self):
        """
        Retrieve and store the location information of an indicator period actual value.
        The locations will be extracted from the 'location' elements of the 'actual' element.

        :return: List; contains fields that have changed
        """
        imported_locations = []
        changes = []

        for location in self.parent_elem.findall('location'):

            reference = self.get_attrib(location, 'ref', 'location')

            location_obj, created = IndicatorPeriodActualLocation.objects.get_or_create(
                period=self.related_obj,
                location=reference,
            )
            if created:
                changes.append(u'added indicator period actual location (id: {}): {}'.format(
                    location_obj.pk, location_obj))
            imported_locations.append(location_obj)

        changes += self.delete_objects(self.related_obj.actual_locations, imported_locations,
                                       'indicator period actual location')
        return changes


class PeriodTargetLocations(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(PeriodTargetLocations, self).__init__(iati_import_job, parent_elem, project, globals,
                                                    related_obj)
        self.model = IndicatorPeriodTargetLocation

    def do_import(self):
        """
        Retrieve and store the location information of an indicator period target value.
        The locations will be extracted from the 'location' elements of the 'target' element.

        :return: List; contains fields that have changed
        """
        imported_locations = []
        changes = []

        for location in self.parent_elem.findall('location'):

            reference = self.get_attrib(location, 'ref', 'location')

            location_obj, created = IndicatorPeriodTargetLocation.objects.get_or_create(
                period=self.related_obj,
                location=reference,
            )
            if created:
                changes.append(u'added indicator period target location (id: {}): {}'.format(
                    location_obj.pk, location_obj))
            imported_locations.append(location_obj)

        changes += self.delete_objects(self.related_obj.target_locations, imported_locations,
                                       'indicator period target location')
        return changes


class PeriodActualDimensions(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(PeriodActualDimensions, self).__init__(iati_import_job, parent_elem, project, globals,
                                                     related_obj)
        self.model = IndicatorPeriodActualDimension

    def do_import(self):
        """
        Retrieve and store the dimension information of an indicator period actual value.
        The dimensions will be extracted from the 'dimension' elements of the 'actual' element.

        :return: List; contains fields that have changed
        """
        imported_dimensions = []
        changes = []

        for dimension in self.parent_elem.findall('dimension'):

            name = self.get_attrib(dimension, 'name', 'name')
            value = self.get_attrib(dimension, 'value', 'value')

            dimension_obj, created = IndicatorPeriodActualDimension.objects.get_or_create(
                period=self.related_obj,
                name=name,
                value=value,
            )
            if created:
                changes.append(u'added indicator period actual dimension (id: {}): {}'.format(
                    dimension_obj.pk, dimension_obj))
            imported_dimensions.append(dimension_obj)

        changes += self.delete_objects(self.related_obj.actual_dimensions, imported_dimensions,
                                       'indicator period actual dimension')
        return changes


class PeriodTargetDimensions(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(PeriodTargetDimensions, self).__init__(iati_import_job, parent_elem, project, globals,
                                                     related_obj)
        self.model = IndicatorPeriodTargetDimension

    def do_import(self):
        """
        Retrieve and store the dimension information of an indicator period target value.
        The dimensions will be extracted from the 'dimension' elements of the 'target' element.

        :return: List; contains fields that have changed
        """
        imported_dimensions = []
        changes = []

        for dimension in self.parent_elem.findall('dimension'):

            name = self.get_attrib(dimension, 'name', 'name')
            value = self.get_attrib(dimension, 'value', 'value')

            dimension_obj, created = IndicatorPeriodTargetDimension.objects.get_or_create(
                period=self.related_obj,
                name=name,
                value=value,
            )
            if created:
                changes.append(u'added indicator period target dimension (id: {}): {}'.format(
                    dimension_obj.pk, dimension_obj))
            imported_dimensions.append(dimension_obj)

        changes += self.delete_objects(self.related_obj.target_dimensions, imported_dimensions,
                                       'indicator period target dimension')
        return changes
