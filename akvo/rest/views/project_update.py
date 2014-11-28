# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import cStringIO

from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from akvo.rsr.models import Project, ProjectUpdate

from ..serializers import BaseProjectUpdateSerializer, ProjectUpdateSerializer, ProjectUpdateExtraSerializer
from ..viewsets import BaseRSRViewSet


class ProjectUpdateViewSet(BaseRSRViewSet):
    """
    """
    queryset = ProjectUpdate.objects.all()
    serializer_class = ProjectUpdateSerializer

    def get_queryset(self):
        """ Allow simple filtering on selected fields
        """
        queryset = self.queryset
        uuid = self.request.QUERY_PARAMS.get('uuid', None)
        if uuid is not None:
            queryset = self.queryset.filter(uuid=uuid)
        return queryset


class ProjectUpdateExtraViewSet(BaseRSRViewSet):
    """
    """
    queryset = ProjectUpdate.objects.all()
    serializer_class = ProjectUpdateExtraSerializer

    def get_queryset(self):
        """ Allow simple filtering on selected fields
        """
        queryset = self.queryset
        project = self.request.QUERY_PARAMS.get('project', None)
        if project is not None:
            queryset = self.queryset.filter(project=project)
        uuid = self.request.QUERY_PARAMS.get('uuid', None)
        if uuid is not None:
            queryset = self.queryset.filter(uuid=uuid)
        return queryset


@api_view(['POST'])
@parser_classes((MultiPartParser, FormParser,))
@permission_classes((IsAuthenticated, ))
def add_update(request, pk=None):
    project = get_object_or_404(Project, pk=pk)

    # Check if user is allowed to post updates to this project
    if not request.user.has_perm('rsr.post_updates', project):
        raise PermissionDenied()

    request.DATA['project'] = pk
    request.DATA['user'] = request.user.pk

    serializer = BaseProjectUpdateSerializer(data=request.DATA, files=request.FILES)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
