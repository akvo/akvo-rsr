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


class ProjectLocationRawSerializer(BaseRSRSerializer):

    class Meta:
        model = ProjectLocation


class ProjectLocationSerializer(ProjectLocationRawSerializer):

    country_label = serializers.ReadOnlyField(source='country_label')
    vocabulary_label = serializers.ReadOnlyField(source='iati_vocabulary')
    exactness_label = serializers.ReadOnlyField(source='iati_exactness')
    reach_label = serializers.ReadOnlyField(source='iati_reach')
    class_label = serializers.ReadOnlyField(source='iati_class')
    feature_designation_label = serializers.ReadOnlyField(source='iati_designation')


class AdministrativeLocationSerializer(BaseRSRSerializer):

    location_unicode = serializers.ReadOnlyField(source='location')
    vocabulary_label = serializers.ReadOnlyField(source='iati_vocabulary')

    class Meta:
        model = AdministrativeLocation


class ProjectLocationExtraSerializer(ProjectLocationRawSerializer):

    country = CountrySerializer(source='country')


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
