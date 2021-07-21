# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from akvo.rsr.models import Project, IndicatorPeriodData, ProjectHierarchy
from akvo.rsr.usecases import change_project_parent as cmd

PROJECT_TO_NEW_PARENT_PAIRS = [
    (9545, 9010),
    (8136, 9010),
    (8771, 9010),
    (8732, 9010),
    (8731, 9010),
    (8730, 9010),
    (8725, 9010),
    (8723, 9010),
    (8705, 9010),
    (8700, 9010),
    (8694, 9010),
    (8627, 9010),
    (8624, 9010),
    (8605, 9010),
    (8600, 9010),
    (8599, 9010),
    (8572, 9010),
    (8552, 9010),
    (8551, 9010),
    (8550, 9010),
    (8548, 9010),
    (8438, 9010),
    (8432, 9010),
    (8230, 9010),
    (8229, 9010),
    (8228, 9010),
    (8170, 9010),
    (8153, 9010),
    (8151, 9010),
    (8150, 9010),
    (8140, 9010),
    (8139, 9010),
    (8138, 9010),
    (8122, 9010),
    (8099, 9010),
    (8098, 9010),
    (8088, 9010),
    (8012, 9010),
    (8008, 9010),
    (7989, 9010),
    (7988, 9010),
    (7987, 9010),
    (7985, 9010),
    (7981, 9010),
    (7854, 9010),
    (7735, 9010),
    (7734, 9010),
    (7672, 9010),
    (7669, 9010),
    (7628, 9010),
    (7591, 9010),
    (8032, 8837),
    (8036, 8837),
    (8037, 8837),
    (8039, 8837),
    (8040, 8837),
    (8048, 8837),
    (8049, 8837),
    (8053, 8837),
    (8054, 8837),
    (8055, 8837),
    (8057, 8837),
    (8074, 8837),
    (8081, 8837),
]

TOBE_DELETED_LIST = [8697, 9225]

NOT_A_PROGRAM_LIST = [9311, 9291]


def change_parent(project_id, new_parent_id, verbosity):
    try:
        project = Project.objects.get(id=project_id)
        new_parent = Project.objects.get(id=new_parent_id)
    except Project.DoesNotExist:
        print("Project not found")
        return
    cmd.change_parent(project, new_parent, verbosity)


def delete_project(project_id, verbosity):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        print(f"Project ID: {project_id} not found")
        return
    updates = IndicatorPeriodData.objects.filter(period__indicator__result__project=project_id)
    if verbosity > 0:
        print(f"Deleting project {project.title} (ID: {project.pk})")
        print(f"Deleting {updates.count()} period updates")
    updates.delete()
    project.delete()


def delete_project_hierarchy(project_id, verbosity):
    try:
        project = Project.objects.get(id=project_id)
        program = ProjectHierarchy.objects.get(root_project=project)
    except Project.DoesNotExist:
        print(f"Project ID: {project_id} not found")
        return
    except ProjectHierarchy.DoesNotExist:
        print(f"Program with root project ID: {project_id} not found")
        return
    if verbosity > 0:
        print(f"Deleting program with project {project.title} (ID: {project.id} as root")
    program.delete()


class Command(BaseCommand):

    def handle(self, *args, **options):
        verbosity = int(options['verbosity'])
        for (project_id, new_parent_id) in PROJECT_TO_NEW_PARENT_PAIRS:
            change_parent(project_id, new_parent_id, verbosity)
        for project_id in TOBE_DELETED_LIST:
            delete_project(project_id, verbosity)
        for project_id in NOT_A_PROGRAM_LIST:
            delete_project_hierarchy(project_id, verbosity)
