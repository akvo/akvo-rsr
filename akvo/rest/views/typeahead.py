# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rest.serializers import (TypeaheadCountrySerializer,
                                   TypeaheadOrganisationSerializer,
                                   TypeaheadProjectSerializer,
                                   TypeaheadProjectUpdateSerializer)
# from akvo.codelists.models import SectorCategory
from akvo.rsr.models import Country, Organisation, Project, ProjectUpdate


def rejig(queryset, serializer):
    """Rearrange & add queryset count to the response data."""
    return {
        'count': queryset.count(),
        'results': serializer.data
    }


@api_view(['GET'])
def typeahead_country(request):
    countries = Country.objects.all()
    return Response(
        rejig(countries, TypeaheadCountrySerializer(countries, many=True))
    )


@api_view(['GET'])
def typeahead_organisation(request):
    organisations = Organisation.objects.all()
    return Response(
        rejig(organisations, TypeaheadOrganisationSerializer(organisations,
                                                             many=True))
    )

@api_view(['GET'])
def typeahead_reporting_organisation(request):
    organisations = Organisation.objects.filter(can_become_reporting=True)
    return Response(
        rejig(organisations, TypeaheadOrganisationSerializer(organisations,
                                                             many=True))
    )

@api_view(['GET'])
def typeahead_project(request):
    projects = Project.objects.all().exclude(title='')
    return Response(
        rejig(projects, TypeaheadProjectSerializer(projects, many=True))
    )


@api_view(['GET'])
def typeahead_projectupdate(request):
    updates = ProjectUpdate.objects.all()
    return Response(
        rejig(updates, TypeaheadProjectUpdateSerializer(updates, many=True))
    )


# @api_view(['GET'])
# def typeahead_sector(request):
#     """
#     """

#     sectors = Sector.objects.all()

#     return Response(
#         rejig(sectors, TypeaheadSectorSerializer(sectors, many=True))
#     )


# @api_view(['GET'])
# def typeahead_sector(request):
#     """
#     """
#     sectors = SectorCategory.objects.all()
#     return Response(
#         rejig(sectors, TypeaheadSectorSerializer(sectors, many=True))
#     )
