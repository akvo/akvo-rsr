# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def default_aid_type(project):
    """
    Generate the default-aid-type element.

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.default_aid_type:
        element = etree.Element("default-aid-type")
        element.attrib['code'] = project.default_aid_type
        element.attrib['vocabulary'] = project.default_aid_type_vocabulary
        return [element]

    return []
