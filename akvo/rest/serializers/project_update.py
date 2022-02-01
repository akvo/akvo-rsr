# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import logging

from rest_framework import serializers

from akvo.rsr.models import ProjectUpdate, ProjectUpdateLocation, ProjectUpdatePhoto
from ..fields import Base64ImageField
from .project_update_location import (ProjectUpdateLocationNestedSerializer,
                                      ProjectUpdateLocationExtraSerializer)
from .rsr_serializer import BaseRSRSerializer
from .user import UserSerializer, UserRawSerializer
from akvo.utils import get_thumbnail
from akvo.rest.serializers.user import UserDetailsSerializer

logger = logging.getLogger(__name__)


class ProjectUpdatePhotoSerializer(BaseRSRSerializer):
    class Meta:
        model = ProjectUpdatePhoto
        fields = '__all__'


class ProjectUpdateSerializer(BaseRSRSerializer):
    """Serializer for project updates."""

    locations = ProjectUpdateLocationNestedSerializer(many=True, required=False)
    # NOTE: These fields have been added to allow POST requests using multipart
    # form data DRF doesn't allow nested POSTs when many=True, but for project
    # updates adding a single location is good enough.
    # See https://github.com/encode/django-rest-framework/issues/7262
    # NOTE: The data passed in this field is only used when locations has not
    # valid data.
    latitude = serializers.FloatField(required=False, source='primary_location.latitude')
    longitude = serializers.FloatField(required=False, source='primary_location.longitude')
    photo = Base64ImageField(required=False, allow_empty_file=True, allow_null=True)
    video = serializers.URLField(required=False, allow_blank=True,)
    editable = serializers.SerializerMethodField()
    deletable = serializers.SerializerMethodField()
    edited = serializers.ReadOnlyField()
    photos = ProjectUpdatePhotoSerializer(many=True, read_only=True)
    user_details = UserDetailsSerializer(read_only=True, source='user')

    class Meta:
        model = ProjectUpdate
        fields = '__all__'
        # Allow null values for {photo,video}_{caption,credit} for UP app
        extra_kwargs = {
            'photo_caption': {'required': False, 'allow_null': True},
            'photo_credit': {'required': False, 'allow_null': True},
            'video_caption': {'required': False, 'allow_null': True},
            'video_credit': {'required': False, 'allow_null': True},
        }
        read_only_fields = ['user']

    def create(self, validated_data):
        locations_data = validated_data.pop('locations', [])
        if not locations_data:
            location = validated_data.pop('primary_location', None)
            if location:
                locations_data = [location]

        # Remove {photo,video}_{caption,credit} if they are None (happens, for
        # instance, when these values are not filled in the UP app)
        for key in ('photo_credit', 'photo_caption', 'video_credit', 'video_caption'):
            if key in validated_data and validated_data[key] is None:
                validated_data.pop(key)

        update = ProjectUpdate.objects.create(**validated_data)

        for location_data in locations_data:
            ProjectUpdateLocation.objects.create(location_target=update, **location_data)

        return update

    def get_editable(self, obj):
        """Method used by the editable SerializerMethodField"""
        user = self.context['request'].user
        return user.has_perm('rsr.change_projectupdate', obj)

    def get_deletable(self, obj):
        """Method used by the deletable SerializerMethodField"""
        user = self.context['request'].user
        return user.has_perm('rsr.delete_projectupdate', obj)


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
        fields = '__all__'
        model = ProjectUpdate
        depth = 2
