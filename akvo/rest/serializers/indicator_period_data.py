# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.contrib.auth import get_user_model
from rest_framework import serializers

from akvo.rest.serializers.disaggregation import DisaggregationSerializer
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rest.serializers.user import UserDetailsSerializer
from akvo.rsr.models import (
    IndicatorPeriod, IndicatorPeriodData, IndicatorPeriodDataComment
)


class IndicatorPeriodDataCommentSerializer(BaseRSRSerializer):

    user_details = UserDetailsSerializer(required=False, source='user')

    class Meta:
        model = IndicatorPeriodDataComment


class IndicatorPeriodDataSerializer(BaseRSRSerializer):

    user_details = UserDetailsSerializer(required=False, source='user')
    approver_details = UserDetailsSerializer(required=False, source='approved_by')
    status_display = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    file_url = serializers.ReadOnlyField()

    class Meta:
        model = IndicatorPeriodData


class IndicatorPeriodDataFrameworkSerializer(BaseRSRSerializer):

    period = serializers.PrimaryKeyRelatedField(queryset=IndicatorPeriod.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    comments = IndicatorPeriodDataCommentSerializer(read_only=True, many=True, required=False)
    disaggregations = DisaggregationSerializer(many=True, required=False)
    user_details = UserDetailsSerializer(required=False, source='user')
    approver_details = UserDetailsSerializer(required=False, source='approved_by')
    status_display = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    file_url = serializers.ReadOnlyField()

    class Meta:
        model = IndicatorPeriodData

    def create(self, validated_data):
        """Over-ridden to handle nested writes."""
        update = super(IndicatorPeriodDataFrameworkSerializer, self).create(validated_data)
        for disaggregation in self._disaggregations_data:
            disaggregation['update'] = update.id
            serializer = DisaggregationSerializer(data=disaggregation)
            serializer.is_valid(raise_exception=True)
            serializer.create(serializer.validated_data)

        return update

    def update(self, instance, validated_data):
        """Over-ridden to handle nested updates."""
        super(IndicatorPeriodDataFrameworkSerializer, self).update(instance, validated_data)
        for disaggregation in self._disaggregations_data:
            disaggregation['update'] = instance.id
            serializer = DisaggregationSerializer(data=disaggregation)
            serializer.is_valid(raise_exception=True)
            disaggregation_instance, _ = instance.disaggregations.get_or_create(
                update=instance,
                dimension=serializer.validated_data['dimension'],
            )
            serializer.update(disaggregation_instance, serializer.validated_data)

        return instance._meta.model.objects.select_related(
            'period',
            'user',
            'approved_by',
        ).prefetch_related(
            'comments',
            'disaggregations',
        ).get(id=instance.id)

    def is_valid(self, raise_exception=False):
        # HACK to allow nested posting...
        self._disaggregations_data = self.initial_data.pop('disaggregations', [])
        super(IndicatorPeriodDataFrameworkSerializer, self).is_valid(raise_exception=raise_exception)
