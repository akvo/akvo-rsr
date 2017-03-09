# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import django_filters
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.utils.translation import ugettext_lazy as _

from ..filters import (build_choices, ProjectUpdateFilter,
                       remove_empty_querydict_items)
from ..models import ProjectUpdate, Project
from ...utils import pagination, filter_query_string
from .utils import apply_keywords, org_projects, show_filter_class
from .organisation import _page_organisations


###############################################################################
# Projectupdate directory
###############################################################################


def _all_updates():
    """
    Return all project updates.
    """
    return ProjectUpdate.objects.exclude(project__is_public=False).order_by('-id')


def _all_projects():
    """Return all active projects."""
    return Project.objects.public().published().select_related('project_updates').order_by('-id')


def _page_updates(page):
    """Dig out the list or project updates to use."""
    projects = org_projects(page.organisation) if page.partner_projects else _all_projects()
    keyword_projects = apply_keywords(page, projects)
    return keyword_projects.all_updates()


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
    all_updates = _update_directory_coll(request)
    f = ProjectUpdateFilter(qs, queryset=all_updates)

    # Swap to choice filter for RSR pages
    if request.rsr_page:
        # Filter partner filter list to only populated partners
        f.filters['partner'] = django_filters.ChoiceFilter(
            choices=build_choices(_page_organisations(request.rsr_page)),
            label=_(u'organisation'),
            name='project__partners__id')

    # Build page
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, f.qs.distinct(), 10)

    # Get updates to be displayed on the map
    if request.rsr_page and request.rsr_page.all_maps:
        map_updates = all_updates
    else:
        map_updates = page.object_list
    map_updates = map_updates.select_related(
        'project',
        'primary_location',
    )

    # Get related objects of page at once
    page.object_list = page.object_list.prefetch_related(
        'user__employers',
        'user__employers__organisation',
    ).select_related(
        'project',
        'user',
        'primary_location',
        'primary_location__country'
    )

    return render(request, 'update_directory.html', {
        'updates_count': f.qs.distinct().count(),
        'filter': f,
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
        'show_filters': filter_class,
        'q': filter_query_string(qs),
        'map_updates': map_updates,
    })


def main(request, project_id, update_id):
    """The projectupdate main view."""
    project = get_object_or_404(Project, pk=project_id)
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
