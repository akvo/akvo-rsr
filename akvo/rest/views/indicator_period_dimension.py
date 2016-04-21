# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorPeriodActualDimension, IndicatorPeriodTargetDimension

from ..serializers import (IndicatorPeriodActualDimensionSerializer,
                           IndicatorPeriodTargetDimensionSerializer)
from ..viewsets import PublicProjectViewSet


class IndicatorPeriodActualDimensionViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodActualDimension.objects.all()
    serializer_class = IndicatorPeriodActualDimensionSerializer
    project_relation = 'period__indicator__result__project__'


class IndicatorPeriodTargetDimensionViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodTargetDimension.objects.all()
    serializer_class = IndicatorPeriodTargetDimensionSerializer
    project_relation = 'period__indicator__result__project__'
