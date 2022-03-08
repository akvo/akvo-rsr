# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Project, RelatedProject, Result, Indicator, IndicatorPeriod, IndicatorDimensionName, IndicatorDimensionValue, DefaultPeriod
from dataclasses import dataclass, field
from django.db.models import Q
from typing import List, Any, Callable, Set, Optional, Iterable, Dict

RF_MODELS_CONFIG = {
    # key: (Model, parent_attribute, project_relation, result_relation)
    'results': (Result, 'parent_result', 'project', None),
    'indicators': (Indicator, 'parent_indicator', 'result__project', 'result'),
    'periods': (IndicatorPeriod, 'parent_period', 'indicator__result__project', 'indicator__result'),
    'dimension_names': (IndicatorDimensionName, 'parent_dimension_name', 'project', None),
    'dimension_values': (IndicatorDimensionValue, 'parent_dimension_value', 'name__project', None),
    'default_periods': (DefaultPeriod, 'parent_id', 'project', None),
}


def get_project_lineage_ids(project: Project) -> List[int]:
    project_id = project.pk
    lineage = [project_id]
    while True:
        parent_id = Project.objects.filter(
            Q(
                related_projects__related_project=project_id,
                related_projects__relation=RelatedProject.PROJECT_RELATION_CHILD
            ) | Q(
                related_to_projects__project=project_id,
                related_to_projects__relation=RelatedProject.PROJECT_RELATION_PARENT
            )
        ).values_list('pk', flat=True).first()
        if parent_id is None:
            break
        lineage.append(parent_id)
        project_id = parent_id
    return lineage


def get_first_common_item(left: List[int], right: List[int]) -> Optional[int]:
    for it in left:
        if it in right:
            return it


def get_direct_lineage_hierarchy_ids(lhs_project: Optional[Project], rhs_project: Optional[Project]) -> Set[Optional[int]]:
    lhs_lineage = get_project_lineage_ids(lhs_project) if lhs_project else []
    rhs_lineage = get_project_lineage_ids(rhs_project) if rhs_project else []
    # Only hierarchy up to the nearest common ancestor are needed to link between the project and the new parent.
    # Don't include project to find commond ancestor to prevent the possibility that new parent is child of project.
    common_ancestor = get_first_common_item(lhs_lineage, rhs_lineage)
    # Remove all projects that are ancestors of the nearest common ancestor and make the nearest common ancestor
    # as the root of the hierarchy.
    return set(lhs_lineage).symmetric_difference(set(rhs_lineage)) | {common_ancestor}


@dataclass(frozen=True)
class TreeNode:
    item: Any
    children: List['TreeNode'] = field(default_factory=list)


def make_tree_from_list(items, parent_attr) -> List[TreeNode]:
    tree = []
    ids = [it['id'] for it in items]
    lookup = {item['id']: TreeNode(item=item) for item in items}
    for item in items:
        item_id = item['id']
        node = lookup[item_id]
        parent_id = item.get(parent_attr, None)
        # Root node, or any items with parents outside of the project ancestry are added to the tree
        if not parent_id or parent_id not in ids:
            tree.append(node)
        else:
            lookup[parent_id].children.append(node)
    return tree


def filter_trees(trees: List[TreeNode], predicate: Callable[[TreeNode], bool]) -> List[TreeNode]:
    return [tree for tree in trees if is_tree_contains(tree, predicate)]


def is_tree_contains(tree: TreeNode, predicate: Callable[[TreeNode], bool]) -> bool:
    if predicate(tree):
        return True
    for child in tree.children:
        if is_tree_contains(child, predicate):
            return True
    return False


def get_leaf_item(node: TreeNode):
    return get_leaf_item(node.children[0]) if len(node.children) else node.item


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
