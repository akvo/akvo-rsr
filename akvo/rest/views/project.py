# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import timedelta

from django.conf import settings
from django.db.models import Count, F, Q
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.codelists.store.default_codelists import SECTOR_CATEGORY
from akvo.rest.serializers import (ProjectSerializer, ProjectExtraSerializer,
                                   ProjectExtraDeepSerializer,
                                   ProjectIatiExportSerializer,
                                   ProjectUpSerializer,
                                   ProjectDirectorySerializer,
                                   TypeaheadOrganisationSerializer,
                                   TypeaheadSectorSerializer,
                                   ProjectMetadataSerializer,
                                   OrganisationCustomFieldSerializer,
                                   ProjectHierarchyRootSerializer,
                                   ProjectHierarchyTreeSerializer,)
from akvo.rest.views.utils import (
    int_or_none, get_cached_data, get_qs_elements_for_page, set_cached_data
)
from akvo.rsr.models import Project, OrganisationCustomField
from akvo.rsr.filters import location_choices, get_m49_filter
from akvo.rsr.views.my_rsr import user_editable_projects
from akvo.utils import codelist_choices
from ..viewsets import PublicProjectViewSet, ReadOnlyPublicProjectViewSet
from functools import reduce


class ProjectViewSet(PublicProjectViewSet):

    """
    Viewset providing Project data.
    """
    queryset = Project.objects.prefetch_related(
        'publishingstatus',
        'categories',
        'keywords',
        'partners',
    )
    serializer_class = ProjectSerializer
    project_relation = ''

    def get_queryset(self):
        """
        Allow custom filter for sync_owner, since this field has been replaced by the
        reporting org partnership.
        """

        sync_owner = self.request.query_params.get('sync_owner', None)
        reporting_org = self.request.query_params.get('reporting_org', None)

        reporting_org = reporting_org or sync_owner
        if reporting_org:
            self.queryset = self.queryset.filter(
                partnerships__iati_organisation_role=101,
                partnerships__organisation__pk=reporting_org
            ).distinct()
        return super(ProjectViewSet, self).get_queryset()

    def create(self, request, *args, **kwargs):
        response = super(ProjectViewSet, self).create(request, *args, **kwargs)
        user = request.user
        project_id = response.data['id']
        Project.new_project_created(project_id, user)
        return response


class MyProjectsViewSet(PublicProjectViewSet):
    """Viewset providing listing of projects a user can edit."""
    queryset = Project.objects.all().select_related('publishingstatus')\
        .prefetch_related('locations', 'categories', 'related_projects', 'recipient_countries')
    serializer_class = ProjectMetadataSerializer
    project_relation = ''

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Project.objects.none()
        queryset = user_editable_projects(self.request.user)
        sector = self.request.query_params.get('sector', None)
        if sector:
            queryset = queryset.filter(sectors__sector_code=sector)
        country = self.request.query_params.get('country', None)
        if country:
            queryset = queryset.filter(locations__country__iso_code=country)\
                .union(queryset.filter(recipient_countries__country__iexact=country))
        return queryset


class ProjectHierarchyViewSet(ReadOnlyPublicProjectViewSet):
    queryset = Project.objects.none()
    serializer_class = ProjectHierarchyRootSerializer
    project_relation = ''

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Project.objects.none()
        queryset = user_editable_projects(self.request.user)\
            .filter(projecthierarchy__isnull=False)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        project = get_object_or_404(Project, pk=self.kwargs['pk'])
        root = project.ancestor()
        if not self.request.user.has_perm('rsr.view_project', root):
            raise Http404

        serializer = ProjectHierarchyTreeSerializer(root, context=self.get_serializer_context())

        return Response(serializer.data)


class ProjectIatiExportViewSet(PublicProjectViewSet):
    """Lean viewset for project data, as used in the My IATI section of RSR."""
    queryset = Project.objects.only(
        'id',
        'title',
        'is_public',
        'status',
    ).prefetch_related(
        'partners',
        'iati_checks',
        'publishingstatus',
        'partnerships',
    )
    serializer_class = ProjectIatiExportSerializer
    project_relation = ''
    paginate_by_param = 'limit'
    max_paginate_by = 50

    def get_queryset(self):
        """
        Allow custom filter for sync_owner, since this field has been replaced by the
        reporting org partnership.
        """
        reporting_org = self.request.query_params.get('reporting_org', None)
        if reporting_org:
            self.queryset = self.queryset.filter(
                partnerships__iati_organisation_role=101,
                partnerships__organisation__pk=reporting_org
            ).distinct()
        return super(ProjectIatiExportViewSet, self).get_queryset()


