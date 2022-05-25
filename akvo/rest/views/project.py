# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import timedelta

from django.conf import settings
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.views.decorators.cache import cache_page
from geojson import Feature, FeatureCollection, Point
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_403_FORBIDDEN
from timeout_decorator import timeout

from akvo.codelists.store.default_codelists import SECTOR, SECTOR_CATEGORY, SECTOR_VOCABULARY
from akvo.rest.authentication import JWTAuthentication, TastyTokenAuthentication
from akvo.rest.cache import serialized_project
from akvo.rest.serializers import (
    ExternalProjectSerializer,
    OrganisationCustomFieldSerializer,
    ProjectDirectoryDynamicFieldsSerializer,
    ProjectExtraDeepSerializer,
    ProjectExtraSerializer,
    ProjectHierarchyRootSerializer,
    ProjectHierarchyTreeSerializer,
    ProjectIatiExportSerializer,
    ProjectMetadataSerializer,
    ProjectSerializer,
    ProjectUpSerializer,
    TypeaheadOrganisationSerializer,
)
from akvo.rsr.models import ExternalProject, IndicatorPeriodData, OrganisationCustomField, Project, ProjectRole
from akvo.rsr.views.my_rsr import user_viewable_projects
from akvo.utils import codelist_choices, get_thumbnail, single_period_dates
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

    @action(methods=("GET", "POST"), detail=True)
    def external_project(self, request, **kwargs):
        project = self.get_object()
        if request.method == "GET":
            # List external projects
            return Response(ExternalProjectSerializer(
                ExternalProject.objects.filter(related_project=project), many=True
            ).data)
        else:
            if not request.user.has_perm("rsr.change_project", project):
                raise PermissionDenied()

            # Create external project
            serializer = ExternalProjectSerializer(data=request.data)
            if serializer.is_valid():
                external_project = serializer.create({
                    **serializer.validated_data,
                    "related_project": project
                })
                return Response(
                    ExternalProjectSerializer(external_project).data,
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        methods=("DELETE",),
        detail=True,
        url_path=r"external_project/(?P<ext_pk>\d+)"
    )
    def delete_external_project(self, request, ext_pk, **kwargs):
        project = self.get_object()
        if not request.user.has_perm("rsr.change_project", project):
            raise PermissionDenied()

        ext_project = get_object_or_404(ExternalProject, related_project=project, id=ext_pk)
        ext_project.delete()
        return Response(status=status.HTTP_200_OK)


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
            queryset = queryset.filter(
                Q(locations__country__iso_code=country)
                | Q(locations__country__name__iexact=country)
                | Q(recipient_countries__country__iexact=country)
            )
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

        root = project.get_root()
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
@cache_page(60 * 60)
def project_directory(request):
    """Return the values for various project filters.

    Based on the current filters, it returns new options for all the (other)
    filters. This is used to generate dynamic filters.

    """

    page = request.rsr_page
    projects = _project_list(request)
    projects_data = [
        serialized_project(project_id) for project_id in projects.values_list('pk', flat=True)
    ]
    organisations = list(projects.all_partners().values('id', 'name', 'long_name'))
    organisations = TypeaheadOrganisationSerializer(organisations, many=True).data

    custom_fields = (
        OrganisationCustomField.objects.filter(type='dropdown',
                                               organisation=page.organisation,
                                               show_in_searchbar=True).order_by('order', 'id')
        if page else []
    )
    sectors = [{'id': id_, 'name': name} for id_, name in codelist_choices(SECTOR_CATEGORY) + codelist_choices(SECTOR)]
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
def projects_by_id(request):
    project_ids = {id for id in request.GET.get('ids', '').split(',') if id}
    size = max(1, min(len(project_ids), 100))  # TODO: Set the max size in the settings
    fields = {field for field in request.GET.get('fields', '').split(',') if field}
    projects = _project_list(request).prefetch_related(
        'partners',
        'locations',
        'locations__country',
        'recipient_countries',
        'thumbnails',
    ).filter(id__in=project_ids).all()[:size]
    serializer = ProjectDirectoryDynamicFieldsSerializer(projects, many=True, fields=fields)
    return Response(serializer.data)


