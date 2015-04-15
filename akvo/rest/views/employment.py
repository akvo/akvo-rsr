# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth.models import Group

from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from akvo.rsr.models import Employment

from ..serializers import EmploymentSerializer
from ..viewsets import BaseRSRViewSet


class EmploymentViewSet(BaseRSRViewSet):
    """
    """
    queryset = Employment.objects.all()
    serializer_class = EmploymentSerializer
    filter_fields = ('user', 'organisation', 'group', 'is_approved', )

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def approve_employment(request, pk=None):
    employment = Employment.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_employment', employment):
        raise PermissionDenied

    employment.approve(user)

    return Response({'status': 'employment approved'})

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def set_group(request, pk=None, group_id=None):
    employment = Employment.objects.get(pk=pk)
    group = Group.objects.get(pk=group_id)
    user = request.user

    if not user.has_perm('rsr.change_employment', employment):
        raise PermissionDenied

    employment.group = group
    employment.save()

    return Response({'status': 'group set'})
