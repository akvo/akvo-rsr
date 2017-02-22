# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework import serializers
from akvo.rsr.models import ProjectUpdate
from akvo.rsr.models import ProjectUpdateLocation
from ..fields import Base64ImageField
from .project_update_location import (ProjectUpdateLocationNestedSerializer,
                                      ProjectUpdateLocationExtraSerializer)
from .rsr_serializer import BaseRSRSerializer
from .user import UserSerializer, UserRawSerializer


class ProjectUpdateSerializer(BaseRSRSerializer):

    """Serializer for project updates."""

    locations = ProjectUpdateLocationNestedSerializer(many=True, required=False)
    photo = Base64ImageField(required=False, allow_empty_file=True, allow_null=True)
    video = serializers.URLField(required=False, allow_null=True)

    # Allow null values for {photo,video}_{caption,credit} for UP app
    photo_caption = serializers.CharField(required=False, allow_null=True)
    photo_credit = serializers.CharField(required=False, allow_null=True)
    video_caption = serializers.CharField(required=False, allow_null=True)
    video_credit = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = ProjectUpdate

    def create(self, validated_data):
        locations_data = validated_data.pop('locations', [])

        # Remove {photo,video}_{caption,credit} if they are None (happens, for
        # instance, when these values are not filled in the UP app)
        for key in ('photo_credit', 'photo_caption', 'video_credit', 'video_caption'):
            if key in validated_data and validated_data[key] is None:
                validated_data.pop(key)
        update = ProjectUpdate.objects.create(**validated_data)

        for location_data in locations_data:
            ProjectUpdateLocation.objects.create(location_target=update, **location_data)

        return update


class ProjectUpdateDeepSerializer(ProjectUpdateSerializer):
    """Deep serializer for project updates."""

    user = UserRawSerializer()


class ProjectUpdateExtraSerializer(BaseRSRSerializer):

    """This serializer includes data about user and connected organisation."""

    photo = Base64ImageField(required=False, allow_empty_file=True, allow_null=True)
    primary_location = ProjectUpdateLocationExtraSerializer()
    # Limit project data to its PK, this is needed because of Meta.depth = 2
    project = serializers.ReadOnlyField(source='project.pk')
    user = UserSerializer()

    class Meta:
        model = ProjectUpdate
        depth = 2
