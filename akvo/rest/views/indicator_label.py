# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorLabel

from ..serializers import IndicatorLabelSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorLabelViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorLabel.objects.all().select_related('indicator')
    serializer_class = IndicatorLabelSerializer
    project_relation = 'indicator__result__project__'
