# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from akvo.rsr.models import ProjectUpdate
from django.shortcuts import get_object_or_404, render


def directory(request):
    context = {'updates': ProjectUpdate.objects.all()}
    return render(request, 'update_directory.html', context)


def main(request, update_id):
    context = {'update': get_object_or_404(ProjectUpdate, pk=update_id)}
    return render(request, 'update_main.html', context)
