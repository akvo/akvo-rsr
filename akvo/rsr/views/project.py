# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import datetime
import json

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.core.paginator import Page
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from lxml import etree

from akvo.rsr.models import IndicatorPeriodData
from akvo.utils import get_thumbnail
from .utils import check_project_viewing_permissions, get_hierarchy_grid
from ..models import Project
from ...utils import pagination
from ...iati.exports.iati_export import IatiXML


###############################################################################
# Project directory
###############################################################################


def _project_directory_coll(request):
    """Dig out and pass correct projects to the view."""
    page = request.rsr_page
    return (
        page.projects() if page is not None
        else Project.objects.public().published()
    )


def redirect_to(request, path):
    scheme = request.scheme
    host = request.get_host()
    url = f"{scheme}://{host}{path}"
    return redirect(url)


def directory(request):
    """The project list view."""
    return redirect_to(request, '/')


###############################################################################
# Project main
###############################################################################


def main(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    return redirect_to(request, f'/dir/project/{project.id}')


#####################
# Project hierarchy #
#####################


def hierarchy(request, project_id, public=True, template='project_hierarchy.html'):
    """."""
    project = get_object_or_404(Project, pk=project_id)

    # Non-editors are not allowed to view unpublished projects
    check_project_viewing_permissions(request, project)

    if public and not project.has_relations():
        raise Http404

    hierarchy_grid = get_hierarchy_grid(project, include_private=not public)

    context = {
        'project': project,
        'hierarchy_grid': hierarchy_grid,
    }

    return render(request, template, context)


###############################################################################################
# Old links, now incorporated in tabs of the project main page, will redirect to project main #
###############################################################################################


def report(request, project_id):
    """Show the full data report tab on the project main page."""
    return HttpResponseRedirect(
        reverse('project-main', kwargs={'project_id': project_id}) + '#report'
    )


def partners(request, project_id):
    """Show the partners tab on the project main page."""
    return HttpResponseRedirect(
        reverse('project-main', kwargs={'project_id': project_id}) + '#partners'
    )


def finance(request, project_id):
    """Show finance tab on the project main page."""
    return HttpResponseRedirect(
        reverse('project-main', kwargs={'project_id': project_id}) + '#finance'
    )

###############################################################################
# Project IATI file
###############################################################################


def iati(request, project_id):
    """Generate the IATI file on-the-fly and return the XML."""
    project = get_object_or_404(Project, pk=project_id)
    if not project.is_public:
        raise PermissionDenied
    xml_data = etree.tostring(etree.ElementTree(IatiXML([project]).iati_activities))
    return HttpResponse(xml_data, content_type="text/xml")


###############################################################################
# Project widgets
###############################################################################


def widgets(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)
    selected_widget = request.GET.get('widget', None)

    # Do not show private projects, and non-editors are not allowed to view unpublished projects
    if not project.is_public or \
            (not project.is_published() and not request.user.is_anonymous
             and not request.user.has_perm('rsr.change_project', project)):
        raise PermissionDenied

    context = {
        'project': project,
        'style': 'darkBG',
    }

    if selected_widget in ['narrow', 'cobranded', 'small', 'map', 'list']:
        context['widget'] = selected_widget
        context['domain_url'] = '{}://{}'.format(request.scheme, request.META['HTTP_HOST'])
        return render(request, 'project_widgets2.html', context)

    else:
        return render(request, 'project_widgets.html', context)
