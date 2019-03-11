# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectContact

from .country import CountrySerializer
from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class ProjectContactRawSerializer(BaseRSRSerializer):

    class Meta:
        model = ProjectContact
        fields = '__all__'


class ProjectContactRawDeepSerializer(ProjectContactRawSerializer):

    country = CountrySerializer()


class ProjectContactSerializer(ProjectContactRawSerializer):

    type_label = serializers.ReadOnlyField(source='iati_type_unicode')
