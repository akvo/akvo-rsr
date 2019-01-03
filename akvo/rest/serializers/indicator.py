# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.indicator_period import IndicatorPeriodFrameworkSerializer
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import Indicator

from rest_framework import serializers


class IndicatorSerializer(BaseRSRSerializer):

    result_unicode = serializers.ReadOnlyField(source='result.__unicode__')
    measure_label = serializers.ReadOnlyField(source='iati_measure_unicode')
    children_aggregate_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Indicator
        fields = '__all__'

    # TODO: add validation for parent_indicator


class IndicatorFrameworkSerializer(BaseRSRSerializer):

    periods = IndicatorPeriodFrameworkSerializer(many=True, required=False)
    parent_indicator = serializers.ReadOnlyField(source='parent_indicator.pk')
    children_aggregate_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Indicator
        fields = '__all__'
