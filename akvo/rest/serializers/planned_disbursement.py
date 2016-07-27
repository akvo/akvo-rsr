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

    provider_organisation = OrganisationBasicSerializer(source='provider_organisation')
    receiver_organisation = OrganisationBasicSerializer(source='receiver_organisation')


class PlannedDisbursementSerializer(PlannedDisbursementRawSerializer):

    provider_organisation_show_link = serializers.ReadOnlyField(source='provider_organisation_show_link')
    receiver_organisation_show_link = serializers.ReadOnlyField(source='receiver_organisation_show_link')
    currency_label = serializers.ReadOnlyField(source='iati_currency')
    type_label = serializers.ReadOnlyField(source='iati_type')
