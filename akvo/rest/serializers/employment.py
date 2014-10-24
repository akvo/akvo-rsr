# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers

from akvo.rsr.models import Employment

from .country import CountrySerializer
from .organisation import OrganisationSerializer
from .rsr_serializer import BaseRSRSerializer
from .user import UserSerializer


class EmploymentSerializer(BaseRSRSerializer):

    # These two can be deleted, but are still used somewhere
    organisation_name = serializers.Field(source='organisation.long_name')
    country_name = serializers.Field(source='country.name')

    organisation_full = OrganisationSerializer(source='organisation', required=False, read_only=True)
    user_full = UserSerializer(source='user', required=False, read_only=True)
    country_full = CountrySerializer(source='country', required=False, read_only=True)

    class Meta:
        model = Employment
