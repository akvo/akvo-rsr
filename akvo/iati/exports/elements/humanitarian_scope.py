# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def humanitarian_scope(project):
    """
    Generate the humanitarian-scope element.

    :param project: Project object
    :return: A list of Etree elements
    """
    humanitarian_scope_elements = []

    for scope in project.humanitarian_scopes.all():
        if has_data(scope, ['code', 'type', 'vocabulary', 'vocabulary_uri', 'text', ]):
            element = etree.Element("humanitarian-scope")

            if scope.code:
                element.attrib['code'] = scope.code

            if scope.type:
                element.attrib['type'] = scope.type

            if scope.vocabulary:
                element.attrib['vocabulary'] = scope.vocabulary

            if scope.vocabulary_uri:
                element.attrib['vocabulary-uri'] = scope.vocabulary_uri

            if scope.text:
                narrative_element = etree.SubElement(element, "narrative")
                narrative_element.text = scope.text

            humanitarian_scope_elements.append(element)

    return humanitarian_scope_elements
