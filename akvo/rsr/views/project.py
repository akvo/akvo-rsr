# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import json
from datetime import datetime
from sorl.thumbnail import get_thumbnail

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from lxml import etree

from akvo.rsr.models import IndicatorPeriodData
from .utils import check_project_viewing_permissions
from ..forms import ProjectUpdateForm
from ..filters import (create_project_filter_class, remove_empty_querydict_items)
from ..models import Project, ProjectUpdate
from ...utils import pagination, filter_query_string
from ...iati.exports.iati_export import IatiXML
from akvo.codelists.models import SectorCategory, Sector, Version


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


def directory(request):
    """The project list view."""
    qs = remove_empty_querydict_items(request.GET)

    # iati_status was renamed to sector in fa8094647b
    if 'status' not in qs:
        qs['status'] = qs.pop('iati_status', [''])[0]

    # Set show_filters to "in" if any filter is selected
    show_filters = "in"  # To simplify template use bootstrap class
    available_filters = [
        'location', 'status', 'iati_status', 'organisation', 'sector', 'keyword', 'sort_by'
    ]
    if frozenset(qs.keys()).isdisjoint(available_filters):
        show_filters = ""

    # Prepare sorting
    available_sorting = ['last_modified_at', '-last_modified_at', 'title',
                         '-title', 'budget', '-budget', ]
    sort_by = request.GET.get('sort_by', '-last_modified_at')
    sorting = sort_by if sort_by in available_sorting else '-last_modified_at'

    # Yank project collection
    all_projects = _project_directory_coll(request)
    project_filter = create_project_filter_class(request, all_projects)
    f = project_filter(qs, queryset=all_projects)
    sorted_projects = f.qs.distinct().order_by(sorting)

    # Build page
    page_number = request.GET.get('page')
    limit = request.GET.get('limit', settings.PROJECT_DIRECTORY_PAGE_SIZES[0])
    limit = min(int(limit), settings.PROJECT_DIRECTORY_PAGE_SIZES[-1])
    page, paginator, page_range = pagination(page_number, sorted_projects, limit)
    start_index = page.start_index()
    page_info = [
        (start_index // size + 1, size)
        for size in settings.PROJECT_DIRECTORY_PAGE_SIZES
    ]

    # Get the current org filter for typeahead
    org_filter = request.GET.get('organisation', '')

    # Get projects to be displayed on the map
    if request.rsr_page and request.rsr_page.all_maps:
        map_projects = all_projects
    else:
        map_projects = page.object_list
    map_projects = map_projects.select_related('primary_location')

    # Get related objects of page at once
    page.object_list = page.object_list.prefetch_related(
        'publishingstatus',
        'recipient_countries',
        'locations',
        'locations__country',
        'sectors',
        'budget_items',
        'partnerships__organisation',
    ).select_related(
        'primary_organisation',
        'last_update'
    )

    # Get all sector categories in a dict
    try:
        iati_version_obj = Version.objects.get(code=settings.IATI_VERSION)
        sector_cats = SectorCategory.objects.filter(version=iati_version_obj)
        sectors = Sector.objects.filter(version=iati_version_obj)
    except (Version.MultipleObjectsReturned, Version.DoesNotExist):
        sector_cats = []
        sectors = []

    sectors_dict = {}
    for sector_cat in sector_cats:
        sectors_dict[str(sector_cat.code)] = sector_cat.name
    for sector in sectors:
        sectors_dict[str(sector.code)] = sector.name

    context = {
        'project_count': sorted_projects.count(),
        'filter': f,
        'page_info': page_info,
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
        'show_filters': show_filters,
        'q': filter_query_string(qs),
        'sorting': sorting,
        'current_org': org_filter,
        'map_projects': map_projects,
        'sectors_dict': sectors_dict,
        'limit': limit,
    }
    return render(request, 'project_directory.html', context)


###############################################################################
# Project main
###############################################################################

def _get_carousel_data(project, updates):
    photos = []
    if project.current_image:
        try:
            im = get_thumbnail(project.current_image, '750x400', quality=99)
            photos.append({
                "url": im.url,
                "caption": project.current_image_caption,
                "credit": project.current_image_credit,
                "direct_to_url": '',
            })
        except IOError:
            pass
    for update in updates:
        if update.photo:
            direct_to = reverse('update-main', kwargs={
                'project_id': project.pk,
                'update_id': update.pk
            })
            try:
                im = get_thumbnail(update.photo, '750x400', quality=99)
                photos.append({
                    "url": im.url,
                    "caption": update.photo_caption,
                    "credit": update.photo_credit,
                    "direct_to_url": direct_to,
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


def main(request, project_id, template="project_main.html"):
    """
    The main project page, consisting of 6 tabs:

    - 'Summary'
    - 'Full report'
    - 'Project partners'
    - 'Finances'
    - 'Results' (optional, only when project has results)
    - 'Updates' (optional, only when project has updates)

    :param request; Django request.
    :param project_id; ID of a Project object.
    :return A rendered project page.
    """
    project = get_object_or_404(Project, pk=project_id)

    # Permissions
    check_project_viewing_permissions(request.user, project)

    # Updates
    updates = project.project_updates.prefetch_related('user').order_by('-created_at')
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, updates, 10)

    # Related documents
    related_documents = []
    for d in project.documents.all():
        if d.url or d.document:
            related_documents += [d]
    related_documents = related_documents[:5]

    # JSON data
    carousel_data = json.dumps(_get_carousel_data(project, updates[:9]))
    accordion_data = json.dumps({
        'background': project.background,
        'current_status': project.current_status,
        'project_plan': project.project_plan,
        'target_group': project.target_group,
        'sustainability': project.sustainability,
        'goals_overview': project.goals_overview
    })

    context = {
        'accordion_data': accordion_data,
        'carousel_data': carousel_data,
        'current_datetime': datetime.now(),
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
        'pledged': project.get_pledged(),
        'project': project,
        'related_documents': related_documents,
        'updates': updates[:5] if updates else None,
        'update_timeout': settings.PROJECT_UPDATE_TIMEOUT,
        'update_statuses': json.dumps(dict(IndicatorPeriodData.STATUSES)),
        'user_is_me_manager': 'false',
    }

    return render(request, template, context)


#####################
# Project hierarchy #
#####################


def hierarchy(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)

    # Non-editors are not allowed to view unpublished projects
    check_project_viewing_permissions(request.user, project)

    if not project.has_relations():
        raise Http404

    hierarchy_grid = _get_hierarchy_grid(project)

    context = {
        'project': project,
        'hierarchy_grid': hierarchy_grid,
    }

    return render(request, 'project_hierarchy.html', context)


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
            (not project.is_published() and not request.user.is_anonymous() and
             not request.user.has_perm('rsr.change_project', project)):
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


@login_required()
def set_update(request, project_id, edit_mode=False, form_class=ProjectUpdateForm, update_id=None):
    """."""
    project = get_object_or_404(Project, id=project_id)

    # Permissions
    check_project_viewing_permissions(request.user, project)

    # Check if user is allowed to place updates for this project
    allow_update = True if request.user.has_perm('rsr.post_updates', project) else False

    updates = project.updates_desc()[:5]
    update = None
    update_user = None

    if update_id is not None:
        edit_mode = True
        update = get_object_or_404(ProjectUpdate, id=update_id)
        update_user = update.user.get_full_name()
        if not request.user == update.user and not request.user.can_edit_update(update):
            request.error_message = u'You can only edit your own updates.'
            raise PermissionDenied

    # Prevent adding update if project is completed, cancelled or unpublished
    elif project.iati_status in Project.EDIT_DISABLED or not project.is_published():
        request.error_message = u'Cannot add updates to completed or unpublished projects.'
        raise PermissionDenied

    if request.method == 'POST':
        updateform = form_class(request.POST, request.FILES, instance=update)
        if updateform.is_valid():
            if update:
                update = updateform.save(project=project, user=update.user)
            else:
                update = updateform.save(project=project, user=request.user)
            return redirect(update.get_absolute_url())
        else:
            # Django forms takes care of this, and displays the errors!
            pass
    else:
        updateform = form_class(instance=update)

    context = {
        'project': project,
        'updates': updates,
        'update': update,
        'update_user': update_user,
        'updateform': updateform,
        'edit_mode': edit_mode,
        'allow_update': allow_update
    }

    return render(request, 'update_add.html', context)
