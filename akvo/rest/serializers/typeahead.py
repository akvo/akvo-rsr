# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Keyword, Organisation, Project, ProjectUpdate
from akvo.codelists.models import Country

from rest_framework import serializers


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
