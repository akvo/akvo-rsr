# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers

from akvo.rsr.models import Employment

from .rsr_serializer import BaseRSRSerializer


class EmploymentSerializer(BaseRSRSerializer):

    organisation_name = serializers.ReadOnlyField(source='organisation.long_name')
    country_name = serializers.ReadOnlyField(source='iati_country_unicode')
    group_name = serializers.ReadOnlyField(source='group.name')

    class Meta:
        model = Employment
        fields = '__all__'
