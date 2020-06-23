# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rest.serializers.disaggregation_contribution import DisaggregationContributionSerializer
from akvo.rsr.models import IndicatorPeriodDisaggregation
from akvo.utils import ensure_decimal, maybe_decimal


class IndicatorPeriodDisaggregationSerializer(BaseRSRSerializer):

    dimension_name = serializers.SerializerMethodField()
    dimension_value = serializers.SerializerMethodField()
    contributors = DisaggregationContributionSerializer(many=True, required=False, read_only=True)

    def get_dimension_name(self, obj):
        return {'id': obj.dimension_value.name.pk, 'name': obj.dimension_value.name.name}

    def get_dimension_value(self, obj):
        return {'id': obj.dimension_value.pk, 'value': obj.dimension_value.value}

    class Meta:
        model = IndicatorPeriodDisaggregation
        fields = (
            'id',
            'dimension_name',
            'dimension_value',
            'value',
            'numerator',
            'denominator',
            'contributors',
        )


class IndicatorPeriodDisaggregationLiteSerializer(BaseRSRSerializer):

    dimension_name = serializers.SerializerMethodField()
    dimension_value = serializers.SerializerMethodField()

    def get_dimension_name(self, obj):
        return {'id': obj.dimension_value.name.pk, 'name': obj.dimension_value.name.name}

    def get_dimension_value(self, obj):
        return {'id': obj.dimension_value.pk, 'value': obj.dimension_value.value}

    class Meta:
        model = IndicatorPeriodDisaggregation
        fields = (
            'id',
            'dimension_name',
            'dimension_value',
            'value',
            'numerator',
            'denominator',
        )


class IndicatorPeriodDisaggregationReadOnlySerializer(BaseRSRSerializer):
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
        model = IndicatorPeriodDisaggregation
        fields = (
            'id',
            'category',
            'category_id',
            'type',
            'type_id',
            'value',
            'numerator',
            'denominator',
        )
