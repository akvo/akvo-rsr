# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def result(project):
    """
    Generate the result elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    result_elements = []

    for res in project.results.all():
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
            indicator_element = etree.SubElement(element, "indicator")

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
                narrative_element.text = res.description

            if indicator.baseline_year and indicator.baseline_value:
                baseline_element = etree.SubElement(indicator_element, "baseline")
                baseline_element.attrib['year'] = str(indicator.baseline_year)
                baseline_element.attrib['value'] = indicator.baseline_value

                if indicator.baseline_comment:
                    comment_element = etree.SubElement(baseline_element, "comment")
                    narrative_element = etree.SubElement(comment_element, "narrative")
                    narrative_element.text = indicator.baseline_comment

            for period in indicator.periods.all():
                period_element = etree.SubElement(indicator_element, "period")

                if period.period_start:
                    period_start_element = etree.SubElement(period_element, "period-start")
                    period_start_element.attrib['iso-date'] = str(period.period_start)

                if period.period_end:
                    period_end_element = etree.SubElement(period_element, "period-end")
                    period_end_element.attrib['iso-date'] = str(period.period_end)

                if period.target_value:
                    target_element = etree.SubElement(period_element, "target")
                    target_element.attrib['value'] = period.target_value

                    if period.target_comment:
                        comment_element = etree.SubElement(target_element, "comment")
                        narrative_element = etree.SubElement(comment_element, "narrative")
                        narrative_element.text = period.target_comment

                if period.actual_value:
                    actual_element = etree.SubElement(period_element, "actual")
                    actual_element.attrib['value'] = period.actual_value

                    if period.actual_comment:
                        comment_element = etree.SubElement(actual_element, "comment")
                        narrative_element = etree.SubElement(comment_element, "narrative")
                        narrative_element.text = period.actual_comment

                indicator_element.append(period_element)

            element.append(indicator_element)

        result_elements.append(element)

    return result_elements
