# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from re import match

from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ParseError

from akvo.codelists.store.default_codelists import SECTOR_CATEGORY
from akvo.rest.serializers import (
    ProjectUpdateSerializer, ProjectUpdateDirectorySerializer, ProjectUpdateExtraSerializer,
    TypeaheadSectorSerializer, TypeaheadOrganisationSerializer

)
from akvo.rest.views.utils import int_or_none, get_qs_elements_for_page
from akvo.rest.viewsets import PublicProjectViewSet
from akvo.rsr.filters import location_choices, get_m49_filter
from akvo.rsr.models import Project, ProjectUpdate
from akvo.rsr.views.utils import apply_keywords, org_projects
from akvo.utils import codelist_choices


class ProjectUpdateViewSet(PublicProjectViewSet):

    """."""
    queryset = ProjectUpdate.objects.select_related('project',
                                                    'user').prefetch_related('locations')
    serializer_class = ProjectUpdateSerializer

    paginate_by_param = 'limit'
    max_paginate_by = 1000

    def get_queryset(self):
        """
        Allow simple filtering on selected fields.
        We don't use the default filter_fields, because Up filters on
        datetime for last_modified_at, and they only support a date, not datetime.
        """
        # FIXME: Add filter for event_date?
        created_at__gt = validate_date(self.request.query_params.get('created_at__gt', None))
        if created_at__gt is not None:
            self.queryset = self.queryset.filter(created_at__gt=created_at__gt)
        created_at__lt = validate_date(self.request.query_params.get('created_at__lt', None))
        if created_at__lt is not None:
            self.queryset = self.queryset.filter(created_at__lt=created_at__lt)
        last_modified_at__gt = validate_date(self.request.query_params.get('last_modified_at__gt', None))
        if last_modified_at__gt is not None:
            self.queryset = self.queryset.filter(last_modified_at__gt=last_modified_at__gt)
        last_modified_at__lt = validate_date(self.request.query_params.get('last_modified_at__lt', None))
        if last_modified_at__lt is not None:
            self.queryset = self.queryset.filter(last_modified_at__lt=last_modified_at__lt)
        # Get updates per organisation
        project__partners = self.request.query_params.get('project__partners', None)
        if project__partners:
            self.queryset = self.queryset.filter(project__partners=project__partners)
        user__organisations = self.request.query_params.get('user__organisations', None)
        if user__organisations:
            self.queryset = self.queryset.filter(user__organisations=user__organisations)
        return super(ProjectUpdateViewSet, self).get_queryset()


class ProjectUpdateExtraViewSet(PublicProjectViewSet):

    """Project update extra resource."""

    max_paginate_by = 30
    paginate_by = 10

    queryset = ProjectUpdate.objects.select_related(
        'primary_location',
        'primary_location__location_target',
        'primary_location__location_target__project',
        'primary_location__location_target__user',
        'primary_location__location_target__primary_location',
        'primary_location__location_target__country',
        'project',
        'user',
        'user__organisation',
        'user__organisation__primary_location',
        'user__organisation__primary_location__country',
        'user__organisation__primary_location__location_target',
        'user__organisation__primary_location__location_target__internal_org_ids',

    ).prefetch_related(
        'user__organisations',
        'user__organisations__primary_location',
        'user__organisations__primary_location__country',
        'user__organisations__primary_location__location_target')
    serializer_class = ProjectUpdateExtraSerializer

    def get_queryset(self):
        """
        Allow simple filtering on selected fields.
        We don't use the default filter_fields, because Up filters on
        datetime for last_modified_at, and they only support a date, not datetime.
        """
        created_at__gt = validate_date(self.request.query_params.get('created_at__gt', None))
        if created_at__gt is not None:
            self.queryset = self.queryset.filter(created_at__gt=created_at__gt)
        created_at__lt = validate_date(self.request.query_params.get('created_at__lt', None))
        if created_at__lt is not None:
            self.queryset = self.queryset.filter(created_at__lt=created_at__lt)
        last_modified_at__gt = validate_date(self.request.query_params.get('last_modified_at__gt', None))
        if last_modified_at__gt is not None:
            self.queryset = self.queryset.filter(last_modified_at__gt=last_modified_at__gt)
        last_modified_at__lt = validate_date(self.request.query_params.get('last_modified_at__lt', None))
        if last_modified_at__lt is not None:
            self.queryset = self.queryset.filter(last_modified_at__lt=last_modified_at__lt)
        # Get updates per organisation
        project__partners = self.request.query_params.get('project__partners', None)
        if project__partners:
            self.queryset = self.queryset.filter(project__partners=project__partners)
        user__organisations = self.request.query_params.get('user__organisations', None)
        if user__organisations:
            self.queryset = self.queryset.filter(user__organisations=user__organisations)
        return super(ProjectUpdateExtraViewSet, self).get_queryset()


