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
def typeahead_user_organisations(request):
    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)
    organisations = user.approved_organisations() if not is_admin else Organisation.objects.all()
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
def typeahead_user_projects(request):
    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)
    if is_admin:
        projects = Project.objects.all()
    else:
        projects = user.approved_organisations().all_projects()
    projects = projects.exclude(title='')
    return Response(
        rejig(projects, TypeaheadProjectSerializer(projects, many=True))
    )


@api_view(['GET'])
def typeahead_projectupdate(request):
    updates = ProjectUpdate.objects.all()
    return Response(
        rejig(updates, TypeaheadProjectUpdateSerializer(updates, many=True))
    )
