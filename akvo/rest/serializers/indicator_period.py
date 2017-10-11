# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rest.serializers.indicator_period_data import IndicatorPeriodDataFrameworkSerializer
from akvo.rsr.models import IndicatorPeriod, IndicatorPeriodData

from rest_framework import serializers


class IndicatorPeriodSerializer(BaseRSRSerializer):

    indicator_unicode = serializers.ReadOnlyField(source='indicator.__unicode__')
    parent_period = serializers.ReadOnlyField(source='parent_period.pk')
    percent_accomplishment = serializers.ReadOnlyField()

    class Meta:
        model = IndicatorPeriod


class IndicatorPeriodFrameworkSerializer(BaseRSRSerializer):

    data = serializers.SerializerMethodField('get_updates')
    parent_period = serializers.ReadOnlyField(source='parent_period.pk')
    percent_accomplishment = serializers.ReadOnlyField()

    class Meta:
        model = IndicatorPeriod

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
