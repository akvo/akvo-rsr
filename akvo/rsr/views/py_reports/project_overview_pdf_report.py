# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from matplotlib import pyplot
from io import BytesIO
from base64 import b64encode
from akvo.rsr.decorators import with_download_indicator
from akvo.rsr.models import Project
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from . import utils

CHART_COLOR_BASE = '#fcab26'
BACKGROUND_COLOR = '#eff3fc'


@with_download_indicator
def render_report(request, project_id):
    project = get_object_or_404(
        Project.objects.prefetch_related('sectors', 'project_updates'),
        pk=project_id
    )
    project_view = utils.ProjectProxy(project)
    project_updates = [utils.ProjectUpdateProxy(u) for u in project.project_updates.all()[:4]]
    funding_partners = get_funding_partners(project_view)
    funders_chart = get_funders_chart(funding_partners)
    html = render_to_string('reports/project-overview.html', context={
        'project': project_view,
        'project_updates': project_updates,
        'funding_partners': funding_partners,
        'funders_chart': funders_chart,
    })

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = f'project-{project.id}-overview.pdf'

    return utils.make_pdf_response(html, filename)


def get_funding_partners(project_view):
    funding_partners = project_view.funding_partners
    funding_partners_count = len(funding_partners)
    color_steps = round(100 / funding_partners_count) if funding_partners_count else 0
    for i, partner in enumerate(funding_partners):
        partner['color'] = utils.lighten_color(CHART_COLOR_BASE, i * color_steps)
    return funding_partners


def get_funders_chart(funding_partners):
    values = [p['amount'] for p in funding_partners]
    values.append(sum(values))
    colors = [p['color'] for p in funding_partners]
    colors.append(BACKGROUND_COLOR)

    figure = pyplot.figure(figsize=(8, 8), tight_layout=(0, 0, 0, 0), facecolor=BACKGROUND_COLOR)
    axes = figure.add_subplot(1, 1, 1)
    axes.pie(values, colors=colors, counterclock=False, startangle=180)
    axes.add_artist(pyplot.Circle((0, 0), 0.45, color=BACKGROUND_COLOR))

    buffer = BytesIO()
    figure.savefig(buffer)
    b64_image = b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()
    return b64_image
