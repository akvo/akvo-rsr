# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.indicator_period import IndicatorPeriodSerializer
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import Indicator


class IndicatorSerializer(BaseRSRSerializer):

    class Meta:
        model = Indicator


class IndicatorFrameworkSerializer(BaseRSRSerializer):

    periods = IndicatorPeriodSerializer(many=True, required=False, allow_add_remove=True)

    class Meta:
        model = Indicator
