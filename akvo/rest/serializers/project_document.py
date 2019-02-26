# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectDocument, ProjectDocumentCategory

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class ProjectDocumentRawSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = ProjectDocument


class ProjectDocumentSerializer(ProjectDocumentRawSerializer):

    document_show_link = serializers.ReadOnlyField()
    language_label = serializers.ReadOnlyField(source='iati_language_unicode')
    title_language_label = serializers.ReadOnlyField(source='iati_title_language_unicode')
    format_label = serializers.ReadOnlyField(source='iati_format_unicode')


class ProjectDocumentCategorySerializer(BaseRSRSerializer):

    document_unicode = serializers.ReadOnlyField(source='document.__unicode__')
    category_label = serializers.ReadOnlyField(source='iati_category_unicode')

    class Meta:
        fields = '__all__'
        model = ProjectDocumentCategory
