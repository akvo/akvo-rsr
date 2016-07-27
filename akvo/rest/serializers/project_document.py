# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectDocument, ProjectDocumentCategory

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class ProjectDocumentRawSerializer(BaseRSRSerializer):

    class Meta:
        model = ProjectDocument


class ProjectDocumentSerializer(ProjectDocumentRawSerializer):

    document_show_link = serializers.ReadOnlyField(source='document_show_link')
    language_label = serializers.ReadOnlyField(source='iati_language')
    title_language_label = serializers.ReadOnlyField(source='iati_title_language')
    format_label = serializers.ReadOnlyField(source='iati_format')


class ProjectDocumentCategorySerializer(BaseRSRSerializer):

    document_unicode = serializers.ReadOnlyField(source='document')
    category_label = serializers.ReadOnlyField(source='iati_category')

    class Meta:
        model = ProjectDocumentCategory
