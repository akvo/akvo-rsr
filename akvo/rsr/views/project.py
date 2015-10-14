# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import json
import django_filters

from sorl.thumbnail import get_thumbnail
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.translation import ugettext_lazy as _
from lxml import etree

from ..forms import ProjectUpdateForm
from ..filters import (build_choices, location_choices, ProjectFilter,
                       remove_empty_querydict_items)
from ..models import Invoice, Project, ProjectUpdate, Organisation
from ...utils import pagination, filter_query_string
from ...iati.exports.iati_export import IatiXML
from .utils import apply_keywords, org_projects
from .organisation import _page_organisations


###############################################################################
# Project directory
###############################################################################


def _all_projects():
    """Return all active projects."""
    return Project.objects.published().select_related(
        'publishingstatus__status',
        # TODO: remove
        # 'sync_owner',
        'primary_location',
        'primary_location__country'
        'locations',
        'partnerships',
        'partnerships__organisation',
        'sectors',
        'partners',
    ).order_by('-id')


def _page_projects(page):
    """Dig out the list of projects to use.

    First get a list based on page settings (orgs or all projects). Then apply
    keywords filtering / exclusion.
    """
    projects = org_projects(page.organisation) if page.partner_projects else _all_projects()
    return apply_keywords(page, projects)


def _project_directory_coll(request):
    """Dig out and pass correct projects to the view."""
    page = request.rsr_page
    if not page:
        return _all_projects()
    return _page_projects(page)


def directory(request):
    """The project list view."""
    qs = remove_empty_querydict_items(request.GET)

    # Set show_filters to "in" if any filter is selected
    show_filters = "in"  # To simplify template use bootstrap class
    available_filters = ['location', 'status', 'organisation', 'sector', 'sort_by']
    if frozenset(qs.keys()).isdisjoint(available_filters):
        show_filters = ""

    # Prepare sorting
    available_sorting = ['last_modified_at', '-last_modified_at', 'title',
                         '-title', 'budget', '-budget', ]
    sort_by = request.GET.get('sort_by', '-last_modified_at')
    sorting = sort_by if sort_by in available_sorting else '-last_modified_at'

    # Yank project collection
    all_projects = _project_directory_coll(request)
    f = ProjectFilter(qs, queryset=all_projects)

    # Filter location filter list to only populated locations
    f.filters['location'].extra['choices'] = location_choices(all_projects)
    # Swap to choice filter for RSR pages
    if request.rsr_page:
        f.filters['organisation'] = django_filters.ChoiceFilter(
            choices=build_choices(_page_organisations(request.rsr_page)),
            label=_(u'organisation'),
            name='partners__id')

    sorted_projects = f.qs.distinct().order_by(sorting)

    # Build page
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, sorted_projects, 10)

    # Get the current org filter for typeahead
    org_filter = request.GET.get('organisation', '')

    # Get projects to be displayed on the map
    map_projects = all_projects if request.rsr_page and request.rsr_page.all_maps else page

    context = {
        'project_count': sorted_projects.count(),
        'filter': f,
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
        'show_filters': show_filters,
        'q': filter_query_string(qs),
        'sorting': sorting,
        'current_org': org_filter,
        'map_projects': map_projects,
    }
    return render(request, 'project_directory.html', context)


###############################################################################
# Project main
###############################################################################


def _get_accordion_data(project):
    accordion_data = dict()
    accordion_data['background'] = project.background
    accordion_data['current_status'] = project.current_status
    accordion_data['project_plan'] = project.project_plan
    accordion_data['target_group'] = project.target_group
    accordion_data['sustainability'] = project.sustainability
    accordion_data['goals_overview'] = project.goals_overview
    if project.results.all():
        results_data = []
        for result in project.results.all():
            result_data = dict()
            result_data['id'] = str(result.pk)
            result_data['title'] = result.title
            indicators_data = []
            for indicator in result.indicators.all():
                for period in indicator.periods.all().order_by('period_start'):
                    indicator_data = dict()
                    indicator_data['id'] = str(period.pk)
                    indicator_data['title'] = indicator.title
                    if period.period_start:
                        indicator_data['period_start'] = period.period_start.strftime("%d-%m-%Y")
                    if period.period_end:
                        indicator_data['period_end'] = period.period_end.strftime("%d-%m-%Y")
                    indicator_data['target_value'] = period.target_value
                    indicator_data['actual_value'] = period.actual_value
                    indicators_data.append(indicator_data)
                if not indicator.periods.all():
                    indicator_data = dict()
                    indicator_data['id'] = str(indicator.pk)
                    indicator_data['title'] = indicator.title
                    indicators_data.append(indicator_data)
            result_data['indicators'] = indicators_data
            results_data.append(result_data)
        accordion_data['results'] = results_data
    return accordion_data


