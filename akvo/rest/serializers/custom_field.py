# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import serializers

from akvo.rsr.models import OrganisationCustomField, ProjectCustomField
from .rsr_serializer import BaseRSRSerializer


class OrganisationCustomFieldSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = OrganisationCustomField


class ProjectCustomFieldSerializer(BaseRSRSerializer):

    class Meta:
        fields = '__all__'
        model = ProjectCustomField


class ProjectDirectoryProjectCustomFieldSerializer(BaseRSRSerializer):

    id = serializers.SerializerMethodField()

    class Meta:
        fields = ('id', 'name', 'dropdown_selection')
        model = ProjectCustomField

    def get_id(self, custom_field):
        try:
            return OrganisationCustomField.objects.get(name=custom_field.name).pk
        except OrganisationCustomField.DoesNotExist:
            return 0
