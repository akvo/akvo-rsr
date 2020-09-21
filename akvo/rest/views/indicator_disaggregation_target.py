# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import IndicatorDisaggregationTarget

from ..serializers import IndicatorDisaggregationTargetSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorDisaggregationTargetViewSet(PublicProjectViewSet):

    queryset = IndicatorDisaggregationTarget.objects.select_related('dimension_value__name')
    serializer_class = IndicatorDisaggregationTargetSerializer
    project_relation = 'indicator__result__project__'
