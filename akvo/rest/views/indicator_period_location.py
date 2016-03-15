# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorPeriodActualLocation, IndicatorPeriodTargetLocation

from ..serializers import (IndicatorPeriodActualLocationSerializer,
                           IndicatorPeriodTargetLocationSerializer)
from ..viewsets import PublicProjectViewSet


class IndicatorPeriodActualLocationViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodActualLocation.objects.all()
    serializer_class = IndicatorPeriodActualLocationSerializer
    filter_fields = ('period', )
    project_relation = 'period__indicator__result__project__'


class IndicatorPeriodTargetLocationViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodTargetLocation.objects.all()
    serializer_class = IndicatorPeriodTargetLocationSerializer
    filter_fields = ('period', )
    project_relation = 'period__indicator__result__project__'
