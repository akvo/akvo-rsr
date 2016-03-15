# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorReference

from ..serializers import IndicatorReferenceSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorReferenceViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorReference.objects.all()
    serializer_class = IndicatorReferenceSerializer
    filter_fields = {
        'indicator': ['exact'],
        'indicator__result': ['exact'],
        'indicator__result__project': ['exact'],
        'vocabulary': ['exact'],
    }
    project_relation = 'indicator__result__project__'
