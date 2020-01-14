# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectUpdateLocation
from ..serializers import ProjectUpdateLocationSerializer, MapProjectUpdateLocationSerializer
from ..viewsets import BaseRSRViewSet, PublicProjectViewSet


class ProjectUpdateLocationViewSet(PublicProjectViewSet):
    """
    API endpoint that allows organisation locations to be viewed or edited.
    """
    queryset = ProjectUpdateLocation.objects.all()
    serializer_class = ProjectUpdateLocationSerializer
    project_relation = 'location_target__project__'


class MapProjectUpdateLocationViewSet(BaseRSRViewSet):
    r"""Returns a resource tailored for generating a map of update locations.

    Allowed parameters are:
    __limit__ (default 100 / max 500),
    __location_target\__project__ (filter on project ID),
    __location_target\__project\__partners__
    (filter on organisation ID of the projects' organisations),
    __location_target\__user\__employers__ (filter on organisation ID of the users' organisations)
    """

    max_paginate_by = 500
    paginate_by = 100
    # TODO: shouldn't this be subject to private project filtering?
    queryset = ProjectUpdateLocation.objects.select_related(
        'location_target',
        'location_target__project'
    ).only(
        'id', 'latitude', 'longitude', 'location_target__id', 'location_target__project',
        'location_target__title', 'location_target__photo', 'location_target__video'
    )
    serializer_class = MapProjectUpdateLocationSerializer
