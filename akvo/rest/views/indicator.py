# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Indicator, IndicatorPeriod

from ..serializers import IndicatorSerializer, IndicatorPeriodSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer
    filter_fields = ('result', )

    def get_queryset(self, related_to='result__project__'):
        return super(IndicatorViewSet, self).get_queryset(related_to)


class IndicatorPeriodViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.all()
    serializer_class = IndicatorPeriodSerializer
    filter_fields = ('indicator', )

    def get_queryset(self, related_to='indicator__result__project__'):
        return super(IndicatorPeriodViewSet, self).get_queryset(related_to)
