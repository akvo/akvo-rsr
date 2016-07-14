# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Transaction, TransactionSector

from .rsr_serializer import BaseRSRSerializer
from .organisation import OrganisationBasicSerializer

from rest_framework import serializers


class TransactionRawSerializer(BaseRSRSerializer):

    class Meta:
        model = Transaction


class TransactionRawDeepSerializer(TransactionRawSerializer):

    provider_organisation = OrganisationBasicSerializer(source='provider_organisation')
    receiver_organisation = OrganisationBasicSerializer(source='receiver_organisation')

    class Meta:
        model = Transaction


class TransactionSerializer(TransactionRawSerializer):

    provider_organisation_show_link = serializers.Field(source='provider_organisation_show_link')
    receiver_organisation_show_link = serializers.Field(source='receiver_organisation_show_link')
    currency_label = serializers.Field(source='iati_currency')
    transaction_type_label = serializers.Field(source='iati_transaction_type')
    aid_type_label = serializers.Field(source='iati_aid_type')
    disbursement_channel_label = serializers.Field(source='iati_disbursement_channel')
    finance_type_label = serializers.Field(source='iati_finance_type')
    flow_type_label = serializers.Field(source='iati_flow_type')
    tied_status_label = serializers.Field(source='iati_tied_status')
    recipient_country_label = serializers.Field(source='iati_recipient_country')
    recipient_region_label = serializers.Field(source='iati_recipient_region')
    recipient_region_vocabulary_label = serializers.Field(source='iati_recipient_region_vocabulary')


class TransactionSectorSerializer(BaseRSRSerializer):

    transaction_unicode = serializers.Field(source='transaction')
    code_label = serializers.Field(source='iati_sector')
    vocabulary_label = serializers.Field(source='iati_vocabulary')

    class Meta:
        model = TransactionSector
