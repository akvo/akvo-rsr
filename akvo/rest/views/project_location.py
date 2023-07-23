# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import ProjectLocation, AdministrativeLocation
from ..serializers import ProjectLocationSerializer, AdministrativeLocationSerializer
from ..viewsets import PublicProjectViewSet


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
