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

    def is_valid(self, raise_exception=False):
        # HACK to allow nested posting... There should be a better way than this!
        self._values = self.initial_data.pop('values', [])
        return super(IndicatorDimensionNameSerializer, self).is_valid(raise_exception)

    def create(self, validated_data):
        instance = super(IndicatorDimensionNameSerializer, self).create(validated_data)
        for value in self._values:
            value['name'] = instance.id
            serializer = IndicatorDimensionValueSerializer(data=value)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return instance
