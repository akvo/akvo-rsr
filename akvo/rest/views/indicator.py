# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Indicator, IndicatorPeriod

from ..serializers import IndicatorSerializer, IndicatorPeriodSerializer
from ..viewsets import BaseRSRViewSet


class IndicatorViewSet(BaseRSRViewSet):
    """
    """
    queryset = Indicator.objects.filter(result__project__is_public=True)
    serializer_class = IndicatorSerializer
    filter_fields = ('result', )


class IndicatorPeriodViewSet(BaseRSRViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.filter(indicator__result__project__is_public=True)
    serializer_class = IndicatorPeriodSerializer
    filter_fields = ('indicator', )
