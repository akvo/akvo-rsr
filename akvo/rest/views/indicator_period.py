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
    filter_fields = {
        'indicator': ['exact'],
        'indicator__result': ['exact'],
        'indicator__result__project': ['exact'],
        'locked': ['exact'],
        'period_start': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'period_end': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'target_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'actual_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
    }
    project_relation = 'indicator__result__project__'


class IndicatorPeriodFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.all()
    serializer_class = IndicatorPeriodFrameworkSerializer
    filter_fields = {
        'indicator': ['exact'],
        'indicator__result': ['exact'],
        'indicator__result__project': ['exact'],
        'locked': ['exact'],
        'period_start': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'period_end': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'target_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'actual_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
    }
    project_relation = 'indicator__result__project__'
