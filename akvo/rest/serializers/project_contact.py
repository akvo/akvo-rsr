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


class ProjectContactRawDeepSerializer(ProjectContactRawSerializer):

    country = CountrySerializer(source='country')


class ProjectContactSerializer(ProjectContactRawSerializer):

    type_label = serializers.Field(source='iati_type')
