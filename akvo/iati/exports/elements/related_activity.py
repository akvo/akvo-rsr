# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def related_activity(project):
    """
    Generate the related-activity elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    related_activities = set()

    for related_project in project.related_projects.all():
        if related_project.related_project and related_project.relation:
            if related_project.related_project.iati_activity_id:
                related_activity = (
                    related_project.related_project.iati_activity_id,
                    related_project.relation
                )
                related_activities.add(related_activity)

        elif related_project.related_iati_id and related_project.relation:
            related_activity = (related_project.related_iati_id, related_project.relation)
            related_activities.add(related_activity)

    for related_to_project in project.related_to_projects.all():
        if related_to_project.project.iati_activity_id and related_to_project.relation:
            related_activity = (
                related_to_project.project.iati_activity_id,
                related_to_project.reciprocal_relation
            )
            related_activities.add(related_activity)

    related_activity_elements = [
        etree.Element('related-activity', attrib={'ref': ref, 'type': type_})
        for (ref, type_) in related_activities
    ]

    return related_activity_elements
