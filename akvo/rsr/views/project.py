# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from ..models import Invoice, Project
from ...utils import pagination

from django.shortcuts import get_object_or_404, render


def _get_accordion_data(project):
    accordion_data = dict()
    accordion_data['background'] = project.background
    accordion_data['current_status'] = project.current_status
    accordion_data['project_plan'] = project.project_plan
    accordion_data['target_group'] = project.target_group
    accordion_data['sustainability'] = project.sustainability
    return accordion_data


def _get_timeline_data(project):
    timeline_data = {'timeline': {'type': 'default'}}
    timeline_dates = []

    # Project start and end dates
    date_start = (project.date_start_actual, 'Start', 'actual') if project.date_start_actual else \
        (project.date_start_planned, 'Start', 'planned')
    date_end = (project.date_end_actual, 'End', 'actual') if project.date_end_actual else \
        (project.date_end_planned, 'End', 'planned') if project.date_end_planned else None

    for date in (date_start, date_end):
        if date:
            timeline_dates.append({
                'startDate': ','.join((str(date[0].year), str(date[0].month), str(date[0].day))),
                'headline': date[1] + " date of project" if date[2] == 'actual' else date[1] +
                                                                                     " date of project (planned)",
            })

    # Project updates
    for update in project.updates_desc():
        date = update.last_modified_at
        timeline_dates.append({
            'startDate': ','.join((str(date.year), str(date.month), str(date.day))),
            'headline': 'Project update added',
            'text': '<a href="' + update.get_absolute_url() + '">' + update.title + '</a>',
            'asset': {
                'thumbnail': update.photo.url if update.photo else None,
                'media': update.photo.url if update.photo else None,
            }
        })

    # Donations
    for donation in Invoice.objects.filter(project=project):
        date = donation.time
        timeline_dates.append({
            'startDate': ','.join((str(date.year), str(date.month), str(date.day))),
            'headline': 'Donation added',
            'text': 'by ' + donation.name if donation.name else 'Anonymous',
        })

    timeline_data['timeline']['date'] = timeline_dates

    return timeline_data


def _get_carousel_data(project):
    photos = []
    if project.current_image:
        photos.append({
            "url": project.current_image.url,
            "caption": project.current_image_caption,
            "credit": project.current_image_credit,
        })
    for update in project.updates_desc():
        if update.photo:
            photos.append({
                "url": update.photo.url,
                "caption": update.photo_caption,
                "credit": update.photo_credit,
            })
    return {"photos": photos}



def directory(request):
    projects_list = Project.objects.published()
    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, projects_list, 10)

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        }
    return render(request, 'project_directory.html', context)


def main(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    carousel_data = _get_carousel_data(project)
    updates = project.project_updates.all().order_by('-created_at')
    accordion_data = _get_accordion_data(project)
    timeline_data = _get_timeline_data(project)

    context = {
        'accordion_data': json.dumps(accordion_data),
        'carousel_data': json.dumps(carousel_data),
        'project': project,
        'timeline_data': json.dumps(timeline_data),
        'updates': updates,
    }

    return render(request, 'project_main.html', context)


def search(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'project_search.html', context)
