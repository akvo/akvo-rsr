# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import re

from lxml import etree
from tastypie.models import ApiKey

from akvo.rsr.forms import RegisterForm

from django.conf import settings
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm
from django.http import (HttpResponse, HttpResponseRedirect,
                         HttpResponseForbidden)
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext

from registration.models import RegistrationProfile

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


def register(request):
    """Register form."""
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
    """Activate resouce.

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
            registration_profile = RegistrationProfile.objects.get(
                activation_key=activation_key)
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
    """Sign in.

    POST have two variants with username & email:
     - username > normal sign in
     - email > password reset workflow
    """
    context = RequestContext(request)
    form = AuthenticationForm()
    reset_form = PasswordResetForm()
    if request.method == "POST" and 'username' in request.POST:
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            next_page = request.GET.get('next')
            return HttpResponseRedirect(next_page) if next_page else redirect('my_details')
    # Password reset on sign in page
    elif request.method == "POST" and 'email' in request.POST:
        reset_form = PasswordResetForm(data=request.POST)
        if reset_form.is_valid():
            reset_form.save(domain_override=settings.RSR_DOMAIN)
        return HttpResponse()
    return render_to_response('sign_in.html', {'form': form, 'reset_form': reset_form},
                              context_instance=context)


def sign_out(request):
    """Log out resouce."""
    logout(request)
    return redirect('index')


def api_key_xml_response(user, orgs):
    """Build the XML response.

    This is used by the Up app - so make sure they match on change.
    """
    xml_root = etree.Element("credentials")

    # User
    user_id_element = etree.SubElement(xml_root, "user_id")
    user_id_element.text = str(user.id)
    user_username_element = etree.SubElement(xml_root, "username")
    user_username_element.text = user.username

    # Organisationss
    for org in orgs:
        org_id_element = etree.SubElement(xml_root, "org_id")
        org_id_element.text = str(org.id)

    # API key
    api_key_element = etree.SubElement(xml_root, "api_key")
    api_key_element.text = ApiKey.objects.get_or_create(user=user)[0].key

    # Published projects
    projects = user.organisations.all_projects().published()
    pub_projs_element = etree.SubElement(xml_root, "published_projects")
    for project in projects:
        project_id_element = etree.SubElement(pub_projs_element, "id")
        project_id_element.text = str(project.id)

    return etree.tostring(etree.ElementTree(xml_root))


@require_POST
@csrf_exempt
def api_key(request):
    """On successful user credentials returns an auth token for API usage.

    Since RSR changed in v3 to allow users without an organiation we need to
    introduce a way to make old Up apps work as before but new ones support
    users without any connected organisations.
    """
    username = request.POST.get('username', False)
    password = request.POST.get('password', False)
    handles_unemployed = bool(request.POST.get("handles_unemployed", False))

    if username and password:
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            orgs = user.approved_organisations()
            if orgs or handles_unemployed:
                return HttpResponse(api_key_xml_response(user, orgs),
                                    content_type="text/xml")
    return HttpResponseForbidden()
