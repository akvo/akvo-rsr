# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.indicator_period import (
    IndicatorPeriodFrameworkSerializer, IndicatorPeriodFrameworkLiteSerializer,
    IndicatorPeriodFrameworkNotSoLiteSerializer)
from akvo.rest.serializers.indicator_dimension_name import IndicatorDimensionNameSerializer
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import Indicator, IndicatorDimensionName, IndicatorLabel

from rest_framework import serializers


class LabelListingField(serializers.RelatedField):

    def to_representation(self, labels):
        if isinstance(labels, IndicatorLabel):
            value = labels.label_id
        else:
            value = list(labels.values_list('label_id', flat=True))
        return value

    def to_internal_value(self, org_label_ids):
        indicator = self.root.instance
        existing_labels = set(indicator.labels.values_list('label_id', flat=True))
        new_labels = set(org_label_ids) - existing_labels
        deleted_labels = existing_labels - set(org_label_ids)
        labels = [IndicatorLabel(indicator=indicator, label_id=org_label_id) for org_label_id in new_labels]
        IndicatorLabel.objects.bulk_create(labels)
        if deleted_labels:
            IndicatorLabel.objects.filter(label_id__in=deleted_labels).delete()

        return indicator.labels.all()


class IndicatorSerializer(BaseRSRSerializer):

    result_unicode = serializers.ReadOnlyField(source='result.__str__')
    measure_label = serializers.ReadOnlyField(source='iati_measure_unicode')
    children_aggregate_percentage = serializers.ReadOnlyField()
    dimension_names = serializers.PrimaryKeyRelatedField(
        many=True, queryset=IndicatorDimensionName.objects.all())

    class Meta:
        model = Indicator
        fields = '__all__'

    # TODO: add validation for parent_indicator


class IndicatorFrameworkSerializer(BaseRSRSerializer):

    periods = IndicatorPeriodFrameworkSerializer(many=True, required=False, read_only=True)
    parent_indicator = serializers.ReadOnlyField(source='parent_indicator_id')
    children_aggregate_percentage = serializers.ReadOnlyField()
    dimension_names = IndicatorDimensionNameSerializer(many=True, required=False, read_only=True)
    labels = LabelListingField(queryset=IndicatorLabel.objects.all(), required=False)

    class Meta:
        model = Indicator
        fields = '__all__'


class IndicatorFrameworkLiteSerializer(BaseRSRSerializer):

    periods = IndicatorPeriodFrameworkLiteSerializer(many=True, required=False, read_only=True)
    parent_indicator = serializers.ReadOnlyField(source='parent_indicator_id')
    children_aggregate_percentage = serializers.ReadOnlyField()
    dimension_names = IndicatorDimensionNameSerializer(many=True, required=False, read_only=True)
    labels = LabelListingField(read_only=True)

    class Meta:
        model = Indicator
        fields = '__all__'


class IndicatorFrameworkNotSoLiteSerializer(BaseRSRSerializer):

    periods = IndicatorPeriodFrameworkNotSoLiteSerializer(many=True, required=False, read_only=True)
    parent_indicator = serializers.ReadOnlyField(source='parent_indicator_id')
    children_aggregate_percentage = serializers.ReadOnlyField()
    labels = LabelListingField(read_only=True)

    class Meta:
        model = Indicator
        fields = (
            'id',
            'periods',
            'parent_indicator',
            'children_aggregate_percentage',
            'labels',
            'title',
            'type',
            'measure',
            'ascending',
            'description',
            'baseline_year',
            'baseline_value',
            'baseline_comment',
            'order',
            'export_to_iati',
            'result',
        )
