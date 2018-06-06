# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render

from .utils import check_project_viewing_permissions
from ..models import ProjectUpdate, Project

###############################################################################
# Projectupdate directory
###############################################################################


def directory(request):
    return render(request, 'update_directory.html', {})


def main(request, project_id, update_id):
    """The projectupdate main view."""
    project = get_object_or_404(Project, pk=project_id)
    check_project_viewing_permissions(request.user, project)
    update = get_object_or_404(
        ProjectUpdate.objects.select_related('project', 'user'), pk=update_id, project=project_id
    )
    other_updates = project.updates_desc().exclude(pk=update_id)[:5]

    context = {
        'update': update,
        'other_updates': other_updates,
        'project': project,
    }
    return render(request, 'update_main.html', context)


def project_updates(request, project_id):
    """The list of updates for a single project."""
    return HttpResponseRedirect(
        reverse('project-main', kwargs={'project_id': project_id}) + '#updates'
    )
