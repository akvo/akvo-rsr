# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import filters
from rest_framework import status
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
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('user', 'organisation',)

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def approve_employment(request, pk=None):
    employment = Employment.objects.get(pk=pk)
    user = request.user

    # Only superusers, staff members, editors and Organisation admins are allowed to approve a user
    if not (user.is_superuser or user.is_staff or user.get_is_rsr_admin() or user.get_is_org_admin()):
        raise PermissionDenied
    if user.get_is_org_admin() and not employment.organisation in user.organisations:
        raise PermissionDenied

    employment.is_approved = True
    employment.save()

    return Response({'status': 'employment approved'})
