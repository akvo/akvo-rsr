# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.shortcuts import get_object_or_404, render

from ..filters import (build_choices, location_choices, OrganisationFilter,
                       remove_empty_querydict_items)
# from ..filters import remove_empty_querydict_items, OrganisationFilter
from ..models import Organisation, Project
from ...utils import pagination, filter_query_string
from .utils import apply_keywords, org_projects, show_filter_class

###############################################################################
# Organisation directory
###############################################################################


def _all_organisations():
    """Return all organisations."""
    return Organisation.objects.select_related(
        'locations',
        'primary_location',
        'primary_location__country',
    )


def _all_projects():
    """Return all active projects."""
    return Project.objects.published().select_related('partners').order_by('-id')


def _page_organisations(page):
    """Dig out the list or organisations to use."""
    projects = org_projects(page.organisation) if page.partner_projects else _all_projects()
    keyword_projects = apply_keywords(page, projects)
    return keyword_projects.all_partners().select_related(
        'locations',
        'primary_location',
        'primary_location__country',
    )


def _organisation_directory_coll(request):
    """Dig out and pass correct organisations to the view."""
    page = request.rsr_page
    if not page:
        return _all_organisations()
    return _page_organisations(page)


def directory(request):
    """The Organisation list view."""
    qs = remove_empty_querydict_items(request.GET)

    # Set show_filters to "in" if any filter is selected
    filter_class = show_filter_class(qs, ['location', ])

    # Yank Organisation collection
    all_organisations = _organisation_directory_coll(request)

    # Easter egg feature
    show_reporting = request.GET.get('reporting', False)
    if show_reporting:
        all_organisations = all_organisations.filter(can_become_reporting=True)

    f = OrganisationFilter(qs, queryset=all_organisations)

    # Filter location filter list to only populated locations
    f.filters['location'].extra['choices'] = location_choices(all_organisations)

    # Build page
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, f.qs.distinct(), 10)

    # Get organisations to be displayed on the map
    map_orgs = all_organisations if request.rsr_page and request.rsr_page.all_maps else page

    return render(request, 'organisation_directory.html', {
        'orgs_count': f.qs.distinct().count(),
        'filter': f,
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        'show_filters': filter_class,
        'q': filter_query_string(qs),
        'map_organisations': map_orgs,
    })


###############################################################################
# Organisation main
###############################################################################


def main(request, organisation_id):
    """The organisation main view."""
    return render(request, 'organisation_main.html', {
        'organisation': get_object_or_404(Organisation, pk=organisation_id)})
