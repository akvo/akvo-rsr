# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from uuid import UUID

from akvo.rsr.models import Project, Result
from akvo.rsr.models.related_project import ParentChangeDisallowed
from akvo.rsr.usecases.change_project_parent import RF_MODELS_CONFIG


def remove_parent(project: Project):
    if not project.has_ancestors:
        return

    # Update related objects
    for (model, parent_attr, project_relation) in RF_MODELS_CONFIG.values():
        model.objects.filter(**{project_relation: project}).update(**{parent_attr: None})

    check_child_results(project.uuid, project.get_parent_uuid())

    # Append project to list in order to modify known reference / current object in memory
    # Otherwise it would be a new object
    sub_tree = list(project.descendants(with_self=False)) + [project]
    old_path = project.path

    # Remove old parent from subtree paths
    path_to_cut = len(old_path[:-1])
    for node in sub_tree:
        node.path = node.path[path_to_cut:]

    Project.objects.bulk_update(sub_tree, ["path"])


def check_child_results(project_uuid: UUID, parent_project_uuid: UUID):
    """
    Ensure that a project doesn't have results which were imported from a parent
    """
    project_results = Result.objects.filter(project__uuid=project_uuid)
    child_results = project_results.filter(parent_result__project__uuid=parent_project_uuid)
    if child_results.exists():
        raise ParentChangeDisallowed()

