# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def organisation_identifier(organisation, _={}):
    """
    Generate the organisation-identifier element.

    :param organisation: Organisation object
    :param _: Additional context (not used)
    :return: A list of Etree elements
    """
    if organisation.iati_org_id:
        element = etree.Element("organisation-identifier")
        element.text = organisation.iati_org_id
        return [element]

    return []
