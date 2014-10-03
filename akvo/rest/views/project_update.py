# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectUpdate

from ..serializers import ProjectUpdateSerializer, ProjectUpdateExtraSerializer
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
        created_at = self.request.QUERY_PARAMS.get('created_at__gt', None)
        if created_at is not None:
            queryset = self.queryset.filter(created_at__gt=created_at)
        last_modified_at = self.request.QUERY_PARAMS.get('last_modified_at__gt', None)
        if last_modified_at is not None:
            queryset = self.queryset.filter(last_modified_at__gt=last_modified_at)
        return queryset