# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers.indicator import IndicatorFrameworkSerializer, IndicatorFrameworkLiteSerializer, IndicatorFrameworkNotSoLiteSerializer
from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import Project, Result

from rest_framework import serializers


class ResultRawSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = Result


class ResultSerializer(ResultRawSerializer):

    project_title = serializers.ReadOnlyField(source='project.title')
    type_label = serializers.ReadOnlyField(source='iati_type_unicode')
    # TODO: remove the two following fields, they're performance hogs!
    parent_project = serializers.ReadOnlyField()
    child_projects = serializers.ReadOnlyField()


class ResultsFrameworkSerializer(ResultRawSerializer):

    indicators = IndicatorFrameworkSerializer(many=True, read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    project_title = serializers.ReadOnlyField(source='project.title')
    parent_project = serializers.ReadOnlyField()
    child_projects = serializers.ReadOnlyField()


class ResultSerializerV2(ResultRawSerializer):

    project_title = serializers.ReadOnlyField(source='project.title')


class ResultsFrameworkLiteSerializer(ResultRawSerializer):

    indicators = IndicatorFrameworkLiteSerializer(many=True, read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    project_title = serializers.ReadOnlyField(source='project.title')
    parent_project = serializers.ReadOnlyField()
    child_projects = serializers.ReadOnlyField()


class ResultFrameworkNotSoLiteSerializer(ResultRawSerializer):

    indicators = IndicatorFrameworkNotSoLiteSerializer(many=True, read_only=True)
    project = serializers.PrimaryKeyRelatedField(read_only=True)
    project_title = serializers.ReadOnlyField(source='project.title')
    parent_project = serializers.ReadOnlyField()
    child_projects = serializers.ReadOnlyField()
