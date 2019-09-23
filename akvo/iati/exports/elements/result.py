# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data, has_qs_data
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE

DGIS_VALIDATION_SET_NAME = u"DGIS IATI"
NOT_AVAILABLE = u"N/A"
NOT_AVAILABLE_YEAR = u"1"


def result(project):
    """
    Generate the result elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    result_elements = []

    DGIS_PROJECT = project.validations.filter(name=DGIS_VALIDATION_SET_NAME).count() == 1

    for res in project.results.all():
        if (has_data(res, ['type', 'title', 'description', ]) or
                res.aggregation_status is not None or
                res.indicators.all()):
            element = etree.Element("result")

            if res.type:
                element.attrib['type'] = res.type

            if res.aggregation_status is not None:
                element.attrib['aggregation-status'] = '1' if res.aggregation_status else '0'

            if res.title:
                title_element = etree.SubElement(element, "title")
                narrative_element = etree.SubElement(title_element, "narrative")
                narrative_element.text = res.title

            if res.description:
                description_element = etree.SubElement(element, "description")
                narrative_element = etree.SubElement(description_element, "narrative")
                narrative_element.text = res.description

            for indicator in res.indicators.all():
                if not indicator.export_to_iati:
                    continue

                if (has_data(indicator, ['measure', 'title', 'description', 'baseline_year',
                                         'baseline_value', 'baseline_comment', ]) or
                        indicator.ascending is not None or
                        has_qs_data(indicator, ['references', 'periods', ])):
                    add_indicator_element(element, indicator, DGIS_PROJECT)

            result_elements.append(element)

    return result_elements


def add_indicator_element(result_element, indicator, is_dgis_project):
    indicator_element = etree.SubElement(result_element, "indicator")

    if indicator.type == QUALITATIVE:
        indicator_element.attrib['measure'] = '5'

    elif indicator.measure:
        indicator_element.attrib['measure'] = indicator.measure

    if indicator.ascending is not None:
        indicator_element.attrib['ascending'] = '1' if indicator.ascending else '0'

    if indicator.title:
        title_element = etree.SubElement(indicator_element, "title")
        narrative_element = etree.SubElement(title_element, "narrative")
        narrative_element.text = indicator.title

    if indicator.description:
        description_element = etree.SubElement(indicator_element, "description")
        narrative_element = etree.SubElement(description_element, "narrative")
        narrative_element.text = indicator.description

    for reference in indicator.references.all():
        add_reference_element(indicator_element, reference)

    add_baseline_element(is_dgis_project, indicator_element, indicator)

    for period in indicator.periods.all():
        add_period_element(is_dgis_project, indicator_element, period)


def add_reference_element(indicator_element, reference):
    if has_data(reference, ['vocabulary', 'reference', 'vocabulary_uri', ]):
        reference_element = etree.SubElement(indicator_element, "reference")

        if reference.vocabulary:
            reference_element.attrib['vocabulary'] = reference.vocabulary

        if reference.reference:
            reference_element.attrib['code'] = reference.reference

        if reference.vocabulary_uri:
            reference_element.attrib['indicator-uri'] = reference.vocabulary_uri


def add_baseline_element(is_dgis_project, indicator_element, indicator):
    if is_dgis_project or has_data(indicator,
                                   ['baseline_year', 'baseline_value', 'baseline_comment', ]):
        baseline_element = etree.SubElement(indicator_element, "baseline")

        if indicator.baseline_year:
            baseline_element.attrib['year'] = str(indicator.baseline_year)
        elif is_dgis_project:
            baseline_element.attrib['year'] = NOT_AVAILABLE_YEAR

        if indicator.baseline_value:
            baseline_element.attrib['value'] = indicator.baseline_value
        elif is_dgis_project:
            baseline_element.attrib['value'] = NOT_AVAILABLE

        if indicator.baseline_comment:
            comment_element = etree.SubElement(baseline_element, "comment")
            narrative_element = etree.SubElement(comment_element, "narrative")
            narrative_element.text = indicator.baseline_comment


def add_period_element(is_dgis_project, indicator_element, period):
    if (has_data(period, ['period_start', 'period_end', 'target_value', 'target_comment',
                          'actual_value', 'narrative', 'actual_comment']) or
            has_qs_data(period, ['target_locations', 'actual_locations'])):
        period_element = etree.SubElement(indicator_element, "period")

        if period.period_start:
            period_start_element = etree.SubElement(period_element,
                                                    "period-start")
            period_start_element.attrib['iso-date'] = str(period.period_start)

        if period.period_end:
            period_end_element = etree.SubElement(period_element, "period-end")
            period_end_element.attrib['iso-date'] = str(period.period_end)

        add_target_element(is_dgis_project, period, period_element)

        add_actual_element(is_dgis_project, period, period_element)


def add_target_element(is_dgis_project, period, period_element):
    if (is_dgis_project or has_data(period, ['target_value', 'target_comment', ]) or
            has_qs_data(period, ['target_locations', ])):
        target_element = etree.SubElement(period_element, "target")

        if period.target_value:
            target_element.attrib['value'] = period.target_value
        elif is_dgis_project:
            target_element.attrib['value'] = NOT_AVAILABLE

        for target_location in period.target_locations.all():
            target_location_element = etree.SubElement(target_element,
                                                       "location")
            target_location_element.attrib['ref'] = target_location.location

        if period.target_comment:
            comment_element = etree.SubElement(target_element, "comment")
            narrative_element = etree.SubElement(comment_element,
                                                 "narrative")
            narrative_element.text = period.target_comment


def add_actual_element(is_dgis_project, period, period_element):
    if (is_dgis_project or
            has_data(period, ['actual_value', 'narrative', 'actual_comment', ]) or
            has_qs_data(period, ['actual_locations'])):
        actual_element = etree.SubElement(period_element, "actual")

        if period.indicator.type == QUANTITATIVE:
            if period.actual_value:
                actual_element.attrib['value'] = period.actual_value
            elif is_dgis_project:
                actual_element.attrib['value'] = NOT_AVAILABLE

        else:
            if period.narrative:
                actual_element.attrib['value'] = period.narrative

        for actual_location in period.actual_locations.all():
            actual_location_element = etree.SubElement(actual_element,
                                                       "location")
            actual_location_element.attrib['ref'] = actual_location.location

        if period.actual_comment:
            comment_element = etree.SubElement(actual_element, "comment")
            narrative_element = etree.SubElement(comment_element,
                                                 "narrative")
            narrative_element.text = period.actual_comment
