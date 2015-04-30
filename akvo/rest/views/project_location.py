# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import ProjectLocation
from ..serializers import ProjectLocationSerializer, MapProjectLocationSerializer
from ..viewsets import BaseRSRViewSet


class ProjectLocationViewSet(BaseRSRViewSet):
    """
    """
    queryset = ProjectLocation.objects.all()
    serializer_class = ProjectLocationSerializer
    filter_fields = ('location_target', 'country', )


class MapProjectLocationViewSet(BaseRSRViewSet):

    """Returns a resource tailored for generating a map of project locations.

    Allowed parameters are:
    limit (default 100 / max 500),
    location_target (filter on project ID), and
    country (filter on country ID)
    """

    filter_fields = ('location_target', 'country')
    max_paginate_by = 500
    paginate_by = 100
    queryset = ProjectLocation.objects.select_related(
        'location_target', 'country').only(
            'id', 'latitude', 'longitude',
            'location_target__id', 'location_target__title',
            'location_target__current_image',
            'country')
    serializer_class = MapProjectLocationSerializer
