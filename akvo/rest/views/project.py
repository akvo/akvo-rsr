# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.core.cache import caches
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_403_FORBIDDEN
from geojson import Feature, Point, FeatureCollection

from akvo.codelists.store.default_codelists import SECTOR_CATEGORY
from akvo.rest.cache import serialized_project, PROJECT_DIRECTORY_CACHE, PROJECT_DIRECTORY_ALL_KEY
from akvo.rest.serializers import (ProjectSerializer, ProjectExtraSerializer,
                                   ProjectExtraDeepSerializer,
                                   ProjectIatiExportSerializer,
                                   ProjectUpSerializer,
                                   TypeaheadOrganisationSerializer,
                                   ProjectMetadataSerializer,
                                   OrganisationCustomFieldSerializer,
                                   ProjectHierarchyRootSerializer,
                                   ProjectHierarchyTreeSerializer,)
from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, OrganisationCustomField, IndicatorPeriodData
from akvo.rsr.views.my_rsr import user_viewable_projects
from akvo.utils import codelist_choices, single_period_dates
from ..viewsets import PublicProjectViewSet, ReadOnlyPublicProjectViewSet


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

    def filter_queryset(self, queryset):
        """
        Allow custom filter for sync_owner, since this field has been replaced by the
        reporting org partnership.
        """

        sync_owner = self.request.query_params.get('sync_owner', None)
        reporting_org = self.request.query_params.get('reporting_org', None)

        reporting_org = reporting_org or sync_owner
        if reporting_org:
            queryset = queryset.filter(
                partnerships__iati_organisation_role=101,
                partnerships__organisation__pk=reporting_org
            ).distinct()
        return super(ProjectViewSet, self).filter_queryset(queryset)


class MyProjectsViewSet(PublicProjectViewSet):
    """Viewset providing listing of projects a user can edit."""
    queryset = Project.objects.all().select_related('publishingstatus')\
        .prefetch_related('locations', 'categories', 'related_projects', 'recipient_countries')
    serializer_class = ProjectMetadataSerializer
    project_relation = ''

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Project.objects.none()
        show_restricted = bool(self.request.query_params.get('show_restricted'))

        filter_program = self.request.query_params.get('filter_program')
        if filter_program:
            try:
                filter_program = int(filter_program)
            except ValueError:
                filter_program = None

        queryset = user_viewable_projects(self.request.user, show_restricted, filter_program)

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
        queryset = self.request.user.my_projects()\
                                    .published()\
                                    .filter(projecthierarchy__isnull=False)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        project = get_object_or_404(Project, pk=self.kwargs['pk'])
        if not self.request.user.has_perm('rsr.view_project', project):
            return Response('Request not allowed', status=HTTP_403_FORBIDDEN)

        root = project.ancestor()
        serializer = ProjectHierarchyTreeSerializer(root, context=self.get_serializer_context())

        return Response(serializer.data)


class ProjectIatiExportViewSet(PublicProjectViewSet):
    """Lean viewset for project data, as used in the My IATI section of RSR."""
    queryset = Project.objects.only(
        'id',
        'title',
        'is_public',
        'status',
        'run_iati_checks',
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

    def filter_queryset(self, queryset):
        """
        Allow custom filter for sync_owner, since this field has been replaced by the
        reporting org partnership.
        """
        reporting_org = self.request.query_params.get('reporting_org', None)
        if reporting_org:
            queryset = queryset.filter(
                partnerships__iati_organisation_role=101,
                partnerships__organisation__pk=reporting_org
            ).distinct()
        return super(ProjectIatiExportViewSet, self).filter_queryset(queryset)

    def list(self, request, *args, **kwargs):
        projects = self.queryset.filter(run_iati_checks=True)
        for project in projects:
            project.update_iati_checks()
        return super(ProjectIatiExportViewSet, self).list(request, *args, **kwargs)


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

    page = request.rsr_page
    projects = _project_list(request)
    cache = caches[PROJECT_DIRECTORY_CACHE]
    projects_data = None if page else cache.get(PROJECT_DIRECTORY_ALL_KEY)
    if projects_data is None:
        projects_data = [
            serialized_project(project_id) for project_id in projects.values_list('pk', flat=True)
        ]
        cache.set(PROJECT_DIRECTORY_ALL_KEY, projects_data)
    organisations = list(projects.all_partners().values('id', 'name', 'long_name'))
    organisations = TypeaheadOrganisationSerializer(organisations, many=True).data

    custom_fields = (
        OrganisationCustomField.objects.filter(type='dropdown',
                                               organisation=page.organisation,
                                               show_in_searchbar=True).order_by('order', 'id')
        if page else []
    )
    sectors = [{'id': id_, 'name': name} for id_, name in codelist_choices(SECTOR_CATEGORY)]
    response = {
        'projects': projects_data,
        'organisation': organisations,
        'sector': sectors,
        'custom_fields': OrganisationCustomFieldSerializer(custom_fields, many=True).data,
    }

    return Response(response)


def _project_list(request):
    """Return a project queryset based on the request"""
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
    return projects


@api_view(['GET'])
def project_location_geojson(request):
    """Return a GeoJSON with all the project locations."""
    projects = _project_list(request).prefetch_related('locations')
    features = [
        Feature(geometry=Point((location.longitude, location.latitude)),
                properties=dict(
                    project_title=project.title,
                    project_subtitle=project.subtitle,
                    project_url=request.build_absolute_uri(project.get_absolute_url()),
                    project_id=project.pk,
                    name=location.name,
                    description=location.description))
        for project in projects
        for location in project.locations.all()
        if location.is_valid()
    ]
    response = FeatureCollection(features)
    return Response(response)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def add_project_to_program(request, program_pk):
    program = get_object_or_404(Project, pk=program_pk)
    parent_pk = request.data.get('parent')
    if parent_pk is not None:
        program = get_object_or_404(Project, pk=parent_pk)

    project = Project.objects.create()
    Project.new_project_created(project.id, request.user)   # Log creation
    project.add_to_program(program)
    # Set user's primary org as accountable partner
    org = request.user.first_organisation()
    if org is not None and org != program.reporting_org:
        project.set_accountable_partner(org)
    response = ProjectSerializer(project, context=dict(request=request)).data
    return Response(response, status=HTTP_201_CREATED)


@api_view(['GET'])
def project_title(request, project_pk):
    project = get_object_or_404(Project, pk=project_pk)
    hierarchy_name = project.uses_single_indicator_period()
    needs_reporting_timeout_days, _, _ = single_period_dates(hierarchy_name) if hierarchy_name else (None, None, None)
    can_edit_project = request.user.can_edit_project(project)
    view = 'm&e' if request.user.has_perm('rsr.do_me_manager_actions', project) else 'enumerator'

    data = {
        'title': project.title,
        'targets_at': project.ancestor().targets_at,
        'publishing_status': project.publishingstatus.status,
        'has_hierarchy': project.has_ancestors or project.is_hierarchy_root(),
        'pending_update_count': IndicatorPeriodData.objects.filter(
            period__indicator__result__project=project,
            status=IndicatorPeriodData.STATUS_PENDING_CODE
        ).count(),
        'needs_reporting_timeout_days': needs_reporting_timeout_days,
        'can_edit_project': can_edit_project,
        'view': view,
    }
    return Response(data)
