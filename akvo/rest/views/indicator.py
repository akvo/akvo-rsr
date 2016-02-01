# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import (Indicator, IndicatorPeriod, IndicatorPeriodData,
                             IndicatorPeriodDataComment)

from ..serializers import IndicatorSerializer, IndicatorPeriodSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer
    filter_fields = ('result', )
    project_relation = 'result__project__'


class IndicatorPeriodViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.all()
    serializer_class = IndicatorPeriodSerializer
    filter_fields = ('indicator', )
    project_relation = 'indicator__result__project__'


class IndicatorPeriodDataViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodData.objects.all()
    serializer_class = IndicatorPeriodSerializer
    filter_fields = ('period', 'user', 'relative_data', 'status', 'update_method')
    project_relation = 'period__indicator__result__project__'


class IndicatorPeriodDataCommentViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodDataComment.objects.all()
    serializer_class = IndicatorPeriodSerializer
    filter_fields = ('data', 'user')
    project_relation = 'period__indicator__result__project__'
