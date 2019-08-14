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
    queryset = Indicator.objects.all().select_related(
        'result',
        'result__project',
    ).prefetch_related(
        'child_indicators'
    )
    serializer_class = IndicatorSerializer
    project_relation = 'result__project__'


class IndicatorFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all().select_related(
        'result',
        'result__project',
    ).prefetch_related(
        'child_indicators',
        'periods',
        'periods__disaggregation_targets',
    )
    serializer_class = IndicatorFrameworkSerializer
    project_relation = 'result__project__'
