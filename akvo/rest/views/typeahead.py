# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.core.cache import cache
from django.db.models import Q
from django.utils.cache import get_cache_key, _generate_cache_header_key
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.codelists.models import Country, Version
from akvo.codelists.store.codelists_v202 import SECTOR_CATEGORY
from akvo.rest.serializers import (ProjectListingSerializer,
                                   TypeaheadCountrySerializer,
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

    organisations = organisations.values('id', 'name', 'long_name')

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
    title_or_subtitle_param = request.GET.get('title_or_subtitle')

    keyword_filter = Q(keywords__id=keyword_param) if keyword_param else None
    location_filter = get_m49_filter(location_param) if location_param else None
    status_filter = Q(iati_status=status_param) if status_param else None
    organisation_filter = Q(partners__id=organisation_param) if organisation_param else None
    sector_filter = (
        Q(sectors__sector_code=sector_param, sectors__vocabulary='2')
        if sector_param else None
    )
    title_or_subtitle_filter = (
        Q(title__icontains=title_or_subtitle_param) | Q(subtitle__icontains=title_or_subtitle_param)
    ) if title_or_subtitle_param else None
    all_filters = [
        keyword_filter,
        location_filter,
        status_filter,
        organisation_filter,
        sector_filter,
    ]
    filters = filter(None, all_filters)
    return reduce(lambda x, y: x & y, filters) if filters else None, title_or_subtitle_filter


def _get_projects_for_page(projects, request):
    """Return projects to be shown on the current page"""
    limit = _int_or_none(request.GET.get('limit')) or settings.PROJECT_DIRECTORY_PAGE_SIZES[0]
    limit = min(limit, settings.PROJECT_DIRECTORY_PAGE_SIZES[-1])
    max_page_number = 1 + projects.count() / limit
    page_number = min(max_page_number, _int_or_none(request.GET.get('page')) or 1)
    start = (page_number - 1) * limit
    end = page_number * limit
    return projects[start:end]


@api_view(['GET'])
def typeahead_project_filters(request):
    """Return the values for various project filters.

    Based on the current filters, it returns new options for all the (other)
    filters. This is used to generate dynamic filters.

    """

    # Fetch projects based on whether we are an Akvo site or RSR main site
    page = request.rsr_page
    projects = page.projects() if page else Project.objects.all().public().published()

    # Exclude projects which don't have an image or a title
    # FIXME: This happens silently and may be confusing?
    projects = projects.exclude(Q(title='') | Q(current_image=''))

    # Filter projects based on query parameters
    filter_, text_filter = _create_filters_query(request)
    projects = projects.filter(filter_).distinct() if filter_ is not None else projects
    project_options = projects
    # NOTE: The text filter is handled differently/separately from the other filters.
    # The text filter allows users to enter free form text, which could result in no
    # projects being found for the given text. Other fields only allow selecting from
    # a list of options, and for every combination that is shown to users and
    # selectable by them, at least one project exists.
    # When no projects are returned for a given search string, if the text search is
    # not handled separately, the options for all the other filters are empty, and
    # this causes the filters to get cleared automatically. This is very weird UX.
    projects_text_filtered = (
        projects.filter(text_filter) if text_filter is not None else projects
    )
    if projects_text_filtered.exists():
        projects = projects_text_filtered

    # Pre-fetch related fields to make things faster
    projects = projects.select_related(
        'primary_location',
        'primary_organisation',
    ).prefetch_related(
        'locations',
        'locations__country',
        'recipient_countries',
    )

    # Get the relevant data for typeaheads based on filtered projects (minus
    # text filtering, if no projects were found)
    locations = [
        {'id': choice[0], 'name': choice[1]}
        for choice in location_choices(projects)
    ]
    organisations = projects.all_partners().values('id', 'name', 'long_name')

    # FIXME: Currently only vocabulary 2 is supported (as was the case with
    # static filters). This could be extended to other vocabularies, in future.
    valid_sectors = dict(codelist_choices(SECTOR_CATEGORY))
    sectors = projects.sectors().filter(
        vocabulary='2', sector_code__in=valid_sectors
    ).values('sector_code').distinct()

    # NOTE: We use projects_text_filtered for displaying projects
    count = projects_text_filtered.count()
    display_projects = _get_projects_for_page(projects_text_filtered, request).select_related(
        'primary_organisation'
    )

    # NOTE: We use the _get_cached_data function to individually cache small
    # bits of data to avoid the response from never getting saved in the cache,
    # because the response is larger than the max size of data that can be
    # saved in the cache.
    cached_projects = _get_cached_data(
        request, 'projects', display_projects, ProjectListingSerializer
    )
    cached_project_options = _get_cached_data(
        request, 'project_options', project_options, TypeaheadProjectSerializer
    )
    cached_organisations = _get_cached_data(
        request, 'organisations', organisations, TypeaheadOrganisationSerializer
    )

    response = {
        'project_count': count,
        'projects': cached_projects,
        'project_options': cached_project_options,
        'organisation': cached_organisations,
        'sector': TypeaheadSectorSerializer(sectors, many=True).data,
        'location': locations,
        'limit': settings.PROJECT_DIRECTORY_PAGE_SIZES,
    }

    return Response(response)


def _get_cached_data(request, key_prefix, data, serializer):
    """Function to get/set serialized data from the cache based on the request."""
    cache_header_key = _generate_cache_header_key(key_prefix, request)
    if cache.get(cache_header_key) is None:
        cache.set(cache_header_key, [], None)

    cache_key = get_cache_key(request, key_prefix)
    cached_data = cache.get(cache_key, None)
    if not cached_data:
        cached_data = serializer(data, many=True).data
        cache.set(cache_key, cached_data)

    return cached_data


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
