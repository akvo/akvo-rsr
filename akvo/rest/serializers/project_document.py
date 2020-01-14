# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectDocument, ProjectDocumentCategory

from rest_framework import serializers

from .rsr_serializer import BaseRSRSerializer


class ProjectDocumentRawSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = ProjectDocument


class CategoryListingField(serializers.RelatedField):

    def to_representation(self, category):
        return category.category

    def to_internal_value(self, data):
        return data


class ProjectDocumentSerializer(ProjectDocumentRawSerializer):

    document_show_link = serializers.ReadOnlyField()
    language_label = serializers.ReadOnlyField(source='iati_language_unicode')
    title_language_label = serializers.ReadOnlyField(source='iati_title_language_unicode')
    format_label = serializers.ReadOnlyField(source='iati_format_unicode')
    categories = CategoryListingField(
        many=True, required=False, queryset=ProjectDocumentCategory.objects.all())

    def create(self, validated_data):
        categories = validated_data.pop('categories', [])
        document = super(ProjectDocumentSerializer, self).create(validated_data)
        for category in categories:
            ProjectDocumentCategory.objects.create(category=category, document=document)
        return document

    def update(self, document, validated_data):
        categories = validated_data.pop('categories', [])
        instance = super(ProjectDocumentSerializer, self).update(document, validated_data)
        instance.categories.all().delete()
        categories = [
            ProjectDocumentCategory(category=category, document=document)
            for category in categories
        ]
        ProjectDocumentCategory.objects.bulk_create(categories)
        return document


class ProjectDocumentCategorySerializer(BaseRSRSerializer):

    document_unicode = serializers.ReadOnlyField(source='document.__str__')
    category_label = serializers.ReadOnlyField(source='iati_category_unicode')

    class Meta:
        fields = '__all__'
        model = ProjectDocumentCategory
