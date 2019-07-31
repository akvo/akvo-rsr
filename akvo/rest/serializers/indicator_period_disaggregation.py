# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import IndicatorPeriodDisaggregation


class IndicatorPeriodDisaggregationSerializer(BaseRSRSerializer):

    dimension_name = serializers.SerializerMethodField()
    dimension_value = serializers.SerializerMethodField()

    def get_dimension_name(self, obj):
        return {'id': obj.dimension_value.name.pk, 'name': obj.dimension_value.name.name}

    def get_dimension_value(self, obj):
        return {'id': obj.dimension_value.pk, 'value': obj.dimension_value.value}

    class Meta:
        model = IndicatorPeriodDisaggregation
        fields = ('dimension_name', 'dimension_value', 'value', 'numerator', 'denominator')
