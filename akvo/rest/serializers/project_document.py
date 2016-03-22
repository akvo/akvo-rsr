# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectDocument, ProjectDocumentCategory

from .rsr_serializer import BaseRSRSerializer

from rest_framework import serializers


class ProjectDocumentSerializer(BaseRSRSerializer):

    language_label = serializers.Field(source='iati_language')
    title_language_label = serializers.Field(source='iati_title_language')
    format_label = serializers.Field(source='iati_format')

    class Meta:
        model = ProjectDocument


class ProjectDocumentCategorySerializer(BaseRSRSerializer):

    category_label = serializers.Field(source='iati_category')

    class Meta:
        model = ProjectDocumentCategory