class ProjectExtraViewSet(ProjectViewSet):
    r"""
    Viewset providing extra Project data.

    Allowed parameters are:
    __limit__ (default 10, max 30),
    __partnerships\__organisation__ (filter on organisation ID), and
    __publishingstatus\__status__ (filter on publishing status)
    """

    queryset = Project.objects.prefetch_related(
        'publishingstatus',
        'sectors',
        'partnerships',
        'budget_items',
        'legacy_data',
        'links',
        'locations',
        'locations__country',
        'planned_disbursements',
        'policy_markers',
        'documents',
        'comments',
        'conditions',
        'contacts',
        'project_updates',
        'recipient_countries',
        'recipient_regions',
        'related_projects',
        'results',
        'sectors',
        'transactions',
    )
    serializer_class = ProjectExtraSerializer
    paginate_by_param = 'limit'
    paginate_by = 10
    max_paginate_by = 30


class ProjectExtraDeepViewSet(ProjectViewSet):
    r"""
    Viewset providing extra deep (depth=2 or bigger) Project data.

    Allowed parameters are:
    __limit__ (default 5, max 10),
    __partnerships\__organisation__ (filter on organisation ID), and
    __publishingstatus\__status__ (filter on publishing status)
    """

    queryset = Project.objects.prefetch_related(
        'publishingstatus',
        'sectors',
        'partnerships',
        'budget_items',
        'legacy_data',
        'links',
        'locations',
        'locations__country',
        'planned_disbursements',
        'policy_markers',
        'documents',
        'comments',
        'conditions',
        'contacts',
        'project_updates',
        'recipient_countries',
        'recipient_regions',
        'related_projects',
        'results',
        'sectors',
        'transactions',
    )
    serializer_class = ProjectExtraDeepSerializer
    paginate_by_param = 'limit'
    paginate_by = 5
    max_paginate_by = 10


class ProjectUpViewSet(ProjectViewSet):
    r"""
    Viewset providing extra data and limited filtering for Up in one go.

    Allowed parameters are:
    __limit__ (default 30, max 100),
    __partnerships\__organisation__ (filter on organisation ID), and
    __publishingstatus\__status__ (filter on publishing status)
    """

    queryset = Project.objects.select_related(
        'primary_location',
    ).prefetch_related(
        'publishingstatus',
        'project_updates',
        'categories',
        'keywords',
        'partners',
    )
    serializer_class = ProjectUpSerializer
    paginate_by_param = 'limit'
    max_paginate_by = 100


###############################################################################
# Project directory
###############################################################################

