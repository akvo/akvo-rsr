# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from functools import wraps

from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.shortcuts import get_object_or_404

from akvo.rsr.models import Project


def fetch_project(view):
    """
    Retrieve a specific project object from the project_id captured in the URL
    and passes it directly to the view as 'p'.

    Usage:

    @fetch_project
    def view(request, p):
        ...

    """
    @wraps(view)
    def wrapper(request, project_id, *args, **kwargs):
        p = get_object_or_404(Project, id=int(project_id))
        return view(request, p=p, *args, **kwargs)
    return wrapper


def project_page(view):
    """
    Work as @fetch_project with additional logic for draft capability.
    - Published projects can be seen by anyone.
    - A user can see own unpublished projects in "draft" state (a red banner
        on the top)
    - A signed in user gets a 403 on non published projects
    - Any non user will get a 404 on non publised projects
    ...
    """
    @wraps(view)
    def wrapper(request, project_id, *args, **kwargs):
        project = get_object_or_404(Project, id=int(project_id))
        privileged_user = project.connected_to_user(request.user)
        unprivileged_user = not privileged_user
        authenticated_user = request.user.is_authenticated()
        unpublished_project = not project.is_published()
        request.draft = False
        request.privileged_user = privileged_user

        # Enable draft preview for privileged users, additional logic in
        # the draft section of project pages templates
        if unpublished_project and authenticated_user and unprivileged_user:
            raise PermissionDenied
        if unpublished_project and unprivileged_user:
            raise Http404
        if unpublished_project and privileged_user:
            request.draft = True

        return view(request, project=project, *args, **kwargs)
    return wrapper
