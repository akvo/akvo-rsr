# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import IndicatorDimensionName
from .indicator_dimension_value import IndicatorDimensionValueSerializer


class IndicatorDimensionNameSerializer(BaseRSRSerializer):

    values = IndicatorDimensionValueSerializer(source='dimension_values', many=True, required=False)

    class Meta:
        model = IndicatorDimensionName
        fields = '__all__'
