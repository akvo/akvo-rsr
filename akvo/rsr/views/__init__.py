# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse


def index(request):
    """Redirect user to project directory or My RSR."""

    return HttpResponseRedirect(reverse('project-directory', args=[]))


def lockpass(request):
    """Endpoint to make the password-protected partner site useable for users.

    This is a hack that utilizes the Django-lockdown mechanism to prompt the password page
    for password-protected partner sites.

    See: akvo.rsr.middleware.RSRLockdownMiddleware
    """

    next_page = request.GET.get("next")
    return HttpResponseRedirect(
        next_page if next_page else reverse("project-directory", args=[])
    )


def maintenance(request):
    response = render(request, '503.html', context={})
    response.status_code = 503
    return response
