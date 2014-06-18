# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import InternalOrganisationID


class InternalOrganisationIDSerializer(serializers.HyperlinkedModelSerializer):
    recording_org = serializers.PrimaryKeyRelatedField()
    referenced_org = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = InternalOrganisationID
        fields = (
            'recording_org',
            'referenced_org',
            'identifier',
        )
