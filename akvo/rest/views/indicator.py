# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers import IndicatorSerializer, IndicatorFrameworkSerializer
from akvo.rest.viewsets import PublicProjectViewSet
from akvo.rsr.models import Indicator


class IndicatorViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer
    filter_fields = {
        'result': ['exact'],
        'result__project': ['exact'],
        'measure': ['exact'],
        'ascending': ['exact'],
        'baseline_year': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'baseline_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
    }
    project_relation = 'result__project__'


class IndicatorFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all()
    serializer_class = IndicatorFrameworkSerializer
    filter_fields = {
        'result': ['exact'],
        'result__project': ['exact'],
        'measure': ['exact'],
        'ascending': ['exact'],
        'baseline_year': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'baseline_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
    }
    project_relation = 'result__project__'
