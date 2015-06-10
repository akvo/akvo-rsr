# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project

from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step1(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        # TODO: Return proper 403
        raise PermissionDenied

    data = request.POST

    # Title
    title = data.get('projectTitle', '')
    project.title = title
    project.save(update_fields=["title"])

    return Response({'status': 'title updated'})
