# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def planned_disbursement(project):
    """
    Generate the planned-disbursement elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    planned_disbursement_elements = []

    for planned_disbursement in project.planned_disbursements.all():
        if planned_disbursement.value:
            element = etree.Element("planned-disbursement")

            if planned_disbursement.type:
                element.attrib['type'] = planned_disbursement.type

            if planned_disbursement.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(planned_disbursement.period_start)

            if planned_disbursement.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(planned_disbursement.period_end)

            value_element = etree.SubElement(element, "value")
            value_element.text = str(planned_disbursement.value)

            if planned_disbursement.value_date:
                value_element.attrib['value-date'] = str(planned_disbursement.value_date)

            if planned_disbursement.currency:
                value_element.attrib['currency'] = planned_disbursement.currency

            planned_disbursement_elements.append(element)

    return planned_disbursement_elements
