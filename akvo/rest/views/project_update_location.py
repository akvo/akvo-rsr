# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectUpdateLocation

from ..serializers import ProjectUpdateLocationSerializer
from ..viewsets import BaseRSRViewSet


class ProjectUpdateLocationViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation locations to be viewed or edited.
    """
    queryset = ProjectUpdateLocation.objects.all()
    serializer_class = ProjectUpdateLocationSerializer
