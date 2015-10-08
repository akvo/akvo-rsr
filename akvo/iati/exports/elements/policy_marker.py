# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def policy_marker(project):
    """
    Generate the policy-marker element.

    :param project: Project object
    :return: A list of Etree elements
    """
    policy_marker_elements = []

    for policy in project.policy_markers.all():
        if policy.policy_marker and policy.significance:
            element = etree.Element("policy-marker")
            element.attrib['code'] = policy.policy_marker
            element.attrib['significance'] = policy.significance

            if policy.vocabulary:
                element.attrib['vocabulary'] = policy.vocabulary

            if policy.description:
                narrative_element = etree.SubElement(element, "narrative")
                narrative_element.text = policy.description

            policy_marker_elements.append(element)

    return policy_marker_elements
