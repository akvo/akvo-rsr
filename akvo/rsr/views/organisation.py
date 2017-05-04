# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.iati.exports.iati_org_export import IatiOrgXML
from akvo.rsr.filters import location_choices, OrganisationFilter, remove_empty_querydict_items
from akvo.rsr.models import Organisation, Project
from akvo.rsr.views.utils import apply_keywords, org_projects, show_filter_class
from akvo.utils import pagination, filter_query_string

from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404, render

from lxml import etree


###############################################################################
# Organisation directory
###############################################################################

def _public_projects():
    """Return all public projects."""
    return Project.objects.public().published().select_related('partners')


def _page_organisations(page):
    """Dig out the list or organisations to use."""
    projects = org_projects(page.organisation) if page.partner_projects else _public_projects()
    keyword_projects = apply_keywords(page, projects)
    return keyword_projects.all_partners()


def _organisation_directory_coll(request):
    """Dig out and pass correct organisations to the view."""
    page = request.rsr_page
    if not page:
        return Organisation.objects.all()
    return _page_organisations(page)


def directory(request):
    """The Organisation list view."""
    qs = remove_empty_querydict_items(request.GET)

    # Set show_filters to "in" if any filter is selected
    filter_class = show_filter_class(qs, ['location', ])

    # Yank Organisation collection
    all_organisations = _organisation_directory_coll(request)

    # Easter egg feature
    creator_organisations = request.GET.get('creator', False)
    if creator_organisations:
        all_organisations = all_organisations.filter(can_create_projects=True)

    f = OrganisationFilter(qs, queryset=all_organisations)

    # Change filter options further when on an Akvo Page
    if request.rsr_page:
        # Filter location filter list to only populated locations
        f.filters['location'].extra['choices'] = location_choices(all_organisations)

    # Build page
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, f.qs.distinct(), 10)

    # Get organisations to be displayed on the map
    if request.rsr_page and request.rsr_page.all_maps:
        map_orgs = all_organisations
    else:
        map_orgs = page.object_list
    map_orgs = map_orgs

    # Get related objects of page at once
    page.object_list = page.object_list.prefetch_related('locations')

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


###############################################################################
# Organisation IATI files
###############################################################################

def iati(request, organisation_id):
    """Retrieve the latest public IATI XML file."""
    organisation = get_object_or_404(Organisation, pk=organisation_id)
    exports = organisation.iati_exports.filter(is_public=True).exclude(iati_file='')
    if exports:
        latest_export = exports.order_by('-id')[0]
        return HttpResponse(latest_export.iati_file, content_type="text/xml")
    raise Http404


def iati_org(request, organisation_id):
    """Generate the IATI Organisation file on-the-fly and return the XML."""
    organisation = get_object_or_404(Organisation, pk=organisation_id)
    xml_data = etree.tostring(etree.ElementTree(
        IatiOrgXML(request, [organisation]).iati_organisations))
    return HttpResponse(xml_data, content_type="text/xml")
