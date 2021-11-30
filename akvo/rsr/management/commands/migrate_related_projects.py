# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from typing import Dict, Type, Any

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Q

from akvo.rsr.models import Project, ProjectHierarchy, RelatedProject


class Command(BaseCommand):
    args = ''
    help = ('Create a tree structure of Projects from RelatedProjects')

    def handle(self, *args, **options):
        try:
            migrate(True)
        except InterruptedError:
            print("Changes not applied")
        else:
            print("Changes applied")
        print("DONE!")


@transaction.atomic
def migrate(apply=False):
    related_fields = ["project", "related_project"]

    modified_projects = []
    # Handle parent child relationships
    parent_child_related_projects = RelatedProject.objects.filter(
        relation__in=[RelatedProject.PROJECT_RELATION_CHILD, RelatedProject.PROJECT_RELATION_CHILD],
        related_project__isnull=False,
    )
    for rp in parent_child_related_projects.select_related(*related_fields):
        if rp.relation == RelatedProject.PROJECT_RELATION_CHILD:
            rp.project.set_parent(rp.related_project)
            modified_projects.append(rp.project)
        else:
            rp.related_project.set_parent(rp.project)
            modified_projects.append(rp.related_project)
    Project.objects.bulk_update(modified_projects, ["path"])
    parent_child_related_projects.delete()

    modified_projects = []
    # Handle siblings that now have parents
    siblings_with_parents = RelatedProject.objects.filter(
        relation__in=[RelatedProject.PROJECT_RELATION_SIBLING],
        related_project__isnull=False,
        related_project__path__match="*{2,}",  # Has a parent
    )
    siblings_without_parents = RelatedProject.objects.filter(
        related_project__isnull=False,
        relation__in=[RelatedProject.PROJECT_RELATION_SIBLING],
        related_project__path__match="*{1}",  # Has no parent
    )
    print(f"siblings with parents before {siblings_with_parents.count()}")
    print(f"siblings without parents before {siblings_without_parents.count()}")
    for rp in siblings_with_parents.select_related(*related_fields):
        rp.project.set_parent(rp.related_project.parent())
        modified_projects.append(rp.project)

    print(f"siblings without parents after {siblings_without_parents.count()}")
    siblings_with_parents.delete()
    print(f"siblings with parents after {siblings_with_parents.count()}")

    sibling_with_parent = RelatedProject.objects.filter(
        relation__in=[RelatedProject.PROJECT_RELATION_SIBLING],
        related_project__isnull=False,
        related_project__path__match="*{1}",  # Has a parent
        project__path__match="*{2,}",  # Has a parent
    )
    print(f"sibling with parent before {sibling_with_parent.count()}")
    for rp in sibling_with_parent.select_related(*related_fields):
        rp.related_project.set_parent(rp.project.parent())
        modified_projects.append(rp.project)
    sibling_with_parent.delete()
    print(f"sibling with parent after {sibling_with_parent.count()}")
    #
    Project.objects.bulk_update(modified_projects, ["path"])
    #
    # # TODO: Handle siblings that still don't have parents
    #
    roots = Project.objects.filter(path__match="*{1}")
    # trees = [root.get_descendants_tree() for root in roots]

    if not apply:
        raise InterruptedError()
