# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import OrganisationLocation

from .rsr_serializer import BaseRSRSerializer


class OrganisationLocationSerializer(BaseRSRSerializer):

    location_target = serializers.Field(source='location_target.pk')

    class Meta:
        model = OrganisationLocation


class OrganisationLocationExtraSerializer(OrganisationLocationSerializer):

    class Meta(OrganisationLocationSerializer.Meta):
        depth = 1

