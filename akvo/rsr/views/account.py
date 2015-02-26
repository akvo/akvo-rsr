# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import re

from lxml import etree

from akvo.rsr.forms import RegisterForm

from django.conf import settings
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.shortcuts import render_to_response
from django.template import RequestContext

from registration.models import RegistrationProfile

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


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
            if not registration_profile.activation_key_expired():
                registration_profile.activation_key = RegistrationProfile.ACTIVATED
                registration_profile.save()
                user = registration_profile.user
                user.is_active = True
                user.save()

                # Log in user without password, using custom backend
                user = authenticate(username=user.username, no_password=True)
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
            next_page = request.GET.get('next')
            return HttpResponseRedirect(next_page) if next_page else HttpResponseRedirect('/myrsr')
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


@require_POST
@csrf_exempt
def get_api_key(request):
    username = request.POST.get("username", "")
    password = request.POST.get("password", "")
    if username and password:
        user = authenticate(username=username, password=password)
        if user is not None:
            orgs = user.approved_organisations()
            if orgs:
                login(request, user)
                user_id = user.id
                org_id = orgs[0].id
                projects = user.organisations.all_projects().published()
                if not user.api_key:
                    user.save()
                xml_root = etree.Element("credentials")
                user_id_element = etree.SubElement(xml_root, "user_id")
                user_id_element.text = str(user_id)
                username_element = etree.SubElement(xml_root, "username")
                username_element.text = username
                org_id_element = etree.SubElement(xml_root, "org_id")
                org_id_element.text = str(org_id)
                api_key_element = etree.SubElement(xml_root, "api_key")
                api_key_element.text = user.get_api_key
                pub_projs_element = etree.SubElement(xml_root, "published_projects")
                for proj in projects:
                    proj_id_element = etree.SubElement(pub_projs_element, "id")
                    proj_id_element.text = str(proj.id)
                xml_tree = etree.ElementTree(xml_root)
                xml_data = etree.tostring(xml_tree)
                return HttpResponse(xml_data, content_type="text/xml")

    return HttpResponseForbidden()
