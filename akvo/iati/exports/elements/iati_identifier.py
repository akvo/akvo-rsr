# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def iati_identifier(project):
    """
    Generate the iati-identifier element.

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.iati_activity_id:
        element = etree.Element("iati-identifier")
        element.text = project.iati_activity_id
        return [element]

    return []
