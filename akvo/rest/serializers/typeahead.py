# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework import serializers

from akvo.codelists.models import Country
from akvo.codelists.store.default_codelists import SECTOR_CATEGORY
from akvo.rsr.models import Keyword, Organisation, Project, ProjectUpdate, Sector
from akvo.utils import codelist_choices


class TypeaheadCountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = ('code', 'name')


class TypeaheadOrganisationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organisation
        fields = ('id', 'name', 'long_name')


class TypeaheadProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ('id', 'title', 'subtitle')


class TypeaheadProjectUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectUpdate
        fields = ('id', 'project', 'title')


class TypeaheadKeywordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Keyword
        fields = ('id', 'label')


class TypeaheadSectorSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    # Lookup attribute for sector names. Not a serialized attribute.
    sectors = dict(codelist_choices(SECTOR_CATEGORY, show_code=False))

    def get_id(self, obj):
        return obj['sector_code']

    def get_name(self, obj):
        return self.sectors[obj['sector_code']]

    class Meta:
        model = Sector
        fields = ('id', 'name')
