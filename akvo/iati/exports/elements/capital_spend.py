# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def capital_spend(project):
    """
    Generate the capital-spend element.

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.capital_spend_percentage == 0 or project.capital_spend_percentage:
        element = etree.Element("capital-spend")
        element.attrib['percentage'] = str(project.capital_spend_percentage)
        return [element]

    return []