# validate date strings from URL
def validate_date(date):

    if date is None:
        return None
    # if yyyy-mm-ddThh:mm:ss
    elif match(
            '^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])T[0-2]\d{1}:[0-5]\d{1}:[0-5]\d{1}$',
            date) is not None:
        return date
    # if yyyy-mm-dd
    elif match('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$', date) is not None:
        return date
    # if yyyy-mm
    elif match('^\d{4}\-(0?[1-9]|1[012])$', date) is not None:
        return date + '-01'
    else:
        raise ParseError(
            'Invalid date: created_at and last_modified_at dates must be in one of the following '
            'formats: yyyy-mm, yyyy-mm-dd or yyyy-mm-ddThh:mm:ss'
        )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def upload_indicator_update_photo(request, pk=None):
    update = ProjectUpdate.objects.get(pk=pk)

    # TODO: permissions

    data = request.data
    if 'photo' in data.keys():
        update.photo = data['photo']
        update.save(update_fields=['photo'])

    return Response(ProjectUpdateExtraSerializer(update).data)


@api_view(['GET'])
def update_directory(request):
    """REST view for the update directory."""

    # Fetch updates based on whether we are on Akvo site or RSR main site
    page = request.rsr_page
    all_updates = _all_updates() if not page else _page_updates(page)

    # Filter updates based on query parameters
    filter_, text_filter = _create_filters_query(request)
    updates = all_updates.filter(filter_).distinct() if filter_ is not None else all_updates

    updates_text_filtered = updates.filter(text_filter) if text_filter is not None else updates
    if updates_text_filtered.exists():
        updates = updates_text_filtered

    # Get the relevant data for typeaheads based on filtered updates (minus
    # text filtering, if no updates were found)
    locations = [
        {'id': choice[0], 'name': choice[1]}
        for choice in location_choices(updates)
    ]
    project_ids = updates.values_list('project__id', flat=True)
    projects = Project.objects.filter(id__in=project_ids)
    organisations = projects.all_partners().values('id', 'name', 'long_name')

    # FIXME: Currently only vocabulary 2 is supported (as was the case with
    # static filters). This could be extended to other vocabularies, in future.
    valid_sectors = dict(codelist_choices(SECTOR_CATEGORY))
    sectors = projects.sectors().filter(
        vocabulary='2', sector_code__in=valid_sectors
    ).values('sector_code').distinct()

    display_updates = get_qs_elements_for_page(updates_text_filtered, request)
    count = updates_text_filtered.count()
    display_updates = display_updates.select_related(
        'project',
        'project__primary_location',
        'project__primary_organisation',
        'user',
    ).prefetch_related(
        'project__partners',
        'project__sectors',
        'locations',
        'locations__country'
    )

    response = {
        'project_count': count,
        'projects': ProjectUpdateDirectorySerializer(display_updates, many=True).data,
        'organisation': TypeaheadOrganisationSerializer(organisations, many=True).data,
        'location': locations,
        'sector': TypeaheadSectorSerializer(sectors, many=True).data,
    }
    return Response(response)


def _public_projects():
    """Return all public projects."""
    return Project.objects.public().published().select_related('project_updates')


def _all_updates():
    """Return all updates on public projects."""
    return _public_projects().all_updates()


def _page_updates(page):
    """Dig out the list or project updates to use."""
    projects = org_projects(page.organisation) if page.partner_projects else _public_projects()
    keyword_projects = apply_keywords(page, projects)
    return keyword_projects.all_updates()


def _create_filters_query(request):
    """Returns a Q object expression based on query parameters."""
    location_param = int_or_none(request.GET.get('location'))
    organisation_param = int_or_none(request.GET.get('organisation'))
    sector_param = int_or_none(request.GET.get('sector'))
    title_or_subtitle_param = request.GET.get('title_or_subtitle')

    location_filter = (
        get_m49_filter(location_param, use_recipient_country=False) if location_param else None
    )
    organisation_filter = (
        Q(project__partners__id=organisation_param)
        if organisation_param else None
    )
    sector_filter = (
        Q(project__sectors__sector_code=sector_param, project__sectors__vocabulary='2')
        if sector_param else None
    )
    title_filter = Q(title__icontains=title_or_subtitle_param) if title_or_subtitle_param else None
    all_filters = [
        location_filter,
        organisation_filter,
        sector_filter,
    ]
    filters = filter(None, all_filters)
    return reduce(lambda x, y: x & y, filters) if filters else None, title_filter
