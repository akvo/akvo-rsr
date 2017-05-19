# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.codelists.models import Country, Version
from akvo.codelists.store.codelists_v202 import ACTIVITY_STATUS, SECTOR_CATEGORY
from akvo.rest.serializers import (TypeaheadCountrySerializer,
                                   TypeaheadOrganisationSerializer,
                                   TypeaheadProjectSerializer,
                                   TypeaheadProjectUpdateSerializer,
                                   TypeaheadKeywordSerializer,
                                   TypeaheadSectorSerializer,)
from akvo.rsr.filters import location_choices, get_m49_filter
from akvo.rsr.models import Organisation, Project, ProjectUpdate
from akvo.rsr.views.project import _project_directory_coll
from akvo.utils import codelist_choices


def rejig(queryset, serializer):
    """Rearrange & add queryset count to the response data."""
    return {
        'count': queryset.count(),
        'results': serializer.data
    }


@api_view(['GET'])
def typeahead_country(request):
    iati_version = Version.objects.get(code=settings.IATI_VERSION)
    countries = Country.objects.filter(version=iati_version)
    return Response(
        rejig(countries, TypeaheadCountrySerializer(countries, many=True))
    )


@api_view(['GET'])
def typeahead_organisation(request):
    page = request.rsr_page
    if request.GET.get('partners', '0') == '1' and page:
        organisations = page.partners()
    else:
        # Project editor - all organizations
        organisations = Organisation.objects.all()

    return Response(
        rejig(organisations, TypeaheadOrganisationSerializer(organisations,
                                                             many=True))
    )


@api_view(['GET'])
def typeahead_user_organisations(request):
    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)
    organisations = user.approved_organisations() if not is_admin else Organisation.objects.all()
    return Response(
        rejig(organisations, TypeaheadOrganisationSerializer(organisations,
                                                             many=True))
    )


@api_view(['GET'])
def typeahead_keyword(request):
    page = request.rsr_page
    keywords = page.keywords.all() if page else None
    if keywords:
        return Response(
            rejig(keywords, TypeaheadKeywordSerializer(keywords, many=True))
        )
    # No keywords on rsr.akvo.org
    return Response({})


@api_view(['GET'])
def typeahead_project(request):
    """Return the typeaheads for projects.

    Without any query parameters, it returns the info for all the projects in
    the current context -- changes depending on whether we are on a partner
    site, or the RSR site.

    If a published query parameter is passed, only projects that have been
    published are returned.

    NOTE: The unauthenticated user gets information about all the projects when
    using this API endpoint.  More permission checking will need to be added,
    if the amount of data being returned is changed.

    """
    if request.GET.get('published', '0') == '0':
        # Project editor - organization projects, all
        page = request.rsr_page
        projects = page.all_projects() if page else Project.objects.all()
    else:
        # Search bar - organization projects, published
        projects = _project_directory_coll(request)

    projects = projects.exclude(title='')
    return Response(
        rejig(projects, TypeaheadProjectSerializer(projects, many=True))
    )

def _int_or_none(value):
    """Return int or None given a value."""
    try:
        return int(value)
    except:
        return None


def _create_filters_query(request):
    """Returns a Q object expression based on query parameters."""
    keyword_param = _int_or_none(request.GET.get('keyword'))
    location_param = _int_or_none(request.GET.get('location'))
    status_param = _int_or_none(request.GET.get('status'))
    organisation_param = _int_or_none(request.GET.get('organisation'))
    sector_param = _int_or_none(request.GET.get('sector'))

    keyword_filter = Q(keywords__id=keyword_param) if keyword_param else None
    location_filter = get_m49_filter(location_param) if location_param else None
    status_filter = Q(iati_status=status_param) if status_param else None
    organisation_filter = Q(partners__id=organisation_param) if organisation_param else None
    sector_filter = (
        Q(sectors__sector_code=sector_param, sectors__vocabulary='2')
        if sector_param else None
    )
    all_filters = [
        keyword_filter, location_filter, status_filter, organisation_filter, sector_filter
    ]
    filters = filter(None, all_filters)
    return reduce(lambda x, y: x & y, filters) if filters else None


@api_view(['GET'])
def typeahead_project_filters(request):
    """Return the values for various project filters.

    Based on the current filters, it returns new options for all the (other)
    filters. This is used to generate dynamic filters.

    """

    # Fetch projects based on whether we are an Akvo site or RSR main site
    page = request.rsr_page
    projects = page.projects() if page else Project.objects.all()
    # FIXME: Can we prefetch things to make this faster???

    # Filter projects based on query parameters
    filter_ = _create_filters_query(request)
    projects = projects.filter(filter_) if filter_ is not None else projects

    # Get the relevant data for typeaheads based on filtered projects.
    keywords = projects.keywords()

    locations = [
        {'id': choice[0], 'name': choice[1],}
        for choice in location_choices(projects)
    ]

    valid_statuses = dict(codelist_choices(ACTIVITY_STATUS))
    status = [
        {'id': status, 'name': valid_statuses[status]}
        for status in set(projects.values_list('iati_status', flat=True))
        if status in valid_statuses
    ]

    organisations = projects.all_partners()

    # FIXME: Currently only vocabulary 2 is supported (as was the case with
    # static filters). This could be extended to other vocabularies, in future.
    valid_sectors = dict(codelist_choices(SECTOR_CATEGORY))
    sectors = projects.sectors().filter(
        vocabulary='2', sector_code__in=valid_sectors
    ).values('sector_code').distinct()

    response = {
        'organisation': TypeaheadOrganisationSerializer(organisations, many=True).data,
        'keyword': TypeaheadKeywordSerializer(keywords, many=True).data,
        'status': sorted(status, key=lambda x: x['id']),
        'sector': TypeaheadSectorSerializer(sectors, many=True).data,
        'location': locations,
    }

    return Response(response)


@api_view(['GET'])
def typeahead_user_projects(request):
    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)
    if is_admin:
        projects = Project.objects.all()
    else:
        projects = user.approved_organisations().all_projects()
    projects = projects.exclude(title='')
    return Response(
        rejig(projects, TypeaheadProjectSerializer(projects, many=True))
    )


@api_view(['GET'])
def typeahead_impact_projects(request):
    user = request.user
    projects = Project.objects.all() if user.is_admin or user.is_superuser else user.my_projects()
    projects = projects.published().filter(is_impact_project=True).order_by('title')

    return Response(
        rejig(projects, TypeaheadProjectSerializer(projects, many=True))
    )


@api_view(['GET'])
def typeahead_projectupdate(request):
    updates = ProjectUpdate.objects.all()
    return Response(
        rejig(updates, TypeaheadProjectUpdateSerializer(updates, many=True))
    )
