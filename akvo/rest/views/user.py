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
from rest_framework.decorators import api_view
from rest_framework.decorators import authentication_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from akvo.rest.models import TastyTokenAuthentication
from ...rsr.models import Employment
from ...rsr.models import Organisation
from ..serializers import EmploymentSerializer
from ..serializers import OrganisationSerializer
from ..serializers import UserSerializer, UserDetailsSerializer, UserPasswordSerializer


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
    serializer = UserPasswordSerializer(data=request.data, instance=user)
    if serializer.is_valid():
        user = serializer.update(serializer.instance, serializer.validated_data)
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
    serializer = UserDetailsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.update(user, serializer.initial_data)
        return Response(request.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def request_organisation(request, pk=None):

    # Add missing keys to request.data to simplify code and getting working
    # with DRF-3 Serializer
    for key in ('group', 'country', 'job_title'):
        if key not in request.data:
            request.data[key] = ''

    # Get the user, or return an error if the user does not exist
    try:
        user_by_pk = get_user_model().objects.get(pk=pk)
    except get_user_model().DoesNotExist:
        return Response({'user': _('User does not exist')}, status=status.HTTP_400_BAD_REQUEST)

    # request.user is the user identified by the auth token
    user = request.user
    # Users themselves are only allowed to request to join an organisation
    if not user_by_pk == user:
        raise PermissionDenied()
    request.data['user'] = pk

    # Process request
    serializer = EmploymentSerializer(data=request.data)
    if serializer.is_valid():
        try:
            organisation = Organisation.objects.get(pk=serializer.data['organisation'])
            employment = Employment.objects.create(
                user=user,
                organisation=organisation,
                country=serializer.data['country'],
                job_title=serializer.data['job_title'],
                is_approved=False,
            )
        except IntegrityError:
            return Response({'detail': _(u'User already linked to this organisation')},
                            status=status.HTTP_409_CONFLICT)

        data = EmploymentSerializer(employment).data
        if data['country']:
            data['country_full'] = employment.iati_country().name
            data['country_name'] = unicode(employment.iati_country())
        else:
            data['country_full'] = ''
        data['organisation_full'] = OrganisationSerializer(organisation).data
        data['id'] = employment.pk

        return Response(data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def current_user(request):
    user = request.user

    if user.is_anonymous():
        raise PermissionDenied()

    queryset = get_user_model().objects.prefetch_related(
        'organisations',
        'organisations__primary_location',
        'organisations__primary_location__country',
        'organisations__primary_location__location_target',
    )
    instance = queryset.get(pk=user.pk)
    data = UserSerializer(instance).data
    return Response(data)
