# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectLocation

from ..serializers import ProjectLocationSerializer
from ..viewsets import BaseRSRViewSet


class ProjectLocationViewSet(BaseRSRViewSet):
    """
    """
    queryset = ProjectLocation.objects.all()
    serializer_class = ProjectLocationSerializer
    filter_fields = ('location_target', 'country', )
