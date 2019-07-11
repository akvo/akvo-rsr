# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import CrsAdd, CrsAddOtherFlag

from ..serializers import CrsAddSerializer, CrsAddOtherFlagSerializer
from ..viewsets import PublicProjectViewSet


class CrsAddViewSet(PublicProjectViewSet):
    """
    """
    queryset = CrsAdd.objects.prefetch_related('other_flags').all()
    serializer_class = CrsAddSerializer


class CrsAddOtherFlagViewSet(PublicProjectViewSet):
    """
    """
    queryset = CrsAddOtherFlag.objects.all()
    serializer_class = CrsAddOtherFlagSerializer
    project_relation = 'crs__project__'
