# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def activity_date(project):
    """
    Generate the activity-date elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    activity_date_elements = []

    if project.date_start_planned:
        date_start_planned_element = etree.Element("activity-date")
        date_start_planned_element.attrib['iso-date'] = str(project.date_start_planned)
        date_start_planned_element.attrib['type'] = '1'
        activity_date_elements.append(date_start_planned_element)

    if project.date_start_actual:
        date_start_actual_element = etree.Element("activity-date")
        date_start_actual_element.attrib['iso-date'] = str(project.date_start_actual)
        date_start_actual_element.attrib['type'] = '2'
        activity_date_elements.append(date_start_actual_element)

    if project.date_end_planned:
        date_end_planned_element = etree.Element("activity-date")
        date_end_planned_element.attrib['iso-date'] = str(project.date_end_planned)
        date_end_planned_element.attrib['type'] = '3'
        activity_date_elements.append(date_end_planned_element)

    if project.date_end_actual:
        date_end_actual_element = etree.Element("activity-date")
        date_end_actual_element.attrib['iso-date'] = str(project.date_end_actual)
        date_end_actual_element.attrib['type'] = '4'
        activity_date_elements.append(date_end_actual_element)

    return activity_date_elements
