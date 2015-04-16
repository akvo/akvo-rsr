# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

from django.shortcuts import get_object_or_404, render

from ..filters import remove_empty_querydict_items, ProjectUpdateFilter
from ..models import ProjectUpdate, Project
from ...utils import pagination, filter_query_string
from .utils import apply_keywords, org_projects, show_filter_class


###############################################################################
# Projectupdate directory
###############################################################################


def _all_updates():
    """Return all project updates."""
    return ProjectUpdate.objects.all().order_by('-id')


def _page_updates(page):
    """Dig out the list or project updates to use."""
    org = page.organisation
    if page.partner_projects:
        projects = apply_keywords(page, org_projects(org))
        return projects.all_updates().order_by('-id')
    else:
        return _all_updates()


def _update_directory_coll(request):
    """Dig out and pass correct projects to the view."""
    page = request.rsr_page
    if not page:
        return _all_updates()
    return _page_updates(page)


def directory(request):
    """The projectupdate list view."""
    qs = remove_empty_querydict_items(request.GET)

    # Set show_filters to "in" if any filter is selected
    filter_class = show_filter_class(qs, ['location', 'partner', 'sector', ])

    # Yank projectupdate collection
    f = ProjectUpdateFilter(qs, queryset=_update_directory_coll(request))

    # Build page
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, f.qs.distinct(), 10)

    return render(request, 'update_directory.html', {
        'updates_count': f.qs.distinct().count(),
        'filter': f,
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
        'show_filters': filter_class,
        'q': filter_query_string(qs)
        })


def main(request, project_id, update_id):
    """The projectupdate main view."""
    project = get_object_or_404(Project, pk=project_id)
    update = get_object_or_404(ProjectUpdate, pk=update_id, project=project_id)
    other_updates = project.updates_desc().exclude(pk=update_id)[:5]
    context = {
        'update': update,
        'other_updates': other_updates,
        'project': project,
    }
    return render(request, 'update_main.html', context)


def project_updates(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    updates = ProjectUpdate.objects.filter(project=project)

    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, updates, 10)

    context = {
        'updates': updates,
        'project': project,
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
    }
    return render(request, 'project_updates.html', context)
