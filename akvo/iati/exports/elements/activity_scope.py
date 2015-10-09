# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def activity_scope(project):
    """
    Generate the activity-scope element.

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.project_scope:
        element = etree.Element("activity-scope")
        element.attrib['code'] = project.project_scope
        return [element]

    return []
