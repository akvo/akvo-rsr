# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import dataclasses
import operator
from argparse import ArgumentParser
from functools import reduce
from typing import Dict, List, Set, Hashable, Generic, TypeVar
from uuid import UUID

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import F

from akvo.rsr.models import Project, RelatedProject
from akvo.rsr.models.tree.usecases import check_set_parent, set_parent


class Command(BaseCommand):
    help = "Create a tree structure of Projects from RelatedProjects"

    def add_arguments(self, parser: ArgumentParser):
        parser.add_argument(
            "--apply", action="store_true",
            help="Actually apply the changes"
        )

    def handle(self, *args, **options):
        try:
            migrate(options.get("apply", False))
        except InterruptedError:
            print("Changes not applied")
        else:
            print("Changes applied")
        print("DONE!")


@transaction.atomic
def migrate(apply=False):
    # Handle parent child relationships
    parent_child_related_projects = RelatedProject.objects.filter(
        relation__in=[RelatedProject.PROJECT_RELATION_PARENT, RelatedProject.PROJECT_RELATION_CHILD],
        related_project__isnull=False,
    ).exclude(
        # don't include results where the project is the same as the related project
        # this happened in production for some reason
        project__exact=F("related_project")
    )

    for rp in parent_child_related_projects:
        # Refresh from DB in order to get the new paths
        rp.refresh_from_db(fields=["project", "related_project"])
        if rp.relation == RelatedProject.PROJECT_RELATION_CHILD:
            node, new_parent = rp.related_project, rp.project
        else:
            node, new_parent = rp.project, rp.related_project
        try:
            check_set_parent(node, new_parent)
            set_parent(node, new_parent)
        except Exception as e:
            print(
                "Ignoring RP(%s): project(%s) related_project(%s) relation(%s)" % (
                    rp.id, rp.project.id, rp.related_project.id, rp.get_relation_display()
                )
            )
            print(f"Cause: {e}")

    # handle siblings
    migrate_siblings()

    roots = Project.objects.filter(path__depth=1)
    for root in roots:
        print_tree(build_tree(root), tab_char="..")

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
    ).select_related("project", "related_project").order_by("id")
    related_siblings = list(related_siblings_query)

    sibling_uuid_groups = group_siblings(related_siblings)
    sibling_groups = resolve_sibling_groups(related_siblings, sibling_uuid_groups)

    # Try to set parents of the groups
    modified_projects = set_sibling_parents(sibling_groups)
    print(f"Set parents for {len(modified_projects)} siblings")
    Project.objects.bulk_update(modified_projects, ["path"])


def group_siblings(related_projects: List[RelatedProject]) -> List[Set[UUID]]:
    """Make groups of sibling projects as sets of project IDs"""
    sibling_uuid_groups = []
    for related_project in related_projects:
        project_uuid = related_project.project.uuid
        sibling_uuid = related_project.related_project.uuid
        groups = [
            sibling_group
            for sibling_group in sibling_uuid_groups
            if project_uuid in sibling_group or sibling_uuid in sibling_group
        ]
        group_count = len(groups)
        if group_count == 0:
            # New group
            sibling_uuid_groups.append({project_uuid, sibling_uuid})
        elif group_count == 1:
            # Add to existing group
            groups[0].add(project_uuid)
            groups[0].add(sibling_uuid)
        else:
            # Multiple groups should be merged into one
            first_group = groups[0]
            groups_to_merge = groups[1:]
            first_group.update(*groups_to_merge)
            # Remove merged groups
            for group in groups_to_merge:
                groups.remove(group)
    return sibling_uuid_groups


def resolve_sibling_groups(
        related_siblings: List[RelatedProject],
        sibling_uuid_groups: List[Set[UUID]]
) -> List[List[Project]]:
    """Use cache to resolve project UUIDs in the groups to projects"""
    sibling_projects_cache: Dict[UUID, Project] = {}
    for related_sibling in related_siblings:
        sibling_projects_cache[related_sibling.project.uuid] = related_sibling.project
        sibling_projects_cache[related_sibling.related_project.uuid] = related_sibling.related_project
    sibling_groups: List[List[Project]] = [
        [sibling_projects_cache[sibling_id] for sibling_id in sibling_id_group]
        for sibling_id_group in sibling_uuid_groups
    ]
    return sibling_groups


def set_sibling_parents(sibling_groups: List[List[Project]]) -> List[Project]:
    """
    Attempts to sets the parent of each group of sibling projects

    Not all groups will have the same parent (or a parent at all), which is of course a problem.

    :return: All the projects that now have a parent
    """
    modified_projects = []
    orphaned_siblings = []
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
                    set_parent(sibling, parent)
                    modified_projects.append(sibling)
            print(f"{parent_uuid} is the parent of {sibling_group}")
        else:
            print(f"{sibling_group} has multiple parents!")

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

    def to_dict(self):
        return {
            "item": self.item,
            "children": {
                child_id: child.to_dict()
                for child_id, child in self.children.items()
            }
        }


def build_tree(project: Project) -> TreeNode[Project]:
    descendants = list(project.descendants(with_self=False))
    tree = TreeNode(item=project)
    project_cache = {descendant.uuid: descendant for descendant in descendants}
    project_cache[project.uuid] = project

    node_cache = {project.uuid: tree}
    for descendant in descendants:
        descendant_node = node_cache.setdefault(descendant.uuid, TreeNode(item=descendant))
        parent = project_cache[descendant.get_parent_uuid()]
        parent_tree = node_cache.setdefault(parent.uuid, TreeNode(item=parent))
        parent_tree.children[descendant.uuid] = descendant_node

    return tree


def print_tree(node: TreeNode, depth=0, tab_char=' '):
    print(f"{tab_char * depth}{node.item}")
    for child in node:
        print_tree(child, depth + 1, tab_char)
