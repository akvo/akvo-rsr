# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rest.serializers.indicator_period_data import (
    IndicatorPeriodDataFrameworkSerializer, IndicatorPeriodDataLiteSerializer)
from akvo.rest.serializers.indicator_period_disaggregation import (
    IndicatorPeriodDisaggregationLiteSerializer, IndicatorPeriodDisaggregationReadOnlySerializer)
from akvo.rsr.models import IndicatorPeriod, IndicatorPeriodData
from akvo.utils import ensure_decimal, maybe_decimal

from rest_framework import serializers


def serialize_disaggregation_targets(period):
    return [
        {
            'id': t.id,
            'value': t.value,
            'dimension_value': t.dimension_value_id,
            'period': period.id,
        }
        for t in period.disaggregation_targets.all()
    ]


class IndicatorPeriodSerializer(BaseRSRSerializer):

    indicator_unicode = serializers.ReadOnlyField(source='indicator.__str__')
    percent_accomplishment = serializers.ReadOnlyField()
    can_add_update = serializers.ReadOnlyField(source='can_save_update')
    disaggregations = IndicatorPeriodDisaggregationLiteSerializer(many=True, required=False, read_only=True)
    disaggregation_targets = serializers.SerializerMethodField()

    def get_disaggregation_targets(self, obj):
        return serialize_disaggregation_targets(obj)

    class Meta:
        model = IndicatorPeriod
        fields = '__all__'

    # TODO: add validation for parent_period


class IndicatorPeriodFrameworkSerializer(BaseRSRSerializer):

    data = serializers.SerializerMethodField('get_updates')
    parent_period = serializers.ReadOnlyField(source='parent_period_id')
    percent_accomplishment = serializers.ReadOnlyField()
    disaggregations = IndicatorPeriodDisaggregationLiteSerializer(many=True, required=False, read_only=True)
    disaggregation_targets = serializers.SerializerMethodField()

    class Meta:
        model = IndicatorPeriod
        fields = '__all__'

    def get_disaggregation_targets(self, obj):
        return serialize_disaggregation_targets(obj)

    def get_updates(self, obj):
        user = self.context['request'].user
        updates = IndicatorPeriodData.objects.filter(period=obj).select_related(
            'period',
            'user',
            'approved_by',
        ).prefetch_related(
            'comments',
            'comments__user'
        )
        updates = IndicatorPeriodData.get_user_viewable_updates(updates, user)
        serializer = IndicatorPeriodDataFrameworkSerializer(updates, many=True)
        return serializer.data


class IndicatorPeriodFrameworkLiteSerializer(BaseRSRSerializer):

    parent_period = serializers.ReadOnlyField(source='parent_period_id')
    percent_accomplishment = serializers.ReadOnlyField()
    disaggregation_targets = serializers.SerializerMethodField()

    class Meta:
        model = IndicatorPeriod
        fields = '__all__'

    def get_disaggregation_targets(self, obj):
        return serialize_disaggregation_targets(obj)


class IndicatorPeriodFrameworkNotSoLiteSerializer(BaseRSRSerializer):

    updates = serializers.SerializerMethodField()
    parent_period = serializers.ReadOnlyField(source='parent_period_id')
    percent_accomplishment = serializers.ReadOnlyField()
    disaggregations = IndicatorPeriodDisaggregationReadOnlySerializer(many=True, required=False, read_only=True)
    disaggregation_targets = serializers.SerializerMethodField()
    can_add_update = serializers.ReadOnlyField(source='can_save_update')
    actual_value = serializers.SerializerMethodField()
    target_value = serializers.SerializerMethodField()

    def get_actual_value(self, obj):
        return ensure_decimal(obj.actual_value)

    def get_target_value(self, obj):
        return ensure_decimal(obj.target_value)

    def get_disaggregation_targets(self, obj):
        return [
            {
                'id': t.id,
                'category': t.dimension_value.name.name,
                'category_id': t.dimension_value.name.id,
                'type': t.dimension_value.value,
                'type_id': t.dimension_value.id,
                'value': maybe_decimal(t.value),
            }
            for t in obj.disaggregation_targets.all()
        ]

    def get_updates(self, obj):
        user = self.context['request'].user
        updates = IndicatorPeriodData.objects.filter(period=obj)\
            .select_related('user')\
            .prefetch_related('disaggregations')
        project_id = obj.indicator.result.project_id
        viewable_updates = user.viewable_indicator_updates(project_id)
        updates = updates.filter(pk__in=viewable_updates).distinct()
        serializer = IndicatorPeriodDataLiteSerializer(updates, many=True)
        return serializer.data

    class Meta:
        model = IndicatorPeriod
        fields = '__all__'
