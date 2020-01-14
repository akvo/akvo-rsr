# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import ProjectLocation, AdministrativeLocation
from ..serializers import (ProjectLocationSerializer, AdministrativeLocationSerializer,
                           MapProjectLocationSerializer)
from ..viewsets import BaseRSRViewSet, PublicProjectViewSet


class ProjectLocationViewSet(PublicProjectViewSet):
    """
    """
    queryset = ProjectLocation.objects.all()
    serializer_class = ProjectLocationSerializer
    project_relation = 'location_target__'


class AdministrativeLocationViewSet(PublicProjectViewSet):
    """
    """
    queryset = AdministrativeLocation.objects.all()
    serializer_class = AdministrativeLocationSerializer
    project_relation = 'location__location_target__'


class MapProjectLocationViewSet(BaseRSRViewSet):
    r"""Returns a resource tailored for generating a map of project locations.

    Allowed parameters are:
    __limit__ (default 100 / max 500),
    __location_target__ (filter on project ID),
    __location_target\__partners__ (filter on organisation ID), and
    __country__ (filter on country ID)
    """

    serializer_class = MapProjectLocationSerializer
    max_paginate_by = 500
    paginate_by = 100
    # TODO: shouldn't this be subject to private project filtering?
    queryset = ProjectLocation.objects.select_related('location_target', 'country').only(
        'id', 'latitude', 'longitude',
        'location_target__id', 'location_target__title',
        'location_target__current_image',
        'country'
    )
