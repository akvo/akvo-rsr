# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import Organisation, OrganisationLocation, InternalOrganisationID


#class CountrySerializer(serializers.HyperlinkedModelSerializer):
#    class Meta:
#        model = Country
#        fields = ('id',)

class InternalOrganisationIDSerializer(serializers.HyperlinkedModelSerializer):
    recording_org = serializers.PrimaryKeyRelatedField()
    referenced_org = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = InternalOrganisationID
        fields = ('recording_org', 'referenced_org', 'identifier',)


class OrganisationLocationSerializer(serializers.HyperlinkedModelSerializer):
    country = serializers.PrimaryKeyRelatedField()
    class Meta:
        model = OrganisationLocation
        fields = ('id', 'latitude', 'longitude', 'country', 'primary',)


class OrganisationSerializer(serializers.HyperlinkedModelSerializer):
    locations = OrganisationLocationSerializer(many=True, required=False)
    internal_ids = InternalOrganisationIDSerializer(many=True, required=False)
    class Meta:
        model = Organisation
        fields = (
            'id', 'name', 'long_name', 'organisation_type', 'new_organisation_type', 'description',
            'url', 'locations', 'internal_ids',
        )
