# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import Disaggregation


class DisaggregationSerializer(BaseRSRSerializer):

    dimension = serializers.SerializerMethodField()

    def get_dimension(self, obj):
        return obj.dimension_value.dimension.pk

    class Meta:
        model = Disaggregation
