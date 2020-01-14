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
        fields = '__all__'
        model = Transaction


class TransactionRawDeepSerializer(TransactionRawSerializer):

    provider_organisation = OrganisationBasicSerializer()
    receiver_organisation = OrganisationBasicSerializer()

    class Meta:
        fields = '__all__'
        model = Transaction


class TransactionSectorSerializer(BaseRSRSerializer):

    transaction_unicode = serializers.ReadOnlyField(source='transaction.__str__')
    code_label = serializers.ReadOnlyField(source='iati_sector_unicode')
    vocabulary_label = serializers.ReadOnlyField(source='iati_vocabulary_unicode')

    class Meta:
        fields = '__all__'
        model = TransactionSector


class TransactionSerializer(TransactionRawSerializer):

    provider_organisation_show_link = serializers.ReadOnlyField()
    receiver_organisation_show_link = serializers.ReadOnlyField()
    currency_label = serializers.ReadOnlyField(source='iati_currency_unicode')
    transaction_type_label = serializers.ReadOnlyField(source='iati_transaction_type_unicode')
    aid_type_label = serializers.ReadOnlyField(source='iati_aid_type_unicode')
    disbursement_channel_label = serializers.ReadOnlyField(source='iati_disbursement_channel_unicode')
    finance_type_label = serializers.ReadOnlyField(source='iati_finance_type_unicode')
    flow_type_label = serializers.ReadOnlyField(source='iati_flow_type_unicode')
    tied_status_label = serializers.ReadOnlyField(source='iati_tied_status_unicode')
    recipient_country_label = serializers.ReadOnlyField(source='iati_recipient_country_unicode')
    recipient_region_label = serializers.ReadOnlyField(source='iati_recipient_region_unicode')
    recipient_region_vocabulary_label = serializers.ReadOnlyField(source='iati_recipient_region_vocabulary_unicode')
    sectors = TransactionSectorSerializer(many=True, read_only=True)
