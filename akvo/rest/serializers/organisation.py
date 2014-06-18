# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import Organisation

from .internal_organisation_id import InternalOrganisationIDSerializer
from .organisation_location import OrganisationLocationSerializer


class OrganisationSerializer(serializers.HyperlinkedModelSerializer):
    locations = OrganisationLocationSerializer(many=True, required=False)
    internal_ids = InternalOrganisationIDSerializer(many=True, required=False)

    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'long_name',
            'organisation_type',
            'new_organisation_type',
            'description',
            'url',
            'locations',
            'internal_ids',
        )
