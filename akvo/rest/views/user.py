# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.decorators import action, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import UserPasswordSerializer, UserSerializer
from ..viewsets import BaseRSRViewSet


class UserViewSet(BaseRSRViewSet):
    """
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    @action()
    @permission_classes((IsAuthenticated, ))
    def change_password(self, request, pk=None):
        user = self.get_object()
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
