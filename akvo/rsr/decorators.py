# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""


from functools import wraps

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
from django.urls import reverse_lazy
from two_factor.utils import default_device

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


def with_download_indicator(view):
    """
    Read download indicator id from request query parameter and return it as
    response cookie which then used by frontend to close the download indicator.

    Request param:

        ?did=<unique string id>

    """
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        uid = request.GET.get('did', '').strip()
        response = view(request, *args, **kwargs)
        if uid and isinstance(response, HttpResponse):
            response.set_cookie(uid, True)
        return response

    return wrapper


def two_factor_required(view=None, login_url=None):
    """
    If a user has enforced_2fa attribute as True, the user should enable 2FA
    for accessing the page or user will be redirected to 2FA setup page.
    """
    if login_url is None:
        login_url = reverse_lazy('two_factor:setup')

    def test(user):
        if not user.is_authenticated:
            return True
        has_default_device = bool(default_device(user))
        if user.enforce_2fa and not has_default_device:
            return False
        return True

    decorator = user_passes_test(test, login_url=login_url)

    return decorator if (view is None) else decorator(view)
