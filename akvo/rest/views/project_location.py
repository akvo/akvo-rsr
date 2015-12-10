# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import ProjectLocation, AdministrativeLocation
from ..serializers import (ProjectLocationSerializer, AdministrativeLocationSerializer,
                           MapProjectLocationSerializer)
from ..viewsets import BaseRSRViewSet


class ProjectLocationViewSet(BaseRSRViewSet):
    """
    """
    queryset = ProjectLocation.objects.all()
    serializer_class = ProjectLocationSerializer
    filter_fields = ('location_target', 'country', )


class AdministrativeLocationViewSet(BaseRSRViewSet):
    """
    """
    queryset = AdministrativeLocation.objects.all()
    serializer_class = AdministrativeLocationSerializer
    filter_fields = ('location', 'code', )


class MapProjectLocationViewSet(BaseRSRViewSet):

    """Returns a resource tailored for generating a map of project locations.

    Allowed parameters are:
    __limit__ (default 100 / max 500),
    __location_target__ (filter on project ID),
    __location_target\__partners__ (filter on organisation ID), and
    __country__ (filter on country ID)
    """

    filter_fields = (
        'location_target',
        'location_target__partners',
        'country'
    )
    max_paginate_by = 500
    paginate_by = 100
    queryset = ProjectLocation.objects.select_related('location_target', 'country').only(
            'id', 'latitude', 'longitude',
            'location_target__id', 'location_target__title',
            'location_target__current_image',
            'country'
    )
    serializer_class = MapProjectLocationSerializer
