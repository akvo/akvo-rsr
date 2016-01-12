# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...rsr.models import Country, Employment, Organisation
from ..viewsets import BaseRSRViewSet
from ..serializers import EmploymentSerializer, OrganisationSerializer, CountrySerializer
from ..serializers import UserSerializer, UserDetailsSerializer, UserPasswordSerializer


class UserViewSet(BaseRSRViewSet):

    """User resource."""

    queryset = get_user_model().objects.select_related(
        'organisation',
        'organisation__primary_location',
        'organisation__primary_location__country',
        'organisation__primary_location__location_target',
        'organisation__primary_location__location_target__internal_org_ids',
    ).prefetch_related(
        'organisations',
        'organisations__primary_location',
        'organisations__primary_location__country',
        'organisations__primary_location__location_target',)
    serializer_class = UserSerializer
    filter_fields = ('username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff',
                     'is_admin')


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def change_password(request, pk=None):
    user = get_user_model().objects.get(pk=pk)
    # Users are only allowed to change their own password
    if not user == request.user:
        raise PermissionDenied()
    serializer = UserPasswordSerializer(data=request.DATA, instance=user)
    if serializer.is_valid():
        user.set_password(serializer.data['new_password2'])
        user.save()
        return Response({'status': 'password set'})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def update_details(request, pk=None):
    user = get_user_model().objects.get(pk=pk)
    # Users are only allowed to edit their own details
    if not user == request.user:
        raise PermissionDenied()
    serializer = UserDetailsSerializer(data=request.DATA, instance=user)
    if serializer.is_valid():
        user.first_name = serializer.data['first_name']
        user.last_name = serializer.data['last_name']
        user.save()
        return Response(request.DATA)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def request_organisation(request, pk=None):
    user = get_user_model().objects.get(pk=pk)
    # Users themselves are only allowed to request to join an organisation
    if not user == request.user:
        raise PermissionDenied()
    request.DATA['user'] = pk
    serializer = EmploymentSerializer(data=request.DATA)
    if serializer.is_valid():
        try:
            organisation = Organisation.objects.get(pk=serializer.data['organisation'])
            country = Country.objects.get(pk=serializer.data['country']) if serializer.data['country'] else None
            employment = Employment(
                user=user,
                organisation=organisation,
                country=country,
                job_title=serializer.data['job_title'],
                is_approved=False,
            )
            employment.save()
        except IntegrityError:
            return Response({'detail': _(u'User already linked to this organisation')},
                            status=status.HTTP_409_CONFLICT)

        serializer.data['country_full'] = CountrySerializer(country).data
        serializer.data['organisation_full'] = OrganisationSerializer(organisation).data
        serializer.data['id'] = employment.pk

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
