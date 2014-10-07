# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.shortcuts import render, render_to_response
from akvo.rsr.forms import PasswordForm, ProfileForm, UserOrganisationForm
from akvo.rsr.models import Project


def myrsr(request):
    context = RequestContext(request)
    if request.is_ajax() and request.method == "POST":
        if 'email' in request.POST:
            profileForm = ProfileForm(data=request.POST)
            if profileForm.is_valid():
                profileForm.save(request)
                message = {'status': "success", 'message': "Your profile is updated"}
            elif profileForm.errors:
                message = {'status': "danger", 'message': [v for k, v in profileForm.errors.items()]}
        elif 'old_password' in request.POST:
            passwordForm = PasswordForm(data=request.POST, request=request)
            if passwordForm.is_valid():
                passwordForm.save(request)
                message = {'status': "success", 'message': "Updated your password"}
            elif passwordForm.errors:
                message = {'status': "danger", 'message': [v for k, v in passwordForm.errors.items()]}
        elif 'organisation' in request.POST:
            organisationForm = UserOrganisationForm(data=request.POST, request=request)
            if organisationForm.is_valid():
                organisationForm.save(request)
                message = {'status': "success", 'message': "You are now linked to organisation"}
            elif organisationForm.errors:
                message = {'status': "danger", 'message': [v for k, v in organisationForm.errors.items()]}

        return HttpResponse(json.dumps(message))

    profileForm = ProfileForm(
        initial={
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name
        }
    )
    organisationForm = UserOrganisationForm()

    return render_to_response(
        'myrsr/myrsr.html',
        {
            'profileform': profileForm,
            'organisationform': organisationForm,
            # 'message': message,
            # 'error_message': error_message
        },
        context_instance=context
    )

def password_change(request):
    context = RequestContext(request)
    if request.is_ajax() and request.method == "POST":
        form = PasswordForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            message = {'status': "success", 'message': ["Your password is updated."]}
        elif form.errors:
            message = {'status': "danger", 'message': [v for k, v in form.errors.items()]}
        return HttpResponse(json.dumps(message))
    else:
        form = PasswordForm(user=request.user)
    return render_to_response('myrsr/password_change.html', {'form': form}, context_instance=context)

@login_required
def my_updates(request):
    context = RequestContext(request)
    return render_to_response('myrsr/my_updates.html', context_instance=context)

@login_required
def my_projects(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'myrsr/my_projects.html', context)
