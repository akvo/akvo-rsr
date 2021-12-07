# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from typing import Dict, Optional
from django.db import transaction
from akvo.rsr.models import Project, RelatedProject
from akvo.rsr.usecases.utils import (
    RF_MODELS_CONFIG, get_direct_lineage_hierarchy_ids, make_trees_from_list, make_source_to_target_map
)


def get_rf_change_candidates(project: Project, new_parent: Project) -> Dict[str, Dict[int, Optional[int]]]:
    project_ids = get_direct_lineage_hierarchy_ids(project, new_parent)
    if not project_ids:
        return {}
    candidates = {}
    for key, config in RF_MODELS_CONFIG.items():
        model, parent_attr, project_relation, _ = config
        filter_arg = {f"{project_relation}__in": project_ids}
        items = model.objects.filter(**filter_arg).values('id', parent_attr, project_relation)
        items_tree = make_trees_from_list(items, parent_attr)
        candidates[key] = make_source_to_target_map(items_tree, project_relation, project.pk, new_parent.pk)
    return candidates


@transaction.atomic
def change_parent(project: Project, new_parent: Project, reimport=False, verbosity=0):
    """Change the parent of a project to the specified new parent.

    This function changes a project's parent including its Result Framework
    objects by traversing up the hierarchy to find the nearest common ancestor
    then creates a binary lineage tree connecting the project and the new
    parent using the nearest common ancestor as root. Then, it uses the lineage
    tree connection to resolve each RF object's new parent.

    """

    old_parent = project.parent()
    if not old_parent:
        raise Project.DoesNotExist("Project has no parent")
    if old_parent.pk == new_parent.pk:
        if verbosity > 0:
            print("New parent same as current parent")
        return
    # change parents of RF items
    change_candidates = get_rf_change_candidates(project, new_parent)
    for key, candidates in change_candidates.items():
        model, parent_attr, _, _ = RF_MODELS_CONFIG[key]
        for item_id, target_id in candidates.items():
            if verbosity > 1:
                print(f"Change {key} parent of {item_id} to {target_id}")
            model.objects.filter(id__in=[item_id]).update(**{f"{parent_attr}_id": target_id})
    if verbosity > 0:
        print(f"Change project {project.title} (ID:{project.pk}) parent to {new_parent.title} (ID:{new_parent.pk})")
    RelatedProject.objects.filter(
        project=old_parent, related_project=project, relation='2'
    ).update(project=new_parent)
    RelatedProject.objects.filter(
        related_project=old_parent, project=project, relation='1'
    ).update(related_project=new_parent)
    if reimport:
        if verbosity > 1:
            print("Reimporting new parent's results framework")
        # Handle any results etc only on the new parent, but not on the old parent.
        project.do_import_results(new_parent)
        # FIXME: The function could possibly be re-written to make this
        # unnecessary? The new ordering is only necessary at the child level if
        # parent has no ordering...
        ordering = sorted([
            # Avoid int vs None comaparison errors
            tuple(9999 if it is None else it for it in each)
            for each
            in project.results.values_list('parent_result__order', 'parent_result__id', 'order', 'id')
        ])
        for order, (_, _, _, result_id) in enumerate(ordering, start=1):
            project.results.filter(id=result_id).update(order=order)
