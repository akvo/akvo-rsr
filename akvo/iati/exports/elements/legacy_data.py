# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def legacy_data(project):
    """
    Generate the legacy-data element.

    :param project: Project object
    :return: A list of Etree elements
    """
    legacy_data_elements = []

    for legacy in project.legacy_data.all():
        if legacy.name and legacy.value:
            element = etree.Element("legacy-data")
            element.attrib['name'] = legacy.name
            element.attrib['value'] = legacy.value

            if legacy.iati_equivalent:
                element.attrib['iati-equivalent'] = legacy.iati_equivalent

            legacy_data_elements.append(element)

    return legacy_data_elements
