# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import ProjectUpdate

from ..serializers import ProjectUpdateSerializer, ProjectUpdateExtraSerializer
from ..viewsets import BaseRSRViewSet


class ProjectUpdateViewSet(BaseRSRViewSet):

    """."""

    # queryset = ProjectUpdate.objects.all()
    queryset = ProjectUpdate.objects.select_related('project',
                                                    'user').prefetch_related('locations')
    serializer_class = ProjectUpdateSerializer
    filter_fields = ('project', 'user', )
    paginate_by_param = 'limit'
    max_paginate_by = 1000

    def get_queryset(self):
        """Allow simple filtering on selected fields."""
        queryset = self.queryset
        project = self.request.QUERY_PARAMS.get('project', None)
        if project is not None:
            queryset = self.queryset.filter(project=project)
        uuid = self.request.QUERY_PARAMS.get('uuid', None)
        if uuid is not None:
            queryset = self.queryset.filter(uuid=uuid)
        created_at = self.request.QUERY_PARAMS.get('created_at__gt', None)
        if created_at is not None:
            queryset = self.queryset.filter(created_at__gt=created_at)
        last_modified_at = self.request.QUERY_PARAMS.get('last_modified_at__gt', None)
        if last_modified_at is not None:
            queryset = self.queryset.filter(last_modified_at__gt=last_modified_at)
        print queryset.query
        return queryset


class ProjectUpdateExtraViewSet(BaseRSRViewSet):

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
        'user__organisation__primary_location__location_target__partner_types',
        'user__organisation__primary_location__location_target__internal_org_ids',

    ).prefetch_related(
        'user__organisations',
        'user__organisations__primary_location',
        'user__organisations__primary_location__country',
        'user__organisations__primary_location__location_target',
        'user__organisations__primary_location__location_target__partner_types')
    serializer_class = ProjectUpdateExtraSerializer
    filter_fields = ('project', 'user', )

    def get_queryset(self):
        """Allow simple filtering on selected fields."""
        queryset = self.queryset
        project = self.request.QUERY_PARAMS.get('project', None)
        if project is not None:
            queryset = self.queryset.filter(project=project)
        uuid = self.request.QUERY_PARAMS.get('uuid', None)
        if uuid is not None:
            queryset = self.queryset.filter(uuid=uuid)
        created_at = self.request.QUERY_PARAMS.get('created_at__gt', None)
        if created_at is not None:
            queryset = self.queryset.filter(created_at__gt=created_at)
        last_modified_at = self.request.QUERY_PARAMS.get('last_modified_at__gt', None)
        if last_modified_at is not None:
            queryset = self.queryset.filter(last_modified_at__gt=last_modified_at)
        return queryset