@api_view(['GET'])
def project_directory(request):
    """Return the values for various project filters.

    Based on the current filters, it returns new options for all the (other)
    filters. This is used to generate dynamic filters.

    """

    # Fetch projects based on whether we are an Akvo site or RSR main site
    page = request.rsr_page
    projects = page.projects() if page else Project.objects.all().public().published()

    if not page:
        # Exclude projects which don't have an image or a title for RSR site
        projects = projects.exclude(Q(title='') | Q(current_image=''))
    else:
        # On partner sites, all projects show up. Partners are expected to fix
        # their data to fix their pages!
        pass

    # Filter projects based on query parameters
    filter_, text_filter = _create_filters_query(request)
    projects = projects.filter(filter_).distinct() if filter_ is not None else projects
    projects = _filter_by_custom_fields(request, projects)

    # Rank projects by number of updates and indicator updates in last 9 months
    nine_months = now() - timedelta(days=9 * 30)
    projects = projects.annotate(
        update_count=Count('project_updates', filter=Q(created_at__gt=nine_months))
    ).annotate(
        indicator_update_count=Count('results__indicators__periods__data',
                                     filter=Q(created_at__gt=nine_months))
    ).annotate(score=F('update_count') + F('indicator_update_count')).order_by(
        '-score', '-pk'
    ).only('id', 'title', 'subtitle',
           'primary_location__id',
           'primary_organisation__id',
           'primary_organisation__name',
           'primary_organisation__long_name')

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
        'recipient_countries__country',
    )

    # Get the relevant data for typeaheads based on filtered projects (minus
    # text filtering, if no projects were found)
    cached_locations, _ = get_cached_data(request, 'locations', None, None)
    if cached_locations is None:
        cached_locations = [
            {'id': choice[0], 'name': choice[1]}
            for choice in location_choices(projects)
        ]
        set_cached_data(request, 'locations', cached_locations)

    organisations = projects.all_partners().values('id', 'name', 'long_name')

    # FIXME: Currently only vocabulary 2 is supported (as was the case with
    # static filters). This could be extended to other vocabularies, in future.
    valid_sectors = dict(codelist_choices(SECTOR_CATEGORY))
    sectors = projects.sectors().filter(
        vocabulary='2', sector_code__in=valid_sectors
    ).values('sector_code').distinct()

    # NOTE: We use projects_text_filtered for displaying projects
    count = projects_text_filtered.count()
    display_projects = get_qs_elements_for_page(projects_text_filtered, request, count)\
        .select_related('primary_organisation')

    # NOTE: We use the _get_cached_data function to individually cache small
    # bits of data to avoid the response from never getting saved in the cache,
    # because the response is larger than the max size of data that can be
    # saved in the cache.
    cached_projects, showing_cached_projects = get_cached_data(
        request, 'projects', display_projects, ProjectDirectorySerializer
    )
    cached_organisations, _ = get_cached_data(
        request, 'organisations', organisations, TypeaheadOrganisationSerializer
    )
    custom_fields = (
        OrganisationCustomField.objects.filter(type='dropdown',
                                               organisation=page.organisation,
                                               show_in_searchbar=True)
        if page else []
    )
    response = {
        'project_count': count,
        'projects': cached_projects,
        'showing_cached_projects': showing_cached_projects,
        'organisation': cached_organisations,
        'sector': TypeaheadSectorSerializer(sectors, many=True).data,
        'custom_fields': OrganisationCustomFieldSerializer(custom_fields, many=True).data,
        'location': cached_locations,
        'page_size_default': settings.PROJECT_DIRECTORY_PAGE_SIZES[0],
    }

    return Response(response)


def _create_filters_query(request):
    """Returns a Q object expression based on query parameters."""
    keyword_param = int_or_none(request.GET.get('keyword'))
    location_param = int_or_none(request.GET.get('location'))
    status_param = int_or_none(request.GET.get('status'))
    organisation_param = int_or_none(request.GET.get('organisation'))
    sector_param = int_or_none(request.GET.get('sector'))
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
    filters = [_f for _f in all_filters if _f]
    return reduce(lambda x, y: x & y, filters) if filters else None, title_or_subtitle_filter


def _filter_by_custom_fields(request, projects):
    for custom_field_query in request.GET:
        if not custom_field_query.startswith('custom_field__'):
            continue

        value = request.GET.get(custom_field_query)
        try:
            org_custom_field_id = int(custom_field_query.split('__', 1)[-1])
            org_custom_field = OrganisationCustomField.objects.get(pk=org_custom_field_id)
        except (OrganisationCustomField.DoesNotExist, ValueError):
            continue

        if org_custom_field.type != 'dropdown':
            filter_ = Q(custom_fields__name=org_custom_field.name, custom_fields__value=value)
        else:
            dropdown_options = org_custom_field.dropdown_options['options']
            selection = _get_selection(dropdown_options, value)
            filter_ = Q(custom_fields__name=org_custom_field.name,
                        custom_fields__dropdown_selection__contains=selection)
        projects = projects.filter(filter_)

    return projects


def _get_selection(options, value):
    if isinstance(value, basestring):
        indexes = list(map(int, value.split('__')))
    else:
        indexes = value

    selection = options[indexes[0]]
    sub_options = selection.pop('options', [])
    if sub_options and indexes[1:]:
        selection['options'] = _get_selection(sub_options, indexes[1:])
    return [selection]
