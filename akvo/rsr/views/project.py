# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from akvo.rsr.models import Project
from django.shortcuts import get_object_or_404, render


def directory(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'project_directory.html', context)


def main(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    updates = project.project_updates.all().order_by('-created_at')

    context = {'project': project,
               'updates': updates}
    return render(request, 'project_main.html', context)


def search(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'project_search.html', context)
