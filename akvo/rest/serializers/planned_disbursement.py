# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import PlannedDisbursement

from .rsr_serializer import BaseRSRSerializer
from .organisation import OrganisationBasicSerializer

from rest_framework import serializers


class PlannedDisbursementRawSerializer(BaseRSRSerializer):

    class Meta:
        model = PlannedDisbursement


class PlannedDisbursementRawDeepSerializer(PlannedDisbursementRawSerializer):

    provider_organisation = OrganisationBasicSerializer()
    receiver_organisation = OrganisationBasicSerializer()


class PlannedDisbursementSerializer(PlannedDisbursementRawSerializer):

    provider_organisation_show_link = serializers.ReadOnlyField()
    receiver_organisation_show_link = serializers.ReadOnlyField()
    currency_label = serializers.ReadOnlyField(source='iati_currency_unicode')
    type_label = serializers.ReadOnlyField(source='iati_type_unicode')
