# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Organisation

from ..fields import Base64ImageField

from .organisation_location import OrganisationLocationSerializer, OrganisationLocationExtraSerializer
from .rsr_serializer import BaseRSRSerializer


class OrganisationSerializer(BaseRSRSerializer):

    locations = OrganisationLocationSerializer(source='locations', many=True, required=False, allow_add_remove=True)
    logo = Base64ImageField(required=False, allow_empty_file=True)

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
            'long_name'
        )
