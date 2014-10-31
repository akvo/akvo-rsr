# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import ProjectUpdate, Project
from akvo.utils import pagination

from django.shortcuts import get_object_or_404, render


def directory(request):
    updates_list = ProjectUpdate.objects.all()
    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, updates_list, 10)

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        }
    return render(request, 'update_directory.html', context)


def main(request, project_id, update_id):
    context = {'update': get_object_or_404(ProjectUpdate, pk=update_id,
                                           project=project_id)}
    return render(request, 'update_main.html', context)


def project_updates(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    context = {
        'updates': ProjectUpdate.objects.filter(project=project),
        'project': project
    }
    return render(request, 'project_updates.html', context)
