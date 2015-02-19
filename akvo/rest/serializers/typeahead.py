# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework import serializers
# from akvo.codelists.models import SectorCategory
from akvo.rsr.models import Country, Organisation, Project, ProjectUpdate


class TypeaheadCountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = (
            'id',
            'name',
            'iso_code',
            'continent_code',
        )


class TypeaheadOrganisationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organisation
        fields = (
            'id',
            'name',
            'long_name',
        )


class TypeaheadProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = (
            'id',
            'project_plan_summary',
            'subtitle',
            'title',
        )


class TypeaheadProjectUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectUpdate
        fields = (
            'id',
            'project',
            'title'
        )

# class TypeaheadSectorSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Project
#         depth = 1
#         fields = (
#             'id',
#             'sectors',
#         )
#         # fields = (
#         #     'id',
#         #     # 'categories',
#         #     'name',
#         # )
