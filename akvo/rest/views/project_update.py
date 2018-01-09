# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import ProjectUpdate

from ..serializers import ProjectUpdateSerializer, ProjectUpdateExtraSerializer
from ..viewsets import PublicProjectViewSet

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from re import match


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
