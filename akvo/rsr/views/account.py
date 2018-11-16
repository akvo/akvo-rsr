# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import re
import json

from lxml import etree
from tastypie.models import ApiKey

from akvo.rsr.forms import RegisterForm, InvitedUserForm
from akvo.rsr.models import Employment
from akvo.utils import rsr_send_mail

from django.conf import settings
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.signing import TimestampSigner, BadSignature
from django.http import (HttpResponse, HttpResponseRedirect,
                         HttpResponseForbidden)
from django.shortcuts import redirect, render, render_to_response
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
            #  Honeypot field filled in? If so don't register and redirect to home page
            if request.POST.get('hp_title'):
                return redirect('index')
            user = form.save(request)
            return render_to_response('registration/register_complete.html',
                                      {'new_user': user},
                                      context_instance=context)
    else:
        form = RegisterForm()
    return render_to_response('registration/register.html',
                              {'form': form, 'password_length': settings.PASSWORD_MINIMUM_LENGTH},
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
        context_instance=context
    )


def invite_activate(request, inviting_pk, user_pk, employment_pk, token_date, token):
    """
    Activate a user that has been invited to use RSR.

    :param request: the request
    :param inviting_pk: the invitee user's primary key
    :param user_pk: the invited user's primary key
    :param employment_pk: the employment's primary key
    :param token_date: the first part of the token
    :param token: the second part of the token
    """

    def approve_employment(invitee, invited, empl):
        """
        Approves the employment and sends a mail to the user that has invited the new user.

        :param invitee: the invitee user's instance
        :param invited: the invited user's instance
        :param empl: the employment's instance
        """
        empl.approve(invitee)

        if invitee:
            # Send notification email to inviting user
            rsr_send_mail(
                [invitee.email],
                subject='registration/inviting_user_notification_subject.txt',
                message='registration/inviting_user_notification_message.txt',
                html_message='registration/inviting_user_notification_message.html',
                subject_context={
                    'user': invited,
                },
                msg_context={
                    'invited_user': invited,
                    'inviting_user': invitee,
                    'organisation': empl.organisation,
                }
            )

    def login_and_redirect(req, invited):
        """
        Log the invited user in and redirect to the My projects page in MyRSR.

        :param req: the request
        :param invited: the invited user's instance
        """
        invited = authenticate(username=invited.username, no_password=True)
        login(request, invited)
        return redirect('my_projects')

    bad_link, user, inviting_user, employment = False, None, None, None

    try:
        user = get_user_model().objects.get(pk=user_pk)
        inviting_user = get_user_model().objects.get(pk=inviting_pk)
        employment = Employment.objects.get(pk=employment_pk)
    except ObjectDoesNotExist:
        bad_link = True

    try:
        TimestampSigner().unsign(':'.join([user.email, token_date, token]))
    except BadSignature:
        bad_link = True

    if user and user.is_active:
        if employment and employment.is_approved:
            # User is active and employment is approved, so nothing to do here
            return login_and_redirect(request, user)
        elif employment and not bad_link:
            # Employment is not yet approved, and link is ok.
            # Approve employment and log user in.
            approve_employment(inviting_user, user, employment)
            return login_and_redirect(request, user)

    if request.method == 'POST':
        form = InvitedUserForm(user=user, data=request.POST)
        if form.is_valid():
            # Approve employment and save new user details
            form.save(request)
            approve_employment(inviting_user, user, employment)
            return login_and_redirect(request, user)
    else:
        form = InvitedUserForm(user=user)

    context = {
        'form': form,
        'bad_link': bad_link,
    }
    return render(request, 'registration/invite_activate.html', context)


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
            return HttpResponseRedirect(next_page) if next_page else redirect('my_projects')
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

    # Organisations
    for org in orgs:
        org_id_element = etree.SubElement(xml_root, "org_id")
        org_id_element.text = str(org.id)

    # API key
    api_key_element = etree.SubElement(xml_root, "api_key")
    api_key_element.text = ApiKey.objects.get_or_create(user=user)[0].key

    # Published and editable projects
    projects = user.organisations.all_projects().published()
    pub_projs_element = etree.SubElement(xml_root, "published_projects")
    edit_projs_element = etree.SubElement(xml_root, "allow_edit_projects")
    for project in projects:
        project_id_element = etree.SubElement(pub_projs_element, "id")
        project_id_element.text = str(project.id)
        if user.has_perm('rsr.change_project', project):
            project_id_element = etree.SubElement(edit_projs_element, "id")
            project_id_element.text = str(project.id)

    return etree.tostring(etree.ElementTree(xml_root))


def api_key_json_response(user, orgs):
    """
    Build the JSON response. This is used by the Up app - so make sure they match on change.
    """
    response_data = dict()

    # User
    response_data["user_id"] = user.id
    response_data["username"] = user.username

    # Organisations
    response_data["organisations"] = [org.id for org in orgs]

    # API key
    response_data["api_key"] = ApiKey.objects.get_or_create(user=user)[0].key

    # Published projects
    projects = user.organisations.all_projects().published()
    response_data["published_projects"] = [p.id for p in projects]

    # Editable projects
    perm = 'rsr.change_project'
    perm_filter = user.get_permission_filter(perm, '')
    response_data["allow_edit_projects"] = list(projects.filter(perm_filter).values_list('id', flat=True))

    return json.dumps(response_data)


@require_POST
@csrf_exempt
def api_key(request):
    """On successful user credentials returns an auth token for API usage.

    Since RSR changed in v3 to allow users without an organisation we need to
    introduce a way to make old Up apps work as before but new ones support
    users without any connected organisations.
    """
    request_format = request.GET.get('format', 'xml')
    username = request.POST.get('username', False)
    password = request.POST.get('password', False)
    handles_unemployed = bool(request.POST.get("handles_unemployed", False))

    if username and password:
        try:
            user = authenticate(username=username, password=password)
        except ValidationError:
            user = None
        if user is not None and user.is_active:
            orgs = user.approved_organisations()
            if orgs or handles_unemployed:
                if request_format == 'xml':
                    return HttpResponse(api_key_xml_response(user, orgs),
                                        content_type="text/xml")
                elif request_format == 'json':
                    return HttpResponse(api_key_json_response(user, orgs),
                                        content_type="application/json")
    return HttpResponseForbidden()
