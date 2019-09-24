# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import RelatedProject, Project

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class RelatedProjectRawSerializer(BaseRSRSerializer):

    related_project = serializers.PrimaryKeyRelatedField(
        allow_null=True, queryset=Project.objects.all(), required=False, default=None)

    class Meta:
        model = RelatedProject
        fields = '__all__'


class RelatedProjectSerializer(RelatedProjectRawSerializer):

    related_project_name = serializers.ReadOnlyField(source='related_project.title')
    related_project_show_link = serializers.ReadOnlyField()
    relation_label = serializers.ReadOnlyField(source='iati_relation_unicode')
