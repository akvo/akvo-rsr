# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework import serializers
from akvo.rsr.models import ProjectLocation, AdministrativeLocation
from ..fields import Base64ImageField
from .country import CountrySerializer
from .rsr_serializer import BaseRSRSerializer


class ProjectLocationSerializer(BaseRSRSerializer):

    class Meta:
        model = ProjectLocation


class AdministrativeLocationSerializer(BaseRSRSerializer):

    class Meta:
        model = AdministrativeLocation


class ProjectLocationExtraSerializer(ProjectLocationSerializer):

    class Meta(ProjectLocationSerializer.Meta):
        depth = 2


class MapProjectSerializer(serializers.Serializer):

    """To serialize the project field of the project map resource."""

    id = serializers.IntegerField()
    title = serializers.CharField()
    url = serializers.URLField(source='get_absolute_url')
    current_image = Base64ImageField(required=False, allow_empty_file=True)


class MapProjectLocationSerializer(serializers.Serializer):

    """To serialize the project map resource."""

    id = serializers.IntegerField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    project = MapProjectSerializer(source='location_target')
    country = CountrySerializer()
