# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import IndicatorCustomField, IndicatorCustomValue


class IndicatorCustomFieldSerializer(BaseRSRSerializer):

    class Meta:
        model = IndicatorCustomField
        fields = '__all__'


class IndicatorCustomValueSerializer(BaseRSRSerializer):

    class Meta:
        model = IndicatorCustomValue
        fields = (
            'id', 'indicator', 'custom_field', 'text_value', 'boolean_value', 'dropdown_selection'
        )
