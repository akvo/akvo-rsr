# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand

from akvo.rsr.models import Project

children_9010 = [
    7591, 7628, 7669, 7672, 7734, 7735, 7854, 7981,
    7985, 7987, 7988, 7989, 8008, 8012, 8088, 8098, 8099, 8122, 8138,
    8136, 8139, 8140, 8150, 8151, 8153, 8170, 8228, 8229, 8230, 8432,
    8438, 8548, 8550, 8551, 8552, 8572, 8599, 8600, 8605, 8624, 8627,
    8694, 8700, 8705, 8723, 8725, 8730, 8731, 8732, 8771, 9545,
]

children_8837 = [
    8032, 8036, 8037, 8039, 8040, 8048, 8049, 8053, 8054,
    8055, 8057, 8074
]

class Command(BaseCommand):
    args = ''
    help = ('Script to change projects for some Nuffic projects')

    def handle(self, *args, **options):
        parent = Project.objects.get(id=9010)
        to_change = Project.objects.filter(id__in=children_9010)
        for project in to_change:
            print(f"Modifying project {project.id}")
            project.change_project_parent(parent)

        parent = Project.objects.get(id=8837)
        to_change = Project.objects.filter(id__in=children_8837)
        for project in to_change:
            print(f"Modifying project {project.id}")
            project.change_project_parent(parent)
