# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import dataclasses
import operator
from functools import reduce
from typing import Dict, List, Set, Hashable, Generic, TypeVar
from uuid import UUID

from django.core.management.base import BaseCommand
from django.db import transaction

from akvo.rsr.models import Project, RelatedProject


class Command(BaseCommand):
    args = ''
    help = ('Create a tree structure of Projects from RelatedProjects')

    def handle(self, *args, **options):
        try:
            migrate()
        except InterruptedError:
            print("Changes not applied")
        else:
            print("Changes applied")
        print("DONE!")


@transaction.atomic
def migrate(apply=False):
    modified_projects = []
    # Handle parent child relationships
    parent_child_related_projects = RelatedProject.objects.filter(
        relation__in=[RelatedProject.PROJECT_RELATION_CHILD, RelatedProject.PROJECT_RELATION_CHILD],
        related_project__isnull=False,
    )
    for rp in parent_child_related_projects.select_related("project", "related_project"):
        if rp.relation == RelatedProject.PROJECT_RELATION_CHILD:
            rp.project.set_parent(rp.related_project, True)
            modified_projects.append(rp.project)
        else:
            rp.related_project.set_parent(rp.project, True)
            modified_projects.append(rp.related_project)
    Project.objects.bulk_update(modified_projects, ["path"])
    parent_child_related_projects.delete()

    # handle siblings
    migrate_siblings()

    roots = Project.objects.filter(path__match="*{1}")
    for root in roots:
        print_tree(build_tree(root), tab_char="..")
    # trees = [root.get_descendants_tree() for root in roots]

    if not apply:
        raise InterruptedError()


def migrate_siblings():
    """
    Migrate RelatedProjects with sibling relation

    Siblings have to be migrated once the parent+child RelatedProjects have been treated.
    :return:
    """
    related_siblings_query = RelatedProject.objects.filter(
        relation__in=[RelatedProject.PROJECT_RELATION_SIBLING],
        related_project__isnull=False,
    ).select_related("project", "related_project")
    related_siblings = list(related_siblings_query)
    sibling_pairs: Dict[int, Set[RelatedProject, int]] = {
        sibling.project.uuid: (sibling, sibling.related_project.uuid)
        for sibling in related_siblings
    }

    # Group siblings
    sibling_id_groups = []
    # Problem groups
    siblings_in_multiple_groups = set()
    multi_tree_rps = []
    treated_rps = []
    while sibling_pairs:
        project_id, (rp, sibling_id) = sibling_pairs.popitem()
        groups = [
            sibling_group
            for sibling_group in sibling_id_groups
            if project_id in sibling_group or sibling_id in sibling_group
        ]
        group_count = len(groups)
        if group_count == 0:
            # New group
            sibling_id_groups.append({project_id, sibling_id})
        elif group_count == 1:
            # Add to existing group
            groups[0].add(project_id)
            groups[0].add(sibling_id)
            treated_rps.append(rp)
        else:
            # Multiple groups
            siblings_in_multiple_groups.add(project_id)
            siblings_in_multiple_groups.add(sibling_id)
            for group in groups:
                for item in (project_id, sibling_id):
                    if item in group:
                        group.remove(item)
            multi_tree_rps.append(rp)
    print(f"Related projects with siblings in multiple trees({len(multi_tree_rps)}): {multi_tree_rps}")
    print(f"Siblings in multiple trees: {len(siblings_in_multiple_groups)}")

    # Use cache to resolve project IDs in the groups to projects
    sibling_projects_cache: Dict[UUID, Project] = {}
    for related_sibling in related_siblings:
        sibling_projects_cache[related_sibling.project.uuid] = related_sibling.project
        sibling_projects_cache[related_sibling.related_project.uuid] = related_sibling.related_project
    sibling_groups: List[List[Project]] = [
        [sibling_projects_cache[sibling_id] for sibling_id in sibling_id_group]
        for sibling_id_group in sibling_id_groups
    ]

    # Try to set parents of the groups
    modified_projects = set_sibling_parents(sibling_groups)
    print(f"Set parents for {len(modified_projects)} siblings")
    Project.objects.bulk_update(modified_projects, ["path"])


def set_sibling_parents(sibling_groups: List[List[Project]]) -> List[Project]:
    """
    Attempts to sets the parent of each group of sibling projects

    Not all groups will have the same parent (or a parent at all), which is of course a problem.

    :return: All the projects that now have a parent
    """
    modified_projects = []
    orphaned_siblings = []
    multi_parent_siblings = []
    for sibling_group in sibling_groups:
        # Find parents
        parents = {}
        for sibling in sibling_group:
            parent_uuid = sibling.get_parent_uuid()
            if parent_uuid:
                parents.setdefault(parent_uuid, []).append(sibling)

        #
        parent_count = len(parents)
        if parent_count == 0:
            # print(f"{sibling_group} are all orphans")
            orphaned_siblings.append(sibling_group)
        elif parent_count == 1:
            parent_uuid, _ = parents.popitem()
            parent = Project.objects.get(uuid=parent_uuid)
            for sibling in sibling_group:
                if not sibling.get_parent_uuid():
                    sibling.set_parent(parent, True)
                    modified_projects.append(sibling)
            print(f"f{parent_uuid} is the parent of {sibling_group}")
        else:
            print(f"{sibling_group} has multiple parents!")
            multi_parent_siblings.append(sibling_group)

    orphan_count = reduce(
        operator.add,
        [len(orphaned_sibling) for orphaned_sibling in orphaned_siblings],
        0
    )
    print(f"Orphaned siblings: {len(orphaned_siblings)}")
    print(f"Total orphans: {orphan_count}")

    return modified_projects


TreeNodeItem_T = TypeVar("TreeNodeItem_T")


@dataclasses.dataclass
class TreeNode(Generic[TreeNodeItem_T]):
    item: TreeNodeItem_T
    children: Dict[Hashable, "TreeNode"] = dataclasses.field(default_factory=dict)

    def __iter__(self):
        return iter(self.children.values())


def build_tree(project: Project) -> TreeNode[Project]:
    descendants = list(project.descendants())
    tree = TreeNode(item=project)
    project_cache = {descendant.uuid: descendant for descendant in descendants}
    project_cache[project.uuid] = project

    node_cache = {project.uuid: tree}
    for descendant in descendants:
        descendant_node = node_cache.setdefault(descendant.id, TreeNode(item=descendant))
        parent = project_cache[descendant.get_parent_uuid()]
        parent_tree = node_cache.setdefault(parent.id, TreeNode(item=parent))
        parent_tree.children[descendant.id] = descendant_node

    return tree


def print_tree(node: TreeNode, depth=1, tab_char=' '):
    print(f"{tab_char * depth}{node.item}")
    for child in node:
        print_tree(child, depth + 1, tab_char)
