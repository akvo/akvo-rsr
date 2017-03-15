# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorPeriod

from ..serializers import IndicatorPeriodSerializer, IndicatorPeriodFrameworkSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorPeriodViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.all()
    serializer_class = IndicatorPeriodSerializer
    project_relation = 'indicator__result__project__'


class   IndicatorPeriodFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.all()
    serializer_class = IndicatorPeriodFrameworkSerializer
    project_relation = 'indicator__result__project__'
