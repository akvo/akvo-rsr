# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import PlannedDisbursement

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class PlannedDisbursementSerializer(BaseRSRSerializer):

    provider_organisation_show_link = serializers.Field(source='provider_organisation_show_link')
    receiver_organisation_show_link = serializers.Field(source='receiver_organisation_show_link')
    currency_label = serializers.Field(source='iati_currency')
    type_label = serializers.Field(source='iati_type')

    class Meta:
        model = PlannedDisbursement
