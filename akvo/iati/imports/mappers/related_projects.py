# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import logging
from xml.etree.ElementTree import ElementTree

from django.core.exceptions import ObjectDoesNotExist

from akvo.iati.constants import related_project as constants
from akvo.rsr.models.tree.errors import NodeIsSame, ParentIsSame, TreeWillBreak
from .. import ImportMapper

HIERARCHICAL_RELATIONS = (
    constants.PROJECT_RELATION_PARENT,
    constants.PROJECT_RELATION_CHILD,
    constants.PROJECT_RELATION_SIBLING,
)
EXTERNAL_RELATIONS = (
    constants.PROJECT_RELATION_CO_FUNDED,
    constants.PROJECT_RELATION_THIRD_PARTY,
)

logger = logging.getLogger(__name__)


class RelatedProjects(ImportMapper):

    def __init__(
            self, iati_import_job, parent_elem, project, globals,
            related_obj=None
    ):
        super(RelatedProjects, self).__init__(
            iati_import_job, parent_elem,
            project, globals
        )
        from akvo.rsr.models import Project
        self.model = Project

    def do_import(self):
        """
        Retrieve and store the related projects.
        The related projects will be extracted from the 'related-activity' elements.

        :return: List; contains fields that have changed
        """

        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('related-activity'):
            return changes

        for related_activity in self.parent_elem.findall('related-activity'):
            try:
                changes.append(self.import_related_activity(related_activity))
            except:
                logger.warning("Bad related_activity: %s" % related_activity, exc_info=True)
                continue

    def import_related_activity(self, related_activity: ElementTree) -> str:
        related_iati_id = self.get_attrib(related_activity, 'ref', 'related_iati_id')
        relation = self.get_attrib(related_activity, 'type', 'relation')

        if relation in HIERARCHICAL_RELATIONS:
            return self.import_hierarchical_related_activity(relation, related_iati_id)
        elif relation in EXTERNAL_RELATIONS:
            return self.import_external_related_activity(relation, related_iati_id)
        else:
            raise ValueError("Unknown relation", relation)

    def import_hierarchical_related_activity(self, relation, related_iati_id: str) -> str:
        from akvo.rsr.models import Project
        from akvo.rsr.usecases.change_project_parent import change_parent

        try:
            related_project = Project.objects.get(iati_activity_id=related_iati_id)
        except ObjectDoesNotExist as ode:
            raise ValueError("Unknown related activity ID", related_iati_id) from ode

        project_id = self.project.id
        if relation == constants.PROJECT_RELATION_PARENT:
            try:
                change_parent(self.project, related_project)
                return f"Set related project {related_project.id} as parent of {project_id}"
            except (ParentIsSame, NodeIsSame):
                raise ValueError("")
            except TreeWillBreak:
                # TODO: Add error log
                raise

        elif relation == constants.PROJECT_RELATION_CHILD:
            change_parent(related_project, self.project)
            return f"Set related project {related_project.id} as child of {project_id}"

        elif relation == constants.PROJECT_RELATION_SIBLING:
            parent = self.project.parent()
            if not parent:
                # TODO: Error log a parent should exist
                raise Project.DoesNotExist()
            related_project.set_parent(parent)
            return f"Added sibling to project {project_id}"

        else:
            raise ValueError("Not a hierarchical relation")

    def import_external_related_activity(self, relation: str, related_iati_id: str) -> str:
        if relation not in EXTERNAL_RELATIONS:
            raise ValueError("Not an external relation")
        from akvo.rsr.models.third_party_project import ThirdPartyProject

        third_party_project, created = ThirdPartyProject.objects.get_or_create(iati_id=related_iati_id)
        action_log = "Added" if created else "Updated"

        relation_log = "third party"
        if relation == constants.PROJECT_RELATION_CO_FUNDED:
            third_party_project.cofunded = True
            relation_log = "cofunded"

        third_party_project.related_project = self.project
        third_party_project.save()

        return f"{action_log} {relation_log} project({third_party_project.id}) to project {self.project.id}"
