# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import re

from akvo.rsr.forms import RegisterForm

from django.conf import settings
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext

from registration.models import RegistrationProfile


def register(request):
    context = RequestContext(request)
    if request.method == 'POST':
        form = RegisterForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            user = form.save(request)
            return render_to_response('registration/register_complete.html',
                                      {'new_user': user},
                                      context_instance=context)
    else:
        form = RegisterForm()
    return render_to_response('registration/register.html', {'form': form},
                              context_instance=context)


def activate(request, activation_key, extra_context=None):
    """
    Activate a User's account, if their key is valid and hasn't expired.
    Any values passed in the keyword argument "extra_context"
    (which must be a dictionary) will be added to the context.
    Any values in "extra_context" which are callable will be called prior to
    being added to the context.
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

                # TODO: send activation mail (check to whom)
                # user_activated.send(sender=RegistrationProfile, user=user)

                # Log in user without password, using custom backend
                user.backend = settings.AUTHENTICATION_BACKENDS[0]
                login(request, user)
    if extra_context is None:
        extra_context = {}
    context = RequestContext(request)
    for key, value in extra_context.items():
        context[key] = callable(value) and value() or value
    return render_to_response(
        'registration/activate.html',
        {
            'expiration_days': getattr(settings, 'ACCOUNT_ACTIVATION_DAYS', 7)
        },
        context_instance=context
    )


def sign_in(request):
    context = RequestContext(request)
    form = AuthenticationForm()
    reset_form = PasswordResetForm()
    if request.method == "POST" and 'username' in request.POST:
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return HttpResponseRedirect('/myrsr')
    # Password reset on sign in page
    elif request.method == "POST" and 'email' in request.POST:
        reset_form = PasswordResetForm(data=request.POST)
        if reset_form.is_valid():
            reset_form.save()
        return HttpResponse()
    return render_to_response('sign_in.html', {'form': form, 'reset_form': reset_form}, context_instance=context)


def sign_out(request):
    logout(request)
    return HttpResponseRedirect('/')
