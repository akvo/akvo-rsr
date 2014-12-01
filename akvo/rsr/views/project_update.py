# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from ..filters import remove_empty_querydict_items, ProjectUpdateFilter
from ..models import ProjectUpdate, Project
from ...utils import pagination

from django.shortcuts import get_object_or_404, render


def directory(request):
    qs = remove_empty_querydict_items(request.GET)
    f = ProjectUpdateFilter(qs, queryset=ProjectUpdate.objects.all())

    show_filters = "in"
    available_filters = ['continent', 'status', 'organisation', 'focus_area', ]
    if frozenset(qs.keys()).isdisjoint(available_filters):
        show_filters = ""

    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, f.qs, 10)

    context = {
        'filter': f,
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
        'show_filters': show_filters,
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
