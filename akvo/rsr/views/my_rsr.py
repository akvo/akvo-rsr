# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from ..forms import PasswordForm, ProfileForm, UserOrganisationForm
from ...utils import pagination

from django.contrib.auth.decorators import login_required, permission_required
from django.core.exceptions import PermissionDenied
from django.shortcuts import render, render_to_response
from django.template import RequestContext


@login_required
def my_details(request):
    profile_form = ProfileForm(
        initial={
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name
        }
    )
    organisation_form = UserOrganisationForm()

    json_data = json.dumps({'user': request.user.employments_dict([])})

    context = {
        'user_data': json_data,
        'profileform': profile_form,
        'organisationform': organisation_form,
    }

    return render(request, 'myrsr/my_details.html', context)


@login_required
def password_change(request):
    context = RequestContext(request)
    form = PasswordForm(request.user)
    return render_to_response('myrsr/password_change.html', {'form': form}, context_instance=context)


@login_required
def my_updates(request):
    updates = request.user.updates()
    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, updates, 10)

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
    }

    return render(request, 'myrsr/my_updates.html', context)


@login_required
def my_projects(request):
    projects = request.user.organisations.all_projects().distinct()
    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, projects, 10)

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
    }

    return render(request, 'myrsr/my_projects.html', context)

@login_required
def user_management(request):
    user = request.user
    if not (user.is_superuser or user.is_staff or user.get_is_rsr_admin() or user.get_is_org_admin()):
        raise PermissionDenied

    organisations = user.approved_organisations()
    users = organisations.users().exclude(pk=user.pk)

    users_array = []
    for user in users:
        user_obj = user.employments_dict(organisations)
        users_array.append(user_obj)
    json_data = json.dumps({'users': users_array})

    context = {
        'user_data': json_data,
    }
    return render(request, 'myrsr/user_management.html', context)