# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import logging

from rest_framework import serializers

from akvo.rsr.models import ProjectUpdate
from akvo.rsr.models import ProjectUpdateLocation
from ..fields import Base64ImageField
from .project_update_location import (ProjectUpdateLocationNestedSerializer,
                                      ProjectUpdateLocationExtraSerializer)
from .rsr_serializer import BaseRSRSerializer
from .user import UserSerializer, UserRawSerializer
from akvo.utils import get_thumbnail

logger = logging.getLogger(__name__)


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


class ProjectUpdateDirectorySerializer(BaseRSRSerializer):
    """Serializer for project updates."""

    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    image = serializers.ReadOnlyField(source='photo')
    image = serializers.SerializerMethodField()
    url = serializers.ReadOnlyField(source='get_absolute_url')
    project = serializers.ReadOnlyField(source='project.title')
    project_url = serializers.ReadOnlyField(source='project.get_absolute_url')
    organisation = serializers.ReadOnlyField(source='project.primary_organisation.name')
    organisation_url = serializers.ReadOnlyField(
        source='project.primary_organisation.get_absolute_url'
    )
    user_fullname = serializers.ReadOnlyField(source='user.get_full_name')
    event_date = serializers.DateField(format='%d-%b-%Y')

    class Meta:
        model = ProjectUpdate
        fields = (
            'id',
            'title',
            'latitude',
            'longitude',
            'image',
            'url',
            'project',
            'project_url',
            'organisation',
            'organisation_url',
            'user_fullname',
            'event_date',
        )

    def get_latitude(self, update):
        return None if update.locations.count() == 0 else update.locations.all()[0].latitude

    def get_longitude(self, update):
        return None if update.locations.count() == 0 else update.locations.all()[0].longitude

    def get_image(self, update):
        width = '350'
        try:
            image = get_thumbnail(update.photo, width, crop='smart', quality=99)
            url = image.url
        except Exception as e:
            logger.error(
                'Failed to get thumbnail for image %s with error: %s', update.photo, e
            )
            url = update.photo.url if update.photo.name else ''
        return url


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
