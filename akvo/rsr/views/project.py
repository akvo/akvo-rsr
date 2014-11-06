# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.filters import remove_empty_querydict_items, ProjectFilterSet
from akvo.rsr.models import Project
from akvo.utils import pagination


from django.shortcuts import get_object_or_404, render


def directory(request):
    f = ProjectFilterSet(remove_empty_querydict_items(request.GET) or None,
                         queryset = Project.objects.published())

    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, f.qs, 10)

    context = {
        'filter': f,
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        }
    return render(request, 'project_directory.html', context)


def main(request, project_id):
    project = get_object_or_404(Project, pk=project_id)

    accordion_data = dict()
    accordion_data['background'] = project.background
    accordion_data['current_status'] = project.current_status
    accordion_data['project_plan'] = project.project_plan
    accordion_data['target_group'] = project.target_group
    accordion_data['sustainability'] = project.sustainability

    updates = project.project_updates.all().order_by('-created_at')

    context = {
        'accordion_data': json.dumps(accordion_data),
        'project': project,
        'updates': updates,
    }

    return render(request, 'project_main.html', context)


def search(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'project_search.html', context)
