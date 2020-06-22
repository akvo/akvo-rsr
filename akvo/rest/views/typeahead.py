# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rest.serializers import (TypeaheadOrganisationSerializer,
                                   TypeaheadProjectSerializer,
                                   TypeaheadProjectUpdateSerializer)
from akvo.rsr.models import Organisation, Project, ProjectUpdate
from akvo.rsr.views.project import _project_directory_coll


def rejig(queryset, serializer):
    """Rearrange & add queryset count to the response data."""
    return {
        'count': queryset.count(),
        'results': serializer.data
    }


@api_view(['GET'])
def typeahead_organisation(request):
    page = request.rsr_page
    if request.GET.get('partners', '0') == '1' and page:
        organisations = page.partners()
    else:
        # Project editor - all organizations
        organisations = Organisation.objects.all()

    organisations = organisations.values('id', 'name', 'long_name')

    return Response(
        rejig(organisations, TypeaheadOrganisationSerializer(organisations,
                                                             many=True))
    )


@api_view(['GET'])
def typeahead_user_organisations(request):
    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)
    if user.is_anonymous():
        organisations = Organisation.objects.none()
    elif is_admin:
        organisations = Organisation.objects.all()
    else:
        organisations = user.approved_organisations()
    return Response(
        rejig(organisations, TypeaheadOrganisationSerializer(organisations,
                                                             many=True))
    )


@api_view(['GET'])
def typeahead_project(request):
    """Return the typeaheads for projects.

    Without any query parameters, it returns the info for all the projects in
    the current context -- changes depending on whether we are on a partner
    site, or the RSR site.

    If a published query parameter is passed, only projects that have been
    published are returned.

    NOTE: The unauthenticated user gets information about all the projects when
    using this API endpoint.  More permission checking will need to be added,
    if the amount of data being returned is changed.

    """
    if request.GET.get('published', '0') == '0':
        # Project editor - organization projects, all
        page = request.rsr_page
        projects = page.all_projects() if page else Project.objects.all()
    else:
        # Search bar - organization projects, published
        projects = _project_directory_coll(request)

    projects = projects.exclude(title='')
    return Response(
        rejig(projects, TypeaheadProjectSerializer(projects, many=True))
    )


@api_view(['GET'])
def typeahead_projectupdate(request):
    page = request.rsr_page
    updates = page.updates() if page else ProjectUpdate.objects.all()
    return Response(
        rejig(updates, TypeaheadProjectUpdateSerializer(updates, many=True))
    )
