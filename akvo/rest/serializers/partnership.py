# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers

from akvo.rsr.models import Partnership

from akvo.rest.serializers.organisation import OrganisationBasicSerializer
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer


class PartnershipRawSerializer(BaseRSRSerializer):

    class Meta:
        model = Partnership


class PartnershipRawDeepSerializer(PartnershipRawSerializer):
    organisation = OrganisationBasicSerializer(source='organisation')


class PartnershipSerializer(PartnershipRawSerializer):

    organisation_show_link = serializers.Field(source='organisation_show_link')
    partner_type = serializers.Field(source='iati_role_to_partner_type')
    organisation_role_label = serializers.Field(source='iati_organisation_role_label')
    funding_amount_label = serializers.Field(source='funding_amount_with_currency')


class PartnershipBasicSerializer(BaseRSRSerializer):

    organisation = OrganisationBasicSerializer(source='organisation')
    iati_organisation_role_label = serializers.Field(source='iati_organisation_role_label')

    class Meta:
        model = Partnership
        fields = (
            'id',
            'project',
            'organisation',
            'iati_organisation_role',
            'iati_organisation_role_label',
        )
