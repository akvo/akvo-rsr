# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from akvo.rest.models import TastyTokenAuthentication
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

    # def get_serializer(self, instance=None, data=None,
    #                    files=None, many=False, partial=False):
    #
    #     """
    #     Return the serializer instance that should be used for validating and
    #     deserializing input, and for serializing output.
    #     """
    #
    #     ### DEBUG ###
    #     import pdb
    #     pdb.set_trace()
    #     ### DEBUG ###
    #
    #     serializer_class = self.get_serializer_class()
    #     context = self.get_serializer_context()
    #     return serializer_class(instance, data=data, files=files,
    #                             many=many, partial=partial, context=context)


@api_view(['POST'])
def change_password(request, pk=None):
    # Get the user, or return an error if the user does not exist
    try:
        user = get_user_model().objects.get(pk=pk)
    except get_user_model().DoesNotExist:
        return Response({'user': _('User does not exist')}, status=status.HTTP_400_BAD_REQUEST)

    # Users are only allowed to edit their own details
    request_user = getattr(request, 'user', None)
    if not user == request_user:
        raise PermissionDenied()

    # Process request
    serializer = UserPasswordSerializer(data=request.DATA, instance=user)
    if serializer.is_valid():
        user.set_password(serializer.data['new_password2'])
        user.save()
        return Response({'status': 'password set'})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def update_details(request, pk=None):
    # Get the user, or return an error if the user does not exist
    try:
        user = get_user_model().objects.get(pk=pk)
    except get_user_model().DoesNotExist:
        return Response({'user': _('User does not exist')}, status=status.HTTP_400_BAD_REQUEST)

    # Users are only allowed to edit their own details
    request_user = getattr(request, 'user', None)
    if not user == request_user:
        raise PermissionDenied()

    # Process request
    serializer = UserDetailsSerializer(data=request.DATA, instance=user)
    if serializer.is_valid():
        user.first_name = serializer.data['first_name']
        user.last_name = serializer.data['last_name']
        user.save()
        return Response(request.DATA)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def request_organisation(request, pk=None):

    # Get the user, or return an error if the user does not exist
    try:
        user_by_pk = get_user_model().objects.get(pk=pk)
    except get_user_model().DoesNotExist:
        return Response({'user': _('User does not exist')}, status=status.HTTP_400_BAD_REQUEST)

    # request.user is the user identified by the auth token
    user = request.user
    # Users themselves are only allowed to request to join an organisation
    if not user_by_pk == request.user:
        raise PermissionDenied()
    request.DATA['user'] = pk

    # Process request
    serializer = EmploymentSerializer(data=request.DATA)
    if serializer.is_valid():
        try:
            organisation = Organisation.objects.get(pk=serializer.data['organisation'])
            employment = Employment(
                user=user,
                organisation=organisation,
                country=serializer.data['country'],
                job_title=serializer.data['job_title'],
                is_approved=False,
            )
            employment.save()
        except IntegrityError:
            return Response({'detail': _(u'User already linked to this organisation')},
                            status=status.HTTP_409_CONFLICT)

        if serializer.data['country']:
            serializer.data['country_full'] = employment.iati_country().name
        else:
            serializer.data['country_full'] = ''
        serializer.data['organisation_full'] = OrganisationSerializer(organisation).data
        serializer.data['id'] = employment.pk

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
