# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import Organisation

from ..fields import Base64ImageField

from .organisation_budget import (OrganisationCountryBudgetSerializer,
                                  OrganisationTotalBudgetSerializer,
                                  OrganisationRecipientOrgBudgetSerializer,
                                  OrganisationRegionBudgetSerializer,
                                  OrganisationTotalExpenditureSerializer)
from .organisation_document import OrganisationDocumentSerializer
from .organisation_location import (OrganisationLocationSerializer,
                                    OrganisationLocationExtraSerializer)
from .rsr_serializer import BaseRSRSerializer


class OrganisationSerializer(BaseRSRSerializer):

    total_budgets = OrganisationTotalBudgetSerializer(read_only=True, many=True, required=False)
    recipient_org_budgets = OrganisationRecipientOrgBudgetSerializer(
        read_only=True, many=True, required=False
    )
    region_budgets = OrganisationRegionBudgetSerializer(
        source='recipient_region_budgets', read_only=True, many=True, required=False
    )
    country_budgets = OrganisationCountryBudgetSerializer(
        source='recipient_country_budgets', read_only=True, many=True, required=False
    )
    total_expenditures = OrganisationTotalExpenditureSerializer(
        read_only=True, many=True, required=False
    )
    documents = OrganisationDocumentSerializer(read_only=True, many=True, required=False)
    locations = OrganisationLocationSerializer(read_only=True, many=True, required=False)
    logo = Base64ImageField(read_only=True, required=False, allow_empty_file=True, allow_null=True)

    class Meta:
        model = Organisation


class OrganisationExtraSerializer(OrganisationSerializer):

    primary_location = OrganisationLocationExtraSerializer()

    class Meta(OrganisationSerializer.Meta):
        fields = (
            'id',
            'logo',
            'long_name',
            'name',
            'primary_location',
        )


class OrganisationBasicSerializer(BaseRSRSerializer):

    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'long_name',
            'logo'
        )
