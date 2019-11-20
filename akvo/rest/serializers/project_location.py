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
        fields = '__all__'


class AdministrativeLocationSerializer(BaseRSRSerializer):

    location_unicode = serializers.ReadOnlyField(source='location.__unicode__')
    vocabulary_label = serializers.ReadOnlyField(source='iati_vocabulary_unicode')

    class Meta:
        model = AdministrativeLocation
        fields = '__all__'


class ProjectLocationSerializer(ProjectLocationRawSerializer):

    country_label = serializers.ReadOnlyField(source='iati_country_unicode')
    vocabulary_label = serializers.ReadOnlyField(source='iati_vocabulary_unicode')
    exactness_label = serializers.ReadOnlyField(source='iati_exactness_unicode')
    reach_label = serializers.ReadOnlyField(source='iati_reach_unicode')
    class_label = serializers.ReadOnlyField(source='iati_class_unicode')
    feature_designation_label = serializers.ReadOnlyField(source='iati_designation_unicode')
    administratives = AdministrativeLocationSerializer(many=True, read_only=True)


class ProjectLocationExtraSerializer(ProjectLocationRawSerializer):

    country = CountrySerializer()


class MapProjectSerializer(serializers.Serializer):

    """To serialize the project field of the project map resource."""

    id = serializers.IntegerField()
    title = serializers.CharField()
    url = serializers.URLField(source='get_absolute_url')
    current_image = Base64ImageField(required=False, allow_empty_file=True, allow_null=True)


class MapProjectLocationSerializer(serializers.Serializer):

    """To serialize the project map resource."""

    id = serializers.IntegerField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    project = MapProjectSerializer(source='location_target')
    country = CountrySerializer()

    class Meta:
        fields = '__all__'


class ProjectLocationCountryNameSerializer(serializers.Serializer):

    country = serializers.StringRelatedField(read_only=True)
    iso_code = serializers.StringRelatedField(source='country.iso_code', read_only=True)

    class Meta:
        fields = ('country', 'iso_code')
