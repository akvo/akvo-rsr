# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Fss, FssForecast

from ..serializers import FssSerializer, FssForecastSerializer
from ..viewsets import PublicProjectViewSet


class FssViewSet(PublicProjectViewSet):
    """
    """
    queryset = Fss.objects.prefetch_related('forecasts').all()
    serializer_class = FssSerializer


class FssForecastViewSet(PublicProjectViewSet):
    """
    """
    queryset = FssForecast.objects.all()
    serializer_class = FssForecastSerializer
    project_relation = 'fss__project__'
