# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def location(project):
    """
    Generate the location elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    location_elements = []

    for loc in project.locations.all():
        if (has_data(loc, ['reference', 'location_reach', 'location_code', 'vocabulary', 'name',
                           'description', 'activity_description', 'exactness', 'location_class',
                           'feature_designation', ])
                or (loc.latitude and loc.longitude)
                or loc.administratives.exists()):
            element = etree.Element("location")
            if loc.reference:
                element.attrib['ref'] = loc.reference

            if loc.location_reach:
                reach_element = etree.SubElement(element, "location-reach")
                reach_element.attrib['code'] = loc.location_reach

            if loc.location_code or loc.vocabulary:
                id_element = etree.SubElement(element, "location-id")

                if loc.vocabulary:
                    id_element.attrib['vocabulary'] = loc.vocabulary

                if loc.location_code:
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

            for administrative in loc.administratives.all():
                if administrative.code or administrative.vocabulary or administrative.level:
                    administrative_element = etree.SubElement(element, "administrative")

                    if administrative.vocabulary:
                        administrative_element.attrib['vocabulary'] = administrative.vocabulary

                    if administrative.code:
                        administrative_element.attrib['code'] = administrative.code

                    if administrative.level:
                        administrative_element.attrib['level'] = str(administrative.level)

            if (loc.latitude == 0 or loc.latitude) and (loc.longitude == 0 or loc.longitude):
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
