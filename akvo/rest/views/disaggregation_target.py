# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import DisaggregationTarget

from ..serializers import DisaggregationTargetSerializer
from ..viewsets import PublicProjectViewSet


class DisaggregationTargetViewSet(PublicProjectViewSet):

    queryset = DisaggregationTarget.objects.select_related('dimension_value__name')
    serializer_class = DisaggregationTargetSerializer
    project_relation = 'period__indicator__result__project__'
