# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from . import utils

CHART_COLOR_BASE = '#fcab26'


def render_report(request, project_id):
    project = get_object_or_404(
        Project.objects.prefetch_related('sectors', 'project_updates'),
        pk=project_id
    )
    project_view = utils.ProjectProxy(project)
    project_updates = [utils.ProjectUpdateProxy(u) for u in project.project_updates.all()[:4]]
    funding_partners = get_funding_partners(project_view)
    html = render_to_string('reports/project-overview.html', context={
        'project': project_view,
        'project_updates': project_updates,
        'funding_partners': funding_partners,
    })

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = f'project-{project.id}-overview.pdf'

    return utils.make_pdf_response(html, filename)


def get_funding_partners(project_view):
    partners_count = project_view.partners.count()
    funding_partners = project_view.funding_partners
    color_steps = round(100 / partners_count) if partners_count else 0
    for i, partner in enumerate(funding_partners):
        partner['color'] = utils.lighten_color(CHART_COLOR_BASE, i * color_steps)
    return funding_partners
