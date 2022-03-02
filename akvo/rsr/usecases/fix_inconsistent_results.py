# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from typing import Iterable, Dict, Optional
from django.db import transaction
from akvo.rsr.models import Result, Project
from akvo.rsr.usecases.utils import (
    RF_MODELS_CONFIG, get_direct_lineage_hierarchy_ids, make_tree_from_list, TreeNode, filter_trees, get_leaf_item
)


def fix_inconsistent_results(results: Iterable[Result]):
    for result in results:
        fix_inconsistent_result(result)


@transaction.atomic
def fix_inconsistent_result(result: Result):
    if result.parent_result is None:
        return

    parent_project = result.project.parents_all().first()
    parent_result = result.parent_result
    parent_result_project = parent_result.project

    if parent_project == parent_result_project:
        return

    change_candidates = get_change_candidates(parent_result, parent_result_project, parent_project)
    for key, candidates in change_candidates.items():
        model, parent_attr, project_relation, _ = RF_MODELS_CONFIG[key]
        for orig_parent_id, target_parent_id in candidates.items():
            filter_args = {parent_attr: orig_parent_id, project_relation: result.project}
            model.objects.filter(**filter_args).update(**{f"{parent_attr}_id": target_parent_id})


def get_change_candidates(result: Result, result_project: Project, target_project: Optional[Project]) -> Dict[str, Dict[int, int]]:
    project_ids = get_direct_lineage_hierarchy_ids(result_project, target_project)
    candidates = {}
    for key, config in RF_MODELS_CONFIG.items():
        if key not in ['results', 'indicators', 'periods']:
            continue
        model, parent_attr, project_relation, result_relation = config
        filter_args = {f"{project_relation}__in": project_ids}
        select_attrs = [a for a in ['id', parent_attr, project_relation, result_relation] if a is not None]
        items = model.objects.filter(**filter_args).values(*select_attrs)
        filter_func = (lambda node: node.item[result_relation] == result.pk) \
            if result_relation is not None \
            else (lambda node: node.item['id'] == result.pk)
        items_tree = make_tree_from_list(items, parent_attr)
        items_tree = filter_trees(items_tree, filter_func)
        candidates[key] = make_target_parent_map(items_tree, project_relation, result_project.pk, target_project.pk if target_project else None)
    return candidates


def make_target_parent_map(trees: Iterable[TreeNode], project_attr, original_project_id, target_project_id) -> Dict[int, int]:
    target_map = {}
    for node in trees:
        if len(node.children) == 0:
            target_map[node.item['id']] = None
            continue
        first_leaf = get_leaf_item(node.children[0])
        if len(node.children) == 1 \
                and node.item[project_attr] == original_project_id \
                and first_leaf[project_attr] == target_project_id:
            target_map[node.item['id']] = first_leaf['id']
            continue
        if len(node.children) == 1 \
                and first_leaf[project_attr] == original_project_id:
            target_map[first_leaf['id']] = None
            continue
        second_leaf = get_leaf_item(node.children[1])
        if len(node.children) == 2 \
                and first_leaf[project_attr] == original_project_id:
            target_map[first_leaf['id']] = second_leaf['id'] if second_leaf[project_attr] == target_project_id else None
            continue
        if len(node.children) == 2 \
                and second_leaf[project_attr] == original_project_id:
            target_map[second_leaf['id']] = first_leaf['id'] if first_leaf[project_attr] == target_project_id else None
            continue
        print('Ignoring ambiguous lineage tree node', node)
    return target_map
