# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view
from rest_framework.decorators import authentication_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from akvo.rest.models import TastyTokenAuthentication
from ..viewsets import BaseRSRViewSet
from ..serializers import UserSerializer, UserDetailsSerializer, UserPasswordSerializer


class UserViewSet(BaseRSRViewSet):

    """User resource."""

    queryset = get_user_model().objects.prefetch_related(
        'organisations',
        'organisations__primary_location',
        'organisations__primary_location__country',
        'organisations__primary_location__location_target',
    )
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous():
            raise PermissionDenied()
        return super(UserViewSet, self).get_queryset()

    def list(self, request, *args, **kwargs):
        raise PermissionDenied()


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
    data = UserSerializer(instance, context={'request': request}).data
    return Response(data)
