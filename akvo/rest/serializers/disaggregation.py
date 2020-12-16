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

    # NOTE: this validation should be necessary when doing operation directly on disaggregations endpoint but
    # might cause problems when bulk update disaggregations values through the IndicatorPeriodDataFrameworkSerializer.
    # One way to solve this it to not expose the disaggregations endpoint.
    # def validate_value(self, value):
    #     from django.db.models import Sum
    #     from akvo.rsr.models import IndicatorPeriodData, IndicatorDimensionValue
    #     data = self.get_initial()
    #     update = IndicatorPeriodData.objects.get(pk=data['update'])
    #     type = IndicatorDimensionValue.objects.prefetch_related('name').get(pk=data['dimension_value'])
    #     category = type.name
    #     subtotal = Disaggregation.objects\
    #         .filter(update=update, dimension_value__name=category)\
    #         .exclude(dimension_value=type)\
    #         .aggregate(values=Sum('value')).get('values')
    #     total = subtotal + value if subtotal else value
    #     if total > update.value:
    #         raise serializers.ValidationError("The accumulated disaggregations value should not exceed update value")
    #     return value


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
