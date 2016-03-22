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
    queryset = Fss.objects.all()
    serializer_class = FssSerializer
    filter_fields = ('project', )


class FssForecastViewSet(PublicProjectViewSet):
    """
    """
    queryset = FssForecast.objects.all()
    serializer_class = FssForecastSerializer
    filter_fields = ('fss__project', 'fss', )
    project_relation = 'fss__project__'
