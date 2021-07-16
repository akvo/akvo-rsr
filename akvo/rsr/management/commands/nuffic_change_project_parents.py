# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from akvo.rsr.models import Project
from akvo.rsr.usecases import change_project_parent as cmd

project_to_new_parent_pairs = [
    (9545, 9010),
    (8136, 9010),
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
]


class Command(BaseCommand):

    def handle(self, *args, **options):
        verbosity = int(options['verbosity'])
        for (project_id, new_parent_id) in project_to_new_parent_pairs:
            project = Project.objects.get(id=project_id)
            new_parent = Project.objects.get(id=new_parent_id)
            cmd.change_parent(project, new_parent, verbosity)
