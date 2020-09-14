# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import Disaggregation
from akvo.utils import ensure_decimal, maybe_decimal


class DisaggregationSerializer(BaseRSRSerializer):

    category = serializers.ReadOnlyField(source='dimension_value.name.name')
    category_id = serializers.ReadOnlyField(source='dimension_value.name.id')
    type = serializers.ReadOnlyField(source='dimension_value.value')
    type_id = serializers.ReadOnlyField(source='dimension_value.id')

    class Meta:
        model = Disaggregation
        fields = (
            'id',
            'update',
            'dimension_value',
            'value',
            'numerator',
            'denominator',
            'incomplete_data',
            'category',
            'category_id',
            'type',
            'type_id',
            'created_at',
            'last_modified_at',
        )


class DisaggregationReadOnlySerializer(BaseRSRSerializer):

    category = serializers.ReadOnlyField(source='dimension_value.name.name')
    category_id = serializers.ReadOnlyField(source='dimension_value.name.id')
    type = serializers.ReadOnlyField(source='dimension_value.value')
    type_id = serializers.ReadOnlyField(source='dimension_value.id')
    value = serializers.SerializerMethodField()
    numerator = serializers.SerializerMethodField()
    denominator = serializers.SerializerMethodField()

    def get_value(self, obj):
        return ensure_decimal(obj.value)

    def get_numerator(self, obj):
        return maybe_decimal(obj.numerator)

    def get_denominator(self, obj):
        return maybe_decimal(obj.denominator)

    class Meta:
        model = Disaggregation
        fields = (
            'id',
            'category',
            'category_id',
            'type',
            'type_id',
            'value',
            'numerator',
            'denominator'
        )
