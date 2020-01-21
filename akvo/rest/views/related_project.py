# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework.response import Response
from rest_framework import status


from akvo.rsr.models import RelatedProject
from akvo.rsr.models.related_project import ParentChangeDisallowed
from ..serializers import RelatedProjectSerializer
from ..viewsets import PublicProjectViewSet


class RelatedProjectViewSet(PublicProjectViewSet):
    """
    """
    queryset = RelatedProject.objects.all()
    serializer_class = RelatedProjectSerializer

    def update(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ParentChangeDisallowed as e:
            return Response(str(e), status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ParentChangeDisallowed as e:
            return Response(str(e), status=status.HTTP_405_METHOD_NOT_ALLOWED)
