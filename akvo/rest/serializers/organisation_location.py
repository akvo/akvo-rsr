# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework import serializers
from akvo.rsr.models import OrganisationLocation
from ..fields import Base64ImageField
from .country import CountrySerializer
from .rsr_serializer import BaseRSRSerializer


class OrganisationLocationSerializer(BaseRSRSerializer):

    class Meta:
        model = OrganisationLocation
        fields = '__all__'


class OrganisationLocationExtraSerializer(OrganisationLocationSerializer):

    class Meta(OrganisationLocationSerializer.Meta):
        depth = 1


class MapOrganisationSerializer(serializers.Serializer):

    """To serialize the organisation field of the organisation map resource."""

    id = serializers.IntegerField()
    name = serializers.CharField()
    url = serializers.URLField(source='get_absolute_url')
    logo = Base64ImageField(required=False, allow_empty_file=True, allow_null=True)

    class Meta:
        fields = '__all__'


class MapOrganisationLocationSerializer(serializers.Serializer):

    """To serialize the organisation map resource."""

    id = serializers.IntegerField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    organisation = MapOrganisationSerializer(source='location_target')
    country = CountrySerializer()

    class Meta:
        fields = '__all__'