@api_view(['GET'])
def project_published_search(request):
    query = request.GET.get('query', '')
    sectors = {sector for sector in request.GET.get('sectors', '').split(',') if sector}
    orgs = {int(org) for org in request.GET.get('orgs', '').split(',') if org}
    max_limit = settings.AKVO_PUBLIC_PROJECT_SEARCH_LIMIT
    try:
        limit = int(request.GET.get('limit', max_limit))
    except ValueError:
        limit = max_limit
    limit = limit if 1 <= limit <= max_limit else max_limit
    projects = _project_list(request)
    if query:
        projects = projects.filter(title__icontains=query)
    if sectors:
        projects = projects.filter(sectors__sector_code__in=sectors, sectors__vocabulary=SECTOR_VOCABULARY[2][0])
    if orgs:
        projects = projects.filter(partners__in=orgs)
    return Response({
        'total': projects.count(),
        'results': [p.id for p in projects.all()[:limit]],
    })


@api_view(['GET'])
@cache_page(60 * 60 * 6, cache='database')
def project_location_geojson(request):
    """Return a GeoJSON with all the project locations."""
    fields = {field for field in request.GET.get('fields', '').split(',') if field}
    projects = _project_list(request)\
        .exclude(primary_location__isnull=True)\
        .select_related('primary_location')
    if 'activeness' in fields:
        nine_months = now() - timedelta(days=9 * 30)
        result_update_count = Count(
            'results__indicators__periods__data',
            filter=Q(results__indicators__periods__data__created_at__gt=nine_months),
            distinct=True
        )
        project_update_count = Count(
            'project_updates',
            filter=Q(project_updates__created_at__gt=nine_months),
            distinct=True
        )
        projects = projects.annotate(result_update_count=result_update_count, project_update_count=project_update_count)
    features = [
        _make_project_location_feature(project, fields)
        for project in projects
        if project.primary_location and project.primary_location.is_valid()
    ]
    collection = FeatureCollection(features)
    return Response(collection)


def _make_project_location_feature(project, fields=[]):
    props = dict(id=project.id)
    point = Point((project.primary_location.longitude, project.primary_location.latitude))
    if 'title' in fields:
        props['title'] = project.title
    if 'country' in fields:
        props['country'] = project.primary_location.country.iso_code \
            if project.primary_location and project.primary_location.country \
            else ''
    if 'activeness' in fields:
        props['activeness'] = project.project_update_count + project.result_update_count
    if 'image' in fields:
        @timeout(1)
        def get_thumbnail_with_timeout():
            return get_thumbnail(project.current_image, '350x200', crop='smart', quality=99)
        try:
            image = get_thumbnail_with_timeout()
            url = image.url
        except Exception:
            url = project.current_image.url if project.current_image.name else ''
        props['image'] = url
    return Feature(geometry=point, properties=props)


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
@authentication_classes([SessionAuthentication, TastyTokenAuthentication, JWTAuthentication])
def project_title(request, project_pk):
    project = get_object_or_404(Project, pk=project_pk)
    hierarchy_name = project.uses_single_indicator_period()
    needs_reporting_timeout_days, _, _ = single_period_dates(hierarchy_name) if hierarchy_name else (None, None, None)
    can_edit_project = request.user.can_edit_project(project)
    view = get_results_role_view(request.user, project)
    # view = 'm&e' if request.user.has_perm('rsr.do_me_manager_actions', project) else 'enumerator'

    data = {
        'title': project.title,
        'targets_at': project.get_root().targets_at,
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


def get_results_role_view(user, project):
    if user.has_perm('rsr.do_me_manager_actions', project):
        return 'm&e'

    if project.use_project_roles:
        return 'enumerator' \
            if ProjectRole.objects.filter(project=project, user=user, group__name='Enumerators').exists() \
            else 'user'

    return 'enumerator' if user.has_perm('rsr.add_indicatorperioddata', project) else 'user'
