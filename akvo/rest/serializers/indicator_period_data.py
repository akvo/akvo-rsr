# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.contrib.auth import get_user_model
from rest_framework import serializers

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rest.serializers.user import UserDetailsSerializer
from akvo.rsr.models import IndicatorPeriod, IndicatorPeriodData, IndicatorPeriodDataComment


class IndicatorPeriodDataCommentSerializer(BaseRSRSerializer):

    user_details = UserDetailsSerializer(required=False, source='user')

    class Meta:
        model = IndicatorPeriodDataComment


class IndicatorPeriodDataSerializer(BaseRSRSerializer):

    user_details = UserDetailsSerializer(required=False, source='user')
    status_display = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    file_url = serializers.ReadOnlyField()

    class Meta:
        model = IndicatorPeriodData


class IndicatorPeriodDataFrameworkSerializer(BaseRSRSerializer):

    period = serializers.PrimaryKeyRelatedField(queryset=IndicatorPeriod.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    comments = IndicatorPeriodDataCommentSerializer(read_only=True, many=True, required=False)
    user_details = UserDetailsSerializer(required=False, source='user')
    status_display = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    file_url = serializers.ReadOnlyField()

    class Meta:
        model = IndicatorPeriodData

    def create(self, validated_data):
        return IndicatorPeriodData.objects.create(**validated_data)