def _get_timeline_data(project):
    timeline_data = {'timeline': {'type': 'default'}}
    timeline_dates = []

    # Project start and end dates
    # TODO: fix when no planned start date
    date_start = (project.date_start_actual, 'Start', 'actual') if project.date_start_actual else \
        (project.date_start_planned, 'Start', 'planned')
    date_end = (project.date_end_actual, 'End', 'actual') if project.date_end_actual else \
        (project.date_end_planned, 'End', 'planned') if project.date_end_planned else None

    for date in (date_start, date_end):
        if date:
            headline = date[1] + " date of project"
            if not date[2] == 'actual':
                headline += " (planned)"
            timeline_dates.append({
                'startDate': ','.join((str(date[0].year), str(date[0].month), str(date[0].day))),
                'headline': headline,
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
        try:
            im = get_thumbnail(project.current_image, '750x400', quality=99)
            photos.append({
                "url": im.url,
                "caption": project.current_image_caption,
                "credit": project.current_image_credit,
                "original_url": project.current_image.url,
            })
        except IOError:
            pass
    for update in project.updates_desc():
        if len(photos) > 9:
            break
        if update.photo:
            try:
                im = get_thumbnail(update.photo, '750x400', quality=99)
                photos.append({
                    "url": im.url,
                    "caption": update.photo_caption,
                    "credit": update.photo_credit,
                    "original_url": update.photo.url,
                })
            except IOError:
                continue
    return {"photos": photos}


def _get_hierarchy_row(max_rows, projects):
    """Return a column for the project hierarchy with a division.

    E.g. with a max_rows of 4 and one project, it will return [False,
    <Project>, False, False].
    """
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


def main(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)

    # Non-editors are not allowed to view unpublished projects
    if not project.is_published() and not request.user.has_perm('rsr.change_project', project):
        raise PermissionDenied

    carousel_data = _get_carousel_data(project)
    updates = project.project_updates.all().order_by('-created_at')[:5]
    accordion_data = _get_accordion_data(project)
    # timeline_data = _get_timeline_data(project)

    context = {
        'accordion_data': json.dumps(accordion_data),
        'carousel_data': json.dumps(carousel_data),
        'project': project,
        # 'timeline_data': json.dumps(timeline_data),
        'updates': updates,
    }

    return render(request, 'project_main.html', context)


###############################################################################
# Project hierarchy
###############################################################################


def hierarchy(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)

    # Non-editors are not allowed to view unpublished projects
    if not project.is_published() and not request.user.has_perm('rsr.change_project', project):
        raise PermissionDenied

    if not project.has_relations():
        raise Http404

    hierarchy_grid = _get_hierarchy_grid(project)

    context = {
        'project': project,
        'hierarchy_grid': hierarchy_grid,
    }

    return render(request, 'project_hierarchy.html', context)


###############################################################################
# Project report
###############################################################################


def report(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)

    # Non-editors are not allowed to view unpublished projects
    if not project.is_published() and not request.user.has_perm('rsr.change_project', project):
        raise PermissionDenied

    context = {
        'project': project,
    }

    return render(request, 'project_report.html', context)

###############################################################################
# Project IATI file
###############################################################################


def iati(request, project_id):
    """Generate the IATI file on-the-fly and return the XML."""
    iati_activities = IatiXML(Project.objects.filter(pk=project_id)).iati_activities
    xml_data = etree.tostring(etree.ElementTree(iati_activities))
    return HttpResponse(xml_data, content_type="text/xml")


###############################################################################
# Project widgets
###############################################################################


def widgets(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)
    selected_widget = request.GET.get('widget', None)

    # Non-editors are not allowed to view unpublished projects
    if not project.is_published() and not request.user.has_perm('rsr.change_project', project):
        raise PermissionDenied

    context = {
        'project': project,
        'style': 'darkBG',
    }

    if selected_widget in ['narrow', 'cobranded', 'small', 'map', 'list']:
        context['widget'] = selected_widget
        context['domain_url'] = 'http://' + request.META['HTTP_HOST']
        return render(request, 'project_widgets2.html', context)

    else:
        return render(request, 'project_widgets.html', context)


@login_required()
def set_update(request, project_id, edit_mode=False, form_class=ProjectUpdateForm, update_id=None):
    """."""
    project = get_object_or_404(Project, id=project_id)

    # Non-editors are not allowed to view unpublished projects
    if not project.is_published() and not request.user.has_perm('rsr.change_project', project):
        raise PermissionDenied

    # Check if user is allowed to place updates for this project
    allow_update = False
    if request.user.has_perm('rsr.post_updates', project):
        allow_update = True

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
        'allow_update': allow_update
    }

    return render(request, 'update_add.html', context)


def search(request):
    """."""
    context = {'projects': Project.objects.published()}
    return render(request, 'project_search.html', context)


def partners(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)
    partners = project.all_partners().values()
    for partner in partners:
        id_key = "id".decode('unicode-escape')
        p = Organisation.objects.get(pk=partner[id_key])
        partner['partner_types'] = p.has_partner_types(project)
        partner['organisation_obj'] = p
    context = {
        'project': project,
        'partners': partners,
    }
    return render(request, 'project_partners.html', context)


def finance(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)
    pledged = project.get_pledged()
    context = {
        'project': project,
        'pledged': pledged,
    }
    return render(request, 'project_finance.html', context)


def donations_disabled(project):
    """."""
    return not project.donate_button


def can_accept_donations(project):
    """."""
    if project in Project.objects.active() and project.funds_needed > 0:
        return True
    else:
        return False


def donate(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)

    if not project.accepts_donations():
        raise Http404

    context = {
        'project': project
    }
    return render(request, 'project_donate.html', context)
