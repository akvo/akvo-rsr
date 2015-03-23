# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def location(project):
    """
    Generate the location elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    location_elements = []

    for loc in project.locations.all():
        element = etree.Element("location")

        if loc.reference:
            element.attrib['ref'] = loc.reference

        if loc.location_reach:
            reach_element = etree.SubElement(element, "location-reach")
            reach_element.attrib['code'] = loc.location_reach

        if loc.location_code and loc.vocabulary:
            id_element = etree.SubElement(element, "location-id")
            id_element.attrib['vocabulary'] = loc.vocabulary
            id_element.attrib['code'] = loc.location_code

        if loc.name:
            name_element = etree.SubElement(element, "name")
            narrative_element = etree.SubElement(name_element, "narrative")
            narrative_element.text = loc.name

        if loc.description:
            description_element = etree.SubElement(element, "description")
            narrative_element = etree.SubElement(description_element, "narrative")
            narrative_element.text = loc.description

        if loc.activity_description:
            activity_description_element = etree.SubElement(element, "activity-description")
            narrative_element = etree.SubElement(activity_description_element, "narrative")
            narrative_element.text = loc.activity_description

        if loc.administrative_code and loc.administrative_vocabulary:
            administrative_element = etree.SubElement(element, "administrative")
            administrative_element.attrib['vocabulary'] = loc.administrative_vocabulary
            administrative_element.attrib['code'] = loc.administrative_code

            if loc.administrative_level:
                administrative_element.attrib['level'] = str(loc.administrative_code)

        if loc.latitude and loc.longitude:
            point_element = etree.SubElement(element, "point")
            point_element.attrib['srsName'] = 'http://www.opengis.net/def/crs/EPSG/0/4326'
            pos_element = etree.SubElement(point_element, "pos")
            pos_element.text = "%s %s" % (str(loc.latitude), str(loc.longitude))

        if loc.exactness:
            exactness_element = etree.SubElement(element, "exactness")
            exactness_element.attrib['code'] = str(loc.exactness)

        if loc.location_class:
            class_element = etree.SubElement(element, "location-class")
            class_element.attrib['code'] = str(loc.location_class)

        if loc.feature_designation:
            feature_element = etree.SubElement(element, "feature-designation")
            feature_element.attrib['code'] = str(loc.feature_designation)

        location_elements.append(element)

    return location_elements
