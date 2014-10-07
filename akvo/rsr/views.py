# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import re
import json

from django.contrib.auth import login, logout
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext

from registration.models import RegistrationProfile
from registration.signals import user_activated

from .forms import PasswordForm, ProfileForm, RegisterForm, UserOrganisationForm

from akvo.rsr.models import Project, User


def index(request):
    return HttpResponseRedirect('register')


def register(request):
    context = RequestContext(request)
    if request.method == 'POST':
        form = RegisterForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            user = form.save(request)
            return render_to_response('registration/register_complete.html', {'new_user': user}, context_instance=context)
    else:
        form = RegisterForm()
    return render_to_response('registration/register.html', {'form': form}, context_instance=context)


def activate(request, activation_key, extra_context=None):
    """
    Activate a User's account, if their key is valid and hasn't expired.

    Any values passed in the keyword argument "extra_context" (which must be a dictionary) will be added to the context.
    Any values in "extra_context" which are callable will be called prior to being added to the context.
    """
    sha = re.compile('^[a-f0-9]{40}$')
    activation_key = activation_key.lower()

    if sha.search(activation_key):
        try:
            registration_profile = RegistrationProfile.objects.get(activation_key=activation_key)
        except RegistrationProfile.DoesNotExist:
            user = False
        else:
            user = registration_profile.user
            if not registration_profile.activation_key_expired():
                registration_profile.activation_key = RegistrationProfile.ACTIVATED
                registration_profile.save()
                user.is_active = True
                user.save()
                # user_activated.send(sender=RegistrationProfile, user=user)
    if extra_context is None:
        extra_context = {}
    context = RequestContext(request)
    for key, value in extra_context.items():
        context[key] = callable(value) and value() or value
    return render_to_response(
        'registration/activate.html',
        {
            'new_user': user,
            'expiration_days': getattr(settings, 'ACCOUNT_ACTIVATION_DAYS', 7)
        },
        context_instance=context
    )


def sign_in(request):
    context = RequestContext(request)
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return HttpResponseRedirect('/myrsr')
    else:
        form = AuthenticationForm()
    return render_to_response('sign_in.html', {'form': form}, context_instance=context)


def sign_out(request):
    logout(request)
    return HttpResponseRedirect('/')

@login_required
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

@login_required
def my_updates(request):
    context = RequestContext(request)
    return render_to_response('myrsr/my_updates.html', context_instance=context)

@login_required
def my_projects(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'myrsr/my_projects.html', context)

@login_required
def user_management(request):
    context = {'users': User.objects.all()}
    return render(request, 'myrsr/user_management.html', context)

@login_required
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


def server_error(request, template_name='500.html'):
    HttpResponse("Server Error - 500")
