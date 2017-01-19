# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.serializers import (TypeaheadCountrySerializer,
                                   TypeaheadOrganisationSerializer,
                                   TypeaheadProjectSerializer,
                                   TypeaheadProjectUpdateSerializer)

from akvo.codelists.models import Country, Version
from akvo.rsr.models import Organisation, Project, ProjectUpdate

from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response


def rejig(queryset, serializer):
    """Rearrange & add queryset count to the response data."""
    return {
        'count': queryset.count(),
        'results': serializer.data
    }


@api_view(['GET'])
def typeahead_country(request):
    iati_version = Version.objects.get(code=settings.IATI_VERSION)
    countries = Country.objects.filter(version=iati_version)
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
def typeahead_impact_projects(request):
    user = request.user
    projects = Project.objects.all() if user.is_admin or user.is_superuser else user.my_projects()
    projects = projects.published().filter(is_impact_project=True).order_by('title')

    return Response(
        rejig(projects, TypeaheadProjectSerializer(projects, many=True))
    )


@api_view(['GET'])
def typeahead_projectupdate(request):
    updates = ProjectUpdate.objects.all()
    return Response(
        rejig(updates, TypeaheadProjectUpdateSerializer(updates, many=True))
    )
