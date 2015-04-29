# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectUpdateLocation
from ..serializers import ProjectUpdateLocationSerializer, MapProjectUpdateLocationSerializer
from ..viewsets import BaseRSRViewSet


class ProjectUpdateLocationViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation locations to be viewed or edited.
    """
    queryset = ProjectUpdateLocation.objects.all()
    serializer_class = ProjectUpdateLocationSerializer


class MapProjectUpdateLocationViewSet(BaseRSRViewSet):

    """Returns a resource tailored for generating a map of project locations.

    The number of items allowed to be returned is raised to 100(default)/500(max).
    """

    filter_fields = ()
    max_paginate_by = 500
    paginate_by = 100
    queryset = ProjectUpdateLocation.objects.select_related(
        'location_target',
        'location_target__project').only(
            'id', 'latitude', 'longitude',
            'location_target__id', 'location_target__project', 'location_target__title',
            'location_target__photo', 'location_target__video')
    serializer_class = MapProjectUpdateLocationSerializer
