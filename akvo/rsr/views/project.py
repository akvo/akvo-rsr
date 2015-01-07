# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from ..forms import ProjectUpdateForm
from ..filters import remove_empty_querydict_items, ProjectFilter
from ..models import Invoice, Project, ProjectUpdate
from ...utils import pagination, filter_query_string

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect, render
from django.template import RequestContext


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
        if len(photos) > 9:
            break
        if update.photo:
            photos.append({
                "url": update.photo.url,
                "caption": update.photo_caption,
                "credit": update.photo_credit,
            })
    return {"photos": photos}

def _get_hierarchy_row(max_rows, projects):
    """Returns a column for the project hierarchy with a division.
    E.g. with a max_rows of 4 and one project, it will return [False, <Project>, False, False]."""
    project_count = projects.count()
    if max_rows == project_count:
        return [project for project in projects]
    empty_begin = (max_rows - project_count) / 2
    empty_end = (max_rows - project_count) / 2 + ((max_rows - project_count) % 2)
    rows = []
    for row in range(empty_begin):
        rows.append(False)
    for project in projects:
        rows.append(project)
    for row in range(empty_end):
        rows.append(False)
    return rows


def _get_hierarchy_grid(project):
    parents = project.parents()
    siblings = project.siblings()
    children = project.children()

    # Create the lay-out of the grid
    max_rows = max(parents.count(), siblings.count() + 1, children.count())
    parent_rows = _get_hierarchy_row(max_rows, parents)
    siblings_rows = _get_hierarchy_row(max_rows - 1, siblings)
    siblings_rows.insert((max_rows - 1) / 2, 'project')
    children_rows = _get_hierarchy_row(max_rows, children)

    grid = []
    project_added = False
    for row in range(max_rows):
        grid.append([])
        grid[row].append([parent_rows[row], 'parent']) if parent_rows[row] else grid[row].append(None)
        if siblings_rows[row] == 'project':
            grid[row].append([project, 'project'])
            project_added = True
        elif not project_added:
            grid[row].append([siblings_rows[row], 'sibling-top']) if siblings_rows[row] else grid[row].append(None)
        else:
            grid[row].append([siblings_rows[row], 'sibling-bottom']) if siblings_rows[row] else grid[row].append(None)
        grid[row].append([children_rows[row], 'child']) if children_rows[row] else grid[row].append(None)

    return grid


def _get_project_partners(project):
    partners = {}
    for partner in project.all_partners():
        partners[partner] = partner.has_partner_types(project)
    return partners


def directory(request):
    qs = remove_empty_querydict_items(request.GET)
    projects = RequestContext(request)['projects_qs'] if request.rsr_page else Project.objects.published()
    f = ProjectFilter(qs, queryset=projects)

    # Instead of true or false, adhere to bootstrap3 class names to simplify
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
        'q': filter_query_string(qs)
    }
    return render(request, 'project_directory.html', context)


def main(request, project_id):
    project = get_object_or_404(Project, pk=project_id)

    # Non-editors are not allowed to view unpublished projects
    if not project.is_published() and not request.user.has_perm('rsr.change_project', project):
        raise PermissionDenied

    carousel_data = _get_carousel_data(project)
    updates = project.project_updates.all().order_by('-created_at')[:5]
    accordion_data = _get_accordion_data(project)
    timeline_data = _get_timeline_data(project)

    first_partner = project.first_partner()
    first_partner_info = (first_partner, first_partner.has_partner_types(project))
    partners = _get_project_partners(project)

    context = {
        'accordion_data': json.dumps(accordion_data),
        'carousel_data': json.dumps(carousel_data),
        'project': project,
        'timeline_data': json.dumps(timeline_data),
        'updates': updates,
        'first_partner': first_partner_info,
        'partners': partners,
    }

    return render(request, 'project_main.html', context)


def hierarchy(request, project_id):
    project = get_object_or_404(Project, pk=project_id)

    if not project.has_relations():
        raise Http404

    hierarchy_grid = _get_hierarchy_grid(project)

    context = {
        'project': project,
        'hierarchy_grid': hierarchy_grid,
    }

    return render(request, 'project_hierarchy.html', context)


@login_required()
def set_update(request, project_id, edit_mode=False, form_class=ProjectUpdateForm, update_id=None):
    project = get_object_or_404(Project, id=project_id)
    updates = project.updates_desc()[:5]
    update = None

    if update_id is not None:
        edit_mode = True
        update = get_object_or_404(ProjectUpdate, id=update_id)
        if not request.user == update.user:
            request.error_message = u'You can only edit your own updates.'
            raise PermissionDenied

        if update.edit_window_has_expired():
            request.error_message = u'You cannot edit this update anymore, the 30 minutes time limit has passed.'
            raise PermissionDenied

    if request.method == 'POST':
        updateform = form_class(request.POST, request.FILES, instance=update)
        if updateform.is_valid():
            update = updateform.save(project=project, user=request.user)
            return redirect(update.get_absolute_url())
    else:
        updateform = form_class(instance=update)

    context = {
        'project': project,
        'updates': updates,
        'update': update,
        'updateform': updateform,
        'edit_mode': edit_mode,
    }

    return render(request, 'update_add.html', context)


def search(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'project_search.html', context)
