# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from typing import List

from lxml import etree


def related_activity(project) -> List[etree.Element]:
    """
    Generate the related-activity elements.

    :type: project: akvo.rsr.models.project.Project
    """
    from akvo.rsr.models import RelatedProject
    related_activities = set()
    parent = project.parent()
    if parent and parent.iati_activity_id:
        related_activities.add(
            (
                parent.iati_activity_id,
                RelatedProject.PROJECT_RELATION_PARENT
            )
        )

    for descendant in project.children().exclude(iati_activity_id=None):
        related_activities.add(
            (
                descendant.iati_activity_id,
                RelatedProject.PROJECT_RELATION_CHILD
            )
        )

    related_activity_elements = [
        etree.Element('related-activity', attrib={'ref': ref, 'type': type_})
        for (ref, type_) in related_activities
    ]

    return related_activity_elements
