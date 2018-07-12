# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.rsr.models.result.utils import QUANTITATIVE

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
        if res.type or res.aggregation_status is not None or res.title or res.description or \
                res.indicators.all():
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

            for indicator in res.indicators.filter(type=QUANTITATIVE):
                if indicator.measure or indicator.ascending is not None or indicator.title or \
                        indicator.description or indicator.references.all() or \
                        indicator.baseline_year or indicator.baseline_value or \
                        indicator.baseline_comment or indicator.periods.all():
                    add_indicator_element(element, indicator, DGIS_PROJECT)

            result_elements.append(element)

    return result_elements


def add_indicator_element(result_element, indicator, is_dgis_project):
    indicator_element = etree.SubElement(result_element, "indicator")

    if indicator.measure:
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
        if reference.vocabulary or reference.reference or reference.vocabulary_uri:
            reference_element = etree.SubElement(indicator_element, "reference")

            if reference.vocabulary:
                reference_element.attrib['vocabulary'] = reference.vocabulary

            if reference.reference:
                reference_element.attrib['code'] = reference.reference

            if reference.vocabulary_uri:
                reference_element.attrib['indicator-uri'] = reference.vocabulary_uri

    if is_dgis_project or indicator.baseline_year or indicator.baseline_value or indicator.baseline_comment:
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

    for period in indicator.periods.all():
        if period.period_start or period.period_end or period.target_value or \
                period.target_locations.all() or period.target_dimensions.all() or \
                period.target_comment or period.actual_value or \
                period.actual_locations.all() or period.actual_dimensions.all() or \
                period.actual_comment:
            period_element = etree.SubElement(indicator_element, "period")

            if period.period_start:
                period_start_element = etree.SubElement(period_element,
                                                        "period-start")
                period_start_element.attrib['iso-date'] = str(period.period_start)

            if period.period_end:
                period_end_element = etree.SubElement(period_element, "period-end")
                period_end_element.attrib['iso-date'] = str(period.period_end)

            if (is_dgis_project or period.target_value or
                    period.target_locations.all() or
                    period.target_dimensions.all() or period.target_comment):
                target_element = etree.SubElement(period_element, "target")

                if period.target_value:
                    target_element.attrib['value'] = period.target_value
                elif is_dgis_project:
                    target_element.attrib['value'] = NOT_AVAILABLE

                for target_location in period.target_locations.all():
                    target_location_element = etree.SubElement(target_element,
                                                               "location")
                    target_location_element.attrib['ref'] = target_location.location

                for target_dimension in period.target_dimensions.all():
                    if target_dimension.name or target_dimension.value:
                        target_dimension_element = etree.SubElement(target_element,
                                                                    "dimension")

                        if target_dimension.name:
                            target_dimension_element.attrib['name'] = \
                                target_dimension.name

                        if target_dimension.value:
                            target_dimension_element.attrib['value'] = \
                                target_dimension.value

                if period.target_comment:
                    comment_element = etree.SubElement(target_element, "comment")
                    narrative_element = etree.SubElement(comment_element,
                                                         "narrative")
                    narrative_element.text = period.target_comment

            if (is_dgis_project or period.actual_value or
                    period.actual_locations.all() or
                    period.actual_dimensions.all() or period.actual_comment):
                actual_element = etree.SubElement(period_element, "actual")

                if period.actual_value:
                    actual_element.attrib['value'] = period.actual_value
                elif is_dgis_project:
                    actual_element.attrib['value'] = NOT_AVAILABLE

                for actual_location in period.actual_locations.all():
                    actual_location_element = etree.SubElement(actual_element,
                                                               "location")
                    actual_location_element.attrib['ref'] = actual_location.location

                for actual_dimension in period.actual_dimensions.all():
                    if actual_dimension.name or actual_dimension.value:
                        actual_dimension_element = etree.SubElement(actual_element,
                                                                    "dimension")

                        if actual_dimension.name:
                            actual_dimension_element.attrib['name'] = \
                                actual_dimension.name

                        if actual_dimension.value:
                            actual_dimension_element.attrib['value'] = \
                                actual_dimension.value

                if period.actual_comment:
                    comment_element = etree.SubElement(actual_element, "comment")
                    narrative_element = etree.SubElement(comment_element,
                                                         "narrative")
                    narrative_element.text = period.actual_comment
