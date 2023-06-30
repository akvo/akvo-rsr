# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework import serializers
from akvo.rsr.models import ProjectUpdateLocation
from ..fields import Base64ImageField
from .rsr_serializer import BaseRSRSerializer


class ProjectUpdateLocationSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = ProjectUpdateLocation


class ProjectUpdateLocationNestedSerializer(ProjectUpdateLocationSerializer):

    class Meta:
        model = ProjectUpdateLocation
        # Exclude the mandatory 'location_target' field, so that it is possible to create a
        # project update location at the same time as the project update.
        exclude = ('location_target',)


class ProjectUpdateLocationExtraSerializer(ProjectUpdateLocationSerializer):

    # Limit update data to its PK, this is needed because of Meta.depth = 2
    location_target = serializers.ReadOnlyField(source='location_target.pk')

    class Meta(ProjectUpdateLocationSerializer.Meta):
        depth = 2


class MapProjectUpdateSerializer(serializers.Serializer):

    """To serialize the update field of the update map resource."""

    id = serializers.IntegerField()
    title = serializers.CharField()
    photo = Base64ImageField(required=False, allow_empty_file=True, allow_null=True)
    video = serializers.CharField(required=False)


class MapProjectUpdateLocationSerializer(serializers.Serializer):

    """To serialize the update map resource."""

    id = serializers.IntegerField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    update = MapProjectUpdateSerializer(source='location_target')

    class Meta:
        fields = '__all__'
