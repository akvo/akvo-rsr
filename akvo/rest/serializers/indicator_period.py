# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rest.serializers.indicator_period_data import (
    IndicatorPeriodDataFrameworkSerializer, IndicatorPeriodDataLiteSerializer)
from akvo.rest.serializers.indicator_period_disaggregation import (
    IndicatorPeriodDisaggregationLiteSerializer, IndicatorPeriodDisaggregationReadOnlySerializer)
from akvo.rsr.models import Indicator, IndicatorPeriod, IndicatorPeriodData, DisaggregationTarget
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


def create_or_update_disaggregation_targets(instance, disaggregation_targets):
    for dt in disaggregation_targets:
        instance_key = 'indicator' if isinstance(instance, Indicator) else 'period'
        data = dict(dimension_value=dt['dimension_value'])
        data[instance_key] = instance
        defaults = dict(value=dt['value'])

        target, created = instance.disaggregation_targets.get_or_create(**data, defaults=defaults)
        if not created:
            target.value = dt['value']
            target.save(update_fields=['value'])


class DisaggregationTargetNestedSerializer(BaseRSRSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = DisaggregationTarget
        fields = '__all__'
        read_only_fields = ('id', 'period')


class IndicatorPeriodSerializer(BaseRSRSerializer):

    indicator_unicode = serializers.ReadOnlyField(source='indicator.__str__')
    percent_accomplishment = serializers.ReadOnlyField()
    can_add_update = serializers.ReadOnlyField(source='can_save_update')
    disaggregations = IndicatorPeriodDisaggregationLiteSerializer(many=True, required=False, read_only=True)
    disaggregation_targets = DisaggregationTargetNestedSerializer(many=True, required=False)

    class Meta:
        model = IndicatorPeriod
        fields = '__all__'

    # TODO: add validation for parent_period

    def validate_disaggregation_targets(self, data):
        for target in data:
            if 'value' not in target:
                raise serializers.ValidationError('Disaggregation targets should have a value')
            if 'dimension_value' not in target:
                raise serializers.ValidationError(
                    'Disaggregation targets should have "dimension_value"')
        return data

    def create(self, validated_data):
        validated_data.pop('disaggregation_targets', [])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        disaggregation_targets = validated_data.pop('disaggregation_targets', [])
        instance = super().update(instance, validated_data)
        create_or_update_disaggregation_targets(instance, disaggregation_targets)
        return instance


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

    def get_updates(self, obj: IndicatorPeriod):
        # FIXME: this is a very slow method
        #        The more projects there are, the slower
        user = self.context['request'].user
        project_id = obj.indicator.result.project_id
        viewable_updates = user.viewable_indicator_updates(project_id) if not user.is_anonymous else []
        if viewable_updates:
            # Using filter will throw away prefetched objects
            updates = [datum for datum in obj.data.all() if datum.id in viewable_updates]
            serializer = IndicatorPeriodDataLiteSerializer(updates, many=True)
            return serializer.data
        else:
            return []

    class Meta:
        model = IndicatorPeriod
        fields = '__all__'
