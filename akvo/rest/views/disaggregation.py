# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Disaggregation

from ..serializers import DisaggregationSerializer
from ..viewsets import PublicProjectViewSet


class DisaggregationViewSet(PublicProjectViewSet):
    """
    """
    queryset = Disaggregation.objects.all()
    serializer_class = DisaggregationSerializer
    project_relation = 'dimension__indicator__result__project__'
