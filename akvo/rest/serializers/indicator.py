# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorPeriod, Indicator

from .rsr_serializer import BaseRSRSerializer


class IndicatorPeriodSerializer(BaseRSRSerializer):

    class Meta:
        model = IndicatorPeriod


class IndicatorSerializer(BaseRSRSerializer):

    periods = IndicatorPeriodSerializer(many=True, required=False, allow_add_remove=True)

    class Meta:
        model = Indicator
