# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from itertools import groupby
from urlparse import urljoin

from lxml import etree

from akvo.rsr.filters import ProjectFilterSet, remove_empty_querydict_items
from akvo.rsr.models import (FocusArea, Organisation,
                             Project, ProjectUpdate, ProjectComment, Country,
                             Invoice, PartnerSite, OrganisationAccount)
from akvo.rsr.forms import (InvoiceForm, RegistrationForm1, RSR_RegistrationFormUniqueEmail,
                            RSR_ProfileUpdateForm, ProjectUpdateForm)

from akvo.rsr.decorators import fetch_project, project_viewing_permissions
from akvo.rsr.iso3166 import COUNTRY_CONTINENTS

from django import forms
from django import http
from django.conf import settings
from django.contrib.auth import authenticate, login, logout, REDIRECT_FIELD_NAME
from django.contrib.auth import get_user_model
from django.contrib.auth.views import redirect_to_login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.sites.models import RequestSite
from django.core.exceptions import PermissionDenied
from django.core.paginator import Paginator
from django.core.urlresolvers import reverse
from django.db.models import Q, Sum
from django.forms import ModelForm
from django.http import (HttpResponse, HttpResponseRedirect, HttpResponseForbidden, HttpResponsePermanentRedirect,
                         Http404)
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import Context, RequestContext, loader
from django.utils.translation import ugettext_lazy as _, get_language
from django.views.decorators.cache import never_cache, cache_page
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from datetime import datetime
from registration.models import RegistrationProfile
import random
import re
import json

from mollie.ideal.utils import query_mollie, get_mollie_fee
from paypal.standard.forms import PayPalPaymentsForm


REGISTRATION_RECEIVERS = ['gabriel@akvo.org', 'thomas@akvo.org', 'beth@akvo.org']

ALLOWED_WIDGET_TEMPLATES = ['project_narrow', 'cobranded_narrow', 'cobranded_short', 'cobranded_banner',
                            'cobranded_leader', 'feature_side', 'project_updates', 'project_contribute',
                            'project_small', 'project_list', 'project_map']


def forbidden(request, template_name='403.html'):
    '''
    Overwrites the default error 403 view to pass MEDIA_URL & error_message
    to the template.

    Decorator expectes to find a 403.html in templates folder
    '''

    try:
        message = request.error_message
    except AttributeError:
        message = _(u'We\'re sorry, you are not allowed to access this page.')

    t = loader.get_template(template_name)
    return http.HttpResponseForbidden(t.render(Context({
        'error_message': message,
        'MEDIA_URL': settings.MEDIA_URL,
        'user': request.user
    })))


def server_error(request, template_name='500.html'):
    '''
    Overwrites the default error 500 view to pass MEDIA_URL to the template

    Decorator expectes to find a 500.html in templates folder
    '''
    t = loader.get_template(template_name)
    return http.HttpResponseServerError(t.render(Context({
        'MEDIA_URL': settings.MEDIA_URL
    })))


def render_to(template):
    """
    Decorator for Django views that sends returned dict to render_to_response
    function with given template and RequestContext as context instance.

    If view doesn't return dict then decorator simply returns output.
    Additionally view can return two-tuple, which must contain dict as first
    element and string with template name as second. This string will
    override template name, given as parameter

    From: http://www.djangosnippets.org/snippets/821/
    Parameters:

     - template: template name to use
    """
    def renderer(func):
        def wrapper(request, *args, **kw):
            output = func(request, *args, **kw)
            if isinstance(output, (list, tuple)):
                # add current language for template caching purposes
                output[0].update({'lang': get_language()})
                return render_to_response(output[1], output[0],
                    RequestContext(request))
            elif isinstance(output, dict):
                # add current language for template caching purposes
                output.update({'lang': get_language()})
                return render_to_response(template, output,
                    RequestContext(request))
            return output
        return wrapper
    return renderer


# http://www.julienphalip.com/blog/2008/08/16/adding-search-django-site-snap/
def normalize_query(query_string,
                    findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
                    normspace=re.compile(r'\s{2,}').sub):
    ''' Splits the query string in invidual keywords, getting rid of unecessary spaces
        and grouping quoted words together.
        Example:

        >>> normalize_query('  some random  words "with   quotes  " and   spaces')
        ['some', 'random', 'words', 'with quotes', 'and', 'spaces']
    '''
    return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)]


def get_query(query_string, search_fields):
    ''' Returns a query, that is a combination of Q objects. That combination
        aims to search keywords within a model by testing the given search fields.
    '''
    query = None  # Query to search for every search term
    terms = normalize_query(query_string)
    for term in terms:
        or_query = None  # Query to search for a given term in each field
        for field_name in search_fields:
            q = Q(**{"%s__icontains" % field_name: term})
            if or_query is None:
                or_query = q
            else:
                or_query = or_query | q
        if query is None:
            query = or_query
        else:
            query = query & or_query
    return query


def index(request):
    '''
    The RSR home page.
    '''
    return HttpResponsePermanentRedirect(reverse('project_list', args=['all']))

def project_list_data(request, projects):
    order_by = request.GET.get('order_by', 'name')
    if order_by in ['total_budget', 'funds_needed']:
        projects = projects.extra(order_by=['-%s' % order_by, 'name'])
    else:
        projects = projects.order_by(order_by, 'name')
    PROJECTS_PER_PAGE = 10
    paginator = Paginator(projects, PROJECTS_PER_PAGE)
    page = paginator.page(request.GET.get('page', 1))
    return page


@render_to('rsr/focus_areas.html')
def focusareas(request):
    return {'site_section': 'areas'}


@render_to('rsr/project/project_directory.html')
def project_list(request, slug='all'):
    # remove empty query string variables
    query_dict = remove_empty_querydict_items(request.GET)
    # if filtering on country, set the correct continent
    country_id = query_dict.get('locations__country', '')
    if country_id:
        if not query_dict.get('continent', None) == dict(COUNTRY_CONTINENTS)[Country.objects.get(pk=int(country_id)).iso_code]:
            query_dict['continent'] = dict(COUNTRY_CONTINENTS)[Country.objects.get(pk=int(country_id)).iso_code]
            return HttpResponseRedirect("%s?%s" % (reverse('project_list', args=[slug]), query_dict.urlencode()))

    org = None
    focus_area = None
    try:
        org_id = int(slug)
    except:
        org_id = 0
    if org_id:
        org = get_object_or_404(Organisation, pk=org_id)
        queryset = org.published_projects()
    elif slug:
        focus_area = get_object_or_404(FocusArea, slug=slug)
        if slug == 'all':
            queryset = Project.objects.published()
        else:
            queryset = Project.objects.published().filter(categories__focus_area=focus_area)

    # not sure prefetch_related helps since the filtering is applied afterwards. Profiling needed.
    queryset = queryset.latest_update_fields().distinct().order_by('-pk')  # .prefetch_related('locations')
    filtered_projects = ProjectFilterSet(query_dict or None, queryset=queryset)

    return {
        'filter': filtered_projects,
        'site_section': 'projects',
        'focus_area': focus_area,
        'org': org,
        'slug': slug
    }


@render_to('rsr/project/iati_project_directory.html')
def iati_project_list(request, iati_activity_id):
    """Project list page that only shows project connected to a specific
    IATI id.
    """
    projects = Project.objects.published().filter(
        partnerships__iati_activity_id=iati_activity_id).latest_update_fields().distinct()

    if not projects:
        raise Http404

    return {
        'iati_id': iati_activity_id,
        'projects': projects
    }


@render_to('rsr/organisation/iati_organisation_directory.html')
def iati_organisation_list(request, iati_activity_id):
    """Project list page that only shows project connected to a specific
    IATI id.
    """
    organisations = Organisation.objects.filter(
        partnerships__iati_activity_id=iati_activity_id).distinct()

    if not organisations:
        raise Http404

    return {
        'iati_id': iati_activity_id,
        'organisations': organisations
    }


def old_project_list(request):
    return HttpResponsePermanentRedirect(reverse('project_list', args=['all']))


@render_to('rsr/project_directory.html')
def filteredprojectlist(request, org_id):
    '''List of  projects in RSR
    filtered on an organisation
    Context:
    projs: list of all projects
    page: paginator
    o: organisation
    '''
    #for use in akvo at a glance
    projs = Project.objects.published()
    # get all projects the org is asociated with
    o = get_object_or_404(Organisation, pk=org_id)
    projects = o.published_projects()
    showcases = projects.order_by('?')[:3]
    page = project_list_data(request, projects)
    return {'projs': projs, 'orgs': Organisation.objects, 'page': page, 'showcases': showcases, 'o': o}


def _redirect_from_landing_page_with_partner_site_id(partner_site_id):
    partner_site = get_object_or_404(PartnerSite, pk=partner_site_id)
    return HttpResponseRedirect(partner_site.get_absolute_url())


def liveearth(request):
    org_id = getattr(settings, 'LIVE_EARTH_ID', 51)
    return _redirect_from_landing_page_with_partner_site_id(org_id)


def walking_for_water(request):
    org_id = getattr(settings, 'WALKING_FOR_WATER_ID', 35)
    return _redirect_from_landing_page_with_partner_site_id(org_id)


def rabobank(request):
    org_id = getattr(settings, 'RABOBANK_ID', 21)
    return _redirect_from_landing_page_with_partner_site_id(org_id)


@render_to('rsr/organisation/organisation_directory.html')
def orglist(request, org_type='all'):
    '''List of all projects in RSR
    Context:
    orgs: list of all organisations
    stats: the aggregate projects data
    page: paginated orgs
    '''
    orgs = Organisation.objects
    #orgs = Organisation.objects.select_related()
    if org_type == 'field':
        orgs = orgs.fieldpartners()
    elif org_type == 'support':
        orgs = orgs.supportpartners_with_projects()
    elif org_type == 'funding':
        orgs = orgs.fundingpartners()
    elif org_type == 'sponsor':
        orgs = orgs.sponsorpartners()
    elif org_type == 'ngos':
        orgs = orgs.ngos()
    elif org_type == 'governmental':
        orgs = orgs.governmental()
    elif org_type == 'commercial':
        orgs = orgs.commercial()
    elif org_type == 'knowledge':
        orgs = orgs.knowledge()
    else:
        orgs = orgs.all()
    query_string = ''
    found_entries = None
    if ('q' in request.GET) and request.GET['q'].strip():
        query_string = request.GET['q']
        org_query = get_query(query_string, ['name', 'long_name', 'locations__country__name', 'locations__city', 'locations__state', 'contact_person', 'contact_email', ])
        orgs = orgs.filter(org_query).distinct()
    # Sort query
    order_by = request.GET.get('order_by', 'name')
    last_order = request.GET.get('last_order')
    sort = request.GET.get('sort', 'asc')
    if sort == 'asc':
        orgs = orgs.order_by(order_by, 'name')
    else:
        orgs = orgs.order_by('-%s' % order_by, 'name')
    paginator = Paginator(orgs, getattr(settings, 'ORGANISATION_LIST_COUNT', 20))
    page = paginator.page(request.GET.get('page', 1))
    projs = Project.objects.published()
    return {
        'site_section': 'index',
        'lang': get_language(),
        'page': page,
        'projs': projs,
        'query_string': query_string,
        'request_get': request.GET,
        'sort': sort,
        'order_by': order_by,
        'last_order': last_order,
        'org_type': org_type,
        'orgs': orgs,
    }


@render_to('rsr/partners_widget.html')
def partners_widget(request, org_type='all'):
    # Set up variables with default values
    orgs = Organisation.objects.all()
    order_by = request.GET.get('order_by', 'name')
    prev = request.GET.get('prev', 'none')
    sort_order = request.GET.get('sort', 'desc')
    is_resort = False
    mode = 'name_desc'

    # Check if resort and change sort order
    if order_by == prev:
        is_resort = True
        sort_order = 'desc' if sort_order == 'asc' else 'asc'

    # Default to name
    if order_by not in ['name', 'organisation_type', 'country', 'country__continent']:
        order_by = 'name'
    '''
    # Since location column have two fields
    if order_by in ['country','country__continent']:
        mode = 'location_' + sort_order
    else:
        mode = order_by + '_' + sort_order
    '''
    # Mode is used to style the table according the sorting
    mode = order_by + '_' + sort_order

    # Fix the ordering
    sort_order_value = '-' if is_resort and sort_order == 'asc' else ''

    if order_by == 'name':
        orgs = orgs.order_by(sort_order_value + order_by, 'organisation_type', 'country', 'country__continent')
    elif order_by == 'organisation_type':
        orgs = orgs.order_by(sort_order_value + order_by, 'country__continent', 'country', 'name')
    elif order_by == 'country':
        orgs = orgs.order_by(sort_order_value + order_by, 'organisation_type', 'name')
    elif order_by == 'country__continent':
        orgs = orgs.order_by(sort_order_value + order_by, 'country', 'organisation_type', 'name')

    return {
        'orgs': orgs,
        'order_by': order_by,
        'sort': sort_order,
        'mode': mode,
    }


#copied from django.contrib.auth.views to be able to customize the form widget attrs
def login(request, template_name='registration/login.html', redirect_field_name=REDIRECT_FIELD_NAME):
    "Displays the login form and handles the login action."
    redirect_to = request.REQUEST.get(redirect_field_name, '')

    # Non logical URLs for redirection after signing in
    redirect_blacklist = [reverse('signin'),
                          reverse('signout'),
                          reverse('register1'),
                          reverse('register2'),
                          reverse('registration_update_complete')]

    if redirect_to in redirect_blacklist:
        redirect_to = "/"

    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        # RSR mod to add css class to widgets
        form.fields['username'].widget.attrs = {'class': 'signin_field input'}
        form.fields['password'].widget.attrs = {'class': 'signin_field input'}
        if form.is_valid():
            # Light security check -- make sure redirect_to isn't garbage.
            if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
                redirect_to = getattr(settings, 'LOGIN_REDIRECT_URL', '/home')
            from django.contrib.auth import login
            login(request, form.get_user())
            if request.session.test_cookie_worked():
                request.session.delete_test_cookie()
            return HttpResponseRedirect(redirect_to)
    else:
        form = AuthenticationForm(request)
        # RSR mod to add css class to widgets
        form.fields['username'].widget.attrs = {'class': 'signin_field input'}
        form.fields['password'].widget.attrs = {'class': 'signin_field input'}
    request.session.set_test_cookie()
    current_site = RequestSite(request)
    return render_to_response(template_name, {
        'form': form,
        redirect_field_name: redirect_to,
        'site_name': current_site.name,
    }, context_instance=RequestContext(request))
login = never_cache(login)


def signout(request):
    '''
    Sign out URL
    '''
    logout(request)
    return HttpResponseRedirect(reverse('project_list', args=['all']))


def register1(request):
    '''
    The user chooses organisation as a preliminary step to registering an Akvo RSR account.
    '''
    if request.method == 'POST':
        form = RegistrationForm1(data=request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/accounts/register2/?org_id=%d' % form.cleaned_data['organisation'].id)
    else:
        form = RegistrationForm1()
    context = RequestContext(request)
    return render_to_response('registration/registration_form1.html', {'form': form}, context_instance=context)


def register2(request,
        form_class=RSR_RegistrationFormUniqueEmail,
        template_name='registration/registration_form2.html',
    ):
    org_id = request.GET.get('org_id', None)
    if not org_id:
        return HttpResponseRedirect('/accounts/register1/')
    organisation = Organisation.objects.get(pk=org_id)
    if request.method == 'POST':
        form = form_class(data=request.POST, files=request.FILES)
        if form.is_valid():
            new_user = form.save(request)
            return HttpResponseRedirect('/accounts/register/complete/')
    else:
        form = form_class(initial={'org_id': org_id, 'username': 'placeholder'})
    context = RequestContext(request)
    return render_to_response(template_name,
                              {'form': form, 'organisation': organisation},
                              context_instance=context)


#from registraion.views, to change user.is_active and send an admin email
def activate(request, activation_key,
             template_name='registration/activate.html',
             extra_context=None):
    """
    Activate a ``User``'s account, if their key is valid and hasn't
    expired.

    By default, uses the template ``registration/activate.html``; to
    change this, pass the name of a template as the keyword argument
    ``template_name``.

    **Context:**

    account
        The ``User`` object corresponding to the account, if the
        activation was successful. ``False`` if the activation was not
        successful.

    expiration_days
        The number of days for which activation keys stay valid after
        registration.

    Any values passed in the keyword argument ``extra_context`` (which
    must be a dictionary) will be added to the context as well; any
    values in ``extra_context`` which are callable will be called
    prior to being added to the context.

    **Template:**

    registration/activate.html or ``template_name`` keyword argument.

    """

    #amalgamation of registration.views.activate and registration.models.RegistrationManager.activate_user
    #however, we don't actually acivate! Instead we use signals.

    from registration.signals import user_activated
    import re

    SHA1_RE = re.compile('^[a-f0-9]{40}$')

    activation_key = activation_key.lower()  # Normalize before trying anything with it.

    if SHA1_RE.search(activation_key):
        try:
            profile = RegistrationProfile.objects.get(activation_key=activation_key)
        except RegistrationProfile.DoesNotExist:
            account = False
        else:
            account = profile.user
            if not profile.activation_key_expired():
                profile.activation_key = RegistrationProfile.ACTIVATED
                profile.save()
                user_activated.send(sender=RegistrationProfile, user=account)
    if extra_context is None:
        extra_context = {}
    context = RequestContext(request)
    for key, value in extra_context.items():
        context[key] = callable(value) and value() or value
    return render_to_response(template_name,
                              {'account': account,
                                'expiration_days': getattr(settings, 'ACCOUNT_ACTIVATION_DAYS', 7),
                                'support_email': getattr(settings, 'SUPPORT_EMAIL', 'gabriel@akvo.org'),
                                },
                              context_instance=context)


#copied from django.contrib.auth.views to be able to customize the form widget attrs
def password_change(request, template_name='registration/password_change_form.html',
                    post_change_redirect=None):
    if post_change_redirect is None:
        post_change_redirect = reverse('django.contrib.auth.views.password_change_done')
    if request.method == "POST":
        form = PasswordChangeForm(request.user, request.POST)
        form.fields['old_password'].widget.attrs = {'class': 'input'}
        form.fields['new_password1'].widget.attrs = {'class': 'input'}
        form.fields['new_password2'].widget.attrs = {'class': 'input'}
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(post_change_redirect)
    else:
        form = PasswordChangeForm(request.user)
        form.fields['old_password'].widget.attrs = {'class': 'input'}
        form.fields['new_password1'].widget.attrs = {'class': 'input'}
        form.fields['new_password2'].widget.attrs = {'class': 'input'}
    return render_to_response(template_name, {
        'form': form,
    }, context_instance=RequestContext(request))
password_change = login_required(password_change)


@login_required
def update_user_profile(
    request,
    success_url='/accounts/update/complete/',
    form_class=RSR_ProfileUpdateForm,
    template_name='registration/update_form.html',
    extra_context=None
):
    user = request.user
    if request.method == 'POST':
        form = form_class(data=request.POST, files=request.FILES)
        if form.is_valid():
            updated_user = form.update(user)
            return HttpResponseRedirect(success_url)
    else:
        form = form_class(initial={
            'first_name': user.first_name,
            'last_name': user.last_name,
        })
    if extra_context is None:
        extra_context = {}
    context = RequestContext(request)
    for key, value in extra_context.items():
        context[key] = callable(value) and value() or value
    return render_to_response(
        template_name,
        {
            'form': form,
            'profile': user
        },
        context_instance=context
    )


@render_to('rsr/project/project_updates.html')
def projectupdates(request, project_id):
    '''
    List of all updates for a project
    Context:
    project: project
    updates: list of updates, ordered by time in reverse
    '''
    project = get_object_or_404(Project, pk=project_id)
    updates = project.project_updates.all().order_by('-created_at')
    comments = project.comments.all().order_by('-created_at')[:3]
    can_add_update = project.connected_to_user(request.user)
    return {
        'project': project,
        'updates': updates,
        'can_add_update': can_add_update,
        'hide_latest_updates': True,
        'comments': comments,
        'site_section': 'project',
        }


@render_to('rsr/project/project_update.html')
def projectupdate(request, project_id, update_id):
    '''
    '''
    project = get_object_or_404(Project, id=project_id)
    update = get_object_or_404(ProjectUpdate, id=update_id, project=project)
    can_add_update = project.connected_to_user(request.user)
    can_edit_update = (update.user == request.user and can_add_update and
                       not update.edit_window_has_expired())
    comments = project.comments.all().order_by('-created_at')[:3]
    edit_timeout = settings.PROJECT_UPDATE_TIMEOUT
    return {
        'project': project,
        'update': update,
        'can_add_update': can_add_update,
        'can_edit_update': can_edit_update,
        'hide_latest_updates': True,
        'site_section': 'projects',
        'comments': comments,
        'edit_timeout': edit_timeout
        }


@render_to('rsr/project/project_comments.html')
def projectcomments(request, project_id):
    '''
    List of all updates for a project
    Context:
    p: project
    updates: list of updates, ordered by time in reverse
    '''
    project = get_object_or_404(Project, pk=project_id)
    comments = Project.objects.get(id=project_id).comments.all().order_by('-created_at')
    form = CommentForm()
    updates = project.project_updates.all().order_by('-created_at')[:3]
    can_add_update = project.connected_to_user(request.user)
    return {
        'project': project,
        'comments': comments,
        'form': form,
        'project_section': 'comments',
        'hide_comments': True,
        'updates': updates,
        'can_add_update': can_add_update
        }


# @login_required()
def updateform(request, project_id,
               edit_mode=False,
               form_class=ProjectUpdateForm,
               update_id=None):
    '''Form for creating or editing a project update

    :project: project
    :form: the update form
    :update_id: the ID of the update being edited, if any
    '''

    update = None
    project = get_object_or_404(Project, id=project_id)
    user_is_authorized = project.connected_to_user(request.user)

    if not request.user.is_authenticated():
        return redirect_to_login(request.path)

    if not project.is_published():
        request.error_message = u"You can't add updates to unpublished projects."
        raise PermissionDenied

    if not user_is_authorized:
        request.error_message = u"You don't have permission to add updates to this project."
        raise PermissionDenied

    if update_id is not None:
        edit_mode = True
        update = get_object_or_404(ProjectUpdate, id=update_id)
        if not request.user == update.user:
            request.error_message = u'You can only edit your own updates.'
            raise PermissionDenied

        if update.edit_window_has_expired():
            return render_to_response('rsr/project/update_form_timeout.html',
                dict(
                    project=project,
                    update=update,
                    site_section='projects',
                    ),
                RequestContext(request))

    if request.method == 'POST':
        form = form_class(request.POST, request.FILES,
                          instance=update)
        if form.is_valid():
            update = form.save(commit=False)
            update.project = project
            update.user = request.user
            update.update_method = 'W'
            update.save()
            return redirect(update.get_absolute_url())
    else:
        form = form_class(instance=update)
    return render_to_response('rsr/project/update_form.html',
        dict(form=form,
             project=project,
             update=update,
             edit_mode=edit_mode,
             site_section='projects'),
        RequestContext(request))


class CommentForm(ModelForm):

    comment = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'textarea',
        'rows': '5',
        'cols': '75',
    }))

    class Meta:
        model = ProjectComment
        fields = ('comment',)


@login_required()
def commentform(request, project_id):
    '''
    URL for posting a comment to a project
    '''
    p = get_object_or_404(Project, pk=project_id)
    if request.method == 'POST':
        form = CommentForm(request.POST, )
        if form.is_valid():
            comment = form.save(commit=False)
            comment.project = p
            comment.user = request.user
            comment.save()
    return HttpResponseRedirect(reverse('project_comments', args=[project_id]))


@render_to('rsr/organisation/organisation.html')
def orgdetail(request, org_id):
    organisation = get_object_or_404(Organisation, pk=org_id)
    org_projects = organisation.published_projects().status_not_cancelled().status_not_complete()
    org_partners = organisation.partners().distinct()
    return {
        'organisation': organisation,
        'org_projects': org_projects,
        'org_partners': org_partners,
        'site_section': 'projects',
        }


@project_viewing_permissions
@render_to('rsr/project/project_main.html')
def projectmain(request, project, draft=False, can_add_update=False):
    '''
    The project overview page
    Context:
    project: the project
    related: 2 projects sharing the same Categories as project, chosen randomly
    updates: the three latest updates
    updates_with_images: all updates for this project that includes an image
    can_add_update: boolean telling if the user is logged in and connected to the project
    admin_change_url: url to the change view in the admin for the project, set to None if the user is not allowed to edit
    comments: the three latest comments
    site_section: for use in the main nav hilighting
    '''
    all_updates = project.project_updates.all().order_by('-created_at')
    updates_with_images = all_updates.exclude(photo__exact='').order_by('-created_at')
    comments = project.comments.all().order_by('-created_at')[:3]
    # comprehensions are fun! here we use it to get the categories that
    # don't contain only 0 value benchmarks
    benchmarks = project.benchmarks.filter(
        category__in=[
            category for category in project.categories.all()
            if project.benchmarks.filter(category=category).aggregate(Sum('value'))['value__sum']
        ])

    can_add_update = project.connected_to_user(request.user)

    return {
        'benchmarks': benchmarks,
        'can_add_update': can_add_update,
        'draft': draft,
        'comments': comments,
        'p': project,  # compatibility with new_look
        'project': project,
#        'related': related,
        'site_section': 'projects',
        'updates': all_updates[:3],
        'updates_with_images': updates_with_images,
    }


def projectdetails(request, project_id):
    "Fix for old url with project details"
    return http.HttpResponsePermanentRedirect('/project/%s/' % project_id)


@project_viewing_permissions
@render_to('rsr/project/project_partners.html')
def projectpartners(request, project, draft=False, can_add_update=False):
    updates = project.project_updates.all().order_by('-created_at')[:3]
    comments = project.comments.all().order_by('-created_at')[:3]
    can_add_update = project.connected_to_user(request.user)
    return {
        'can_add_update': can_add_update,
        'draft': draft,
        'comments': comments,
        'hide_project_partners': True,
        'project': project,
        'site_section': 'projects',
        'updates': updates,
    }


@project_viewing_permissions
@render_to('rsr/project/project_funding.html')
def projectfunding(request, project, draft=False, can_add_update=False):
    public_donations = project.public_donations()
    updates = project.project_updates.all().order_by('-created_at')[:3]
    comments = project.comments.all().order_by('-created_at')[:3]
    can_add_update = project.connected_to_user(request.user)
    return {
        'can_add_update': can_add_update,
        'draft': draft,
        'comments': comments,
        'hide_funding_link': True,
        'project': project,
        'public_donations': public_donations,
        'site_section': 'projects',
        'updates': updates,
    }


@project_viewing_permissions
def getwidget(request, project, draft=False, can_add_update=False):
    '''
    user_level is None, 1 or 2. No user level check on step 2
    '''
    if not request.POST:
        try:
            account_level = request.user.organisations.all()[0].organisationaccount.account_level
        except:
            account_level = OrganisationAccount.ACCOUNT_FREE
        # project = get_object_or_404(Project.objects, pk=project_id)
        orgs = project.all_partners()
        return render_to_response('rsr/project/get-a-widget/machinery_step1.html', {
                'account_level': account_level,
                'draft': draft,
                'organisations': orgs,
                'project': project,
                'site_section': 'projects',
            }, context_instance=RequestContext(request)
        )
    else:
        widget_type = request.POST['widget-type']
        widget_choice = request.POST['widget-choice']
        widget_site = request.POST['widget-site']
        if widget_choice == 'random-from-org':
            o = get_object_or_404(Organisation, pk=request.POST['widget-organisations'])
        elif widget_choice == 'project-list' or widget_choice == 'project-map':
            o = get_object_or_404(Organisation, pk=request.POST['widget-organisations'])
        else:
            o = None
        # project = get_object_or_404(Project, pk=project_id)
        return render_to_response('rsr/project/get-a-widget/machinery_step2.html', {
            'project': project,
            'organisation': o,
            'widget_choice': widget_choice,
            'widget_type': widget_type,
            'widget_site': widget_site,
            'site_section': 'projects',
            'draft': draft,
            }, context_instance=RequestContext(request))


def templatedev(request, template_name):
    "Render a template in the dev folder. The template rendered is template_name.html when the path is /dev/template_name/"
    dev = {'path': 'dev/'}
    SAMPLE_PROJECT_ID = 2
    SAMPLE_ORG_ID = 42
    p = Project.objects.get(pk=SAMPLE_PROJECT_ID)
    updates = Project.objects.get(id=SAMPLE_PROJECT_ID).project_updates.all().order_by('-created_at')[:3]
    comments = Project.objects.get(id=SAMPLE_PROJECT_ID).comments.all().order_by('-created_at')[:3]
    grid_projects = Project.objects.filter(current_image__startswith='img').order_by('?')[:12]

    projects = Project.objects.published()
    stats = akvo_at_a_glance(projects)

    orgs = Organisation.objects.all()

    o = Organisation.objects.get(pk=SAMPLE_ORG_ID)
    org_projects, org_partners = org_activities(o)
    org_stats = akvo_at_a_glance(org_projects)

    return render_to_response('dev/%s.html' % template_name,
        {'dev': dev, 'p': p, 'updates': updates, 'comments': comments, 'projects': projects, 'stats': stats, 'orgs': orgs, 'o': o, 'org_projects': org_projects, 'org_partners': org_partners, 'org_stats': org_stats, 'grid_projects': grid_projects, }, context_instance=RequestContext(request))


def select_project_widget(request, org_id, template=''):
    o = get_object_or_404(Organisation, pk=org_id)  # TODO: better error handling for widgets than straight 404
    org_projects = o.published_projects()
    project = random.choice(org_projects)
    get = request.GET.copy()  # needed to be able to modify the dict
    template = get.pop('widget', ['feature-side'])[0]  # get.pop returns a list
    return HttpResponseRedirect('%s?%s' % (reverse('project_widget', args=[template, project.id]), get.urlencode()))


def project_widget(request, template='feature-side', project_id=None):
    if template.replace('-', '_') not in ALLOWED_WIDGET_TEMPLATES:
        raise Http404
    if project_id:
        p = get_object_or_404(Project, pk=project_id)
    else:
        p = random.choice(Project.objects.published().status_not_archived().status_not_cancelled())
    bgcolor = request.GET.get('bgcolor', 'B50000')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    site = request.GET.get('site', 'rsr.akvo.org')

    return render_to_response('widgets/%s.html' % template.replace('-', '_'),
        {
            'project': p,
            'p': p,  # compatibility with new_look
            'request_get': request.GET,
            'bgcolor': bgcolor,
            'textcolor': textcolor,
            'site': site
        },
        context_instance=RequestContext(request))


def project_list_widget(request, template='project-list', org_id=0):
    if template.replace('-', '_') not in ALLOWED_WIDGET_TEMPLATES:
        raise Http404
    bgcolor = request.GET.get('bgcolor', 'B50000')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    site = request.GET.get('site', 'rsr.akvo.org')

    if int(org_id):
        o = get_object_or_404(Organisation, pk=org_id)
        p = o.published_projects()
        p = p.status_not_archived().status_not_cancelled()
    else:
        p = Project.objects.published().status_not_archived() \
            .status_not_cancelled()

    order_by = request.GET.get('order_by', 'title')
    sql = (
        'SELECT MAX(created_at) '
        'FROM rsr_projectupdate '
        'WHERE project_id = rsr_project.id'
    )
    p = p.extra(select={'last_update': sql})

    if order_by == 'country__continent':
        p = p.order_by(order_by, 'primary_location__country__name', 'title')
    elif order_by == 'last_update':
        p = p.order_by('-last_update', 'title')
    elif order_by in ['budget', 'funds_needed']:
        p = p.extra(order_by=['-%s' % order_by, 'title'])
    else:
        p = p.order_by(order_by, 'title')
    return render_to_response(
        'widgets/%s.html' % template.replace('-', '_'),
        {
            'bgcolor': bgcolor,
            'textcolor': textcolor,
            'projects': p,
            'org_id': org_id,
            'request_get': request.GET,
            'site': site,
            'lang': get_language(),
        },
        context_instance=RequestContext(request))


@render_to('widgets/project_map.html')
def project_map_widget(request, org_id):
    bgcolor = request.GET.get('bgcolor', 'B50000')
    height = request.GET.get('height', '300')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    width = request.GET.get('width', '600')
    zoom = request.GET.get('zoom', '1')
    state = request.GET.get('state', 'dynamic')

    projects = Project.objects.filter(partnerships__organisation=org_id).active()

    if state != 'dynamic':
        state = 'static'

    try:
        map_height = int(height) - 24  # Since we have a bottom bar of 24px
    except ValueError:
        map_height = 276  # 326px = default height(350px) - bottom bar(24px)

    return {
        'bgcolor': bgcolor,
        'height': map_height,
        'org': get_object_or_404(Organisation, pk=org_id),
        'projects': projects,
        'textcolor': textcolor,
        'width': width,
        'zoom': zoom,
        'state': state
    }


def can_donate_to_project(project):
    "Predicate to determine if a project can be donated to."
    active = project in Project.objects.active()
    funds_needed = project.funds_needed > 0
    return active and funds_needed and project.donate_button


@fetch_project
@render_to("rsr/project/donate/donate_step1.html")
def setup_donation(request, p):
    if not can_donate_to_project(p):
        return redirect("project_main", project_id=p.id)
    request.session["original_http_referer"] = request.META.get("HTTP_REFERER", None)
    request.session["donation_return_url"] = request.GET.get("return_url", "")
    return dict(project=p)


@fetch_project
def donate(request, p, engine):
    if not can_donate_to_project(p):
        return redirect("project_main", project_id=p.id)
    is_test_donation = getattr(settings, "DONATION_TEST", False)
    if request.method == "POST":
        donate_form = InvoiceForm(data=request.POST, project=p, engine=engine)
        if donate_form.is_valid():
            description = u"Akvo-%d-%s" % (p.id, p.title)
            cd = donate_form.cleaned_data
            invoice = donate_form.save(commit=False)
            invoice.project = p
            invoice.engine = engine
            invoice.name = cd["name"]
            invoice.email = cd["email"]
            invoice.campaign_code = cd["campaign_code"]
            invoice.is_anonymous = not cd["is_public"]
            original_http_referer = request.session.get("original_http_referer", None)
            if original_http_referer:
                invoice.http_referer = original_http_referer
                del request.session["original_http_referer"]
            else:
                invoice.http_referer = request.META.get("HTTP_REFERER", None)
            if is_test_donation:
                invoice.test = True
            if request.session.get("donation_return_url", False):
                return_url = urljoin(request.session["donation_return_url"], reverse("donate_thanks"))
            else:
                return_url = urljoin(request.domain_url, reverse("donate_thanks"))
            if engine == "ideal":
                invoice.bank = cd["bank"]
                mollie_dict = dict(
                    amount=invoice.amount * 100,
                    bank_id=invoice.bank,
                    partnerid=invoice.gateway,
                    description=description,
                    reporturl=urljoin(request.domain_url, reverse("mollie_report")),
                    returnurl=return_url)
                try:
                    mollie_response = query_mollie(mollie_dict, "fetch")
                    invoice.transaction_id = mollie_response["transaction_id"]
                    order_url = mollie_response["order_url"]
                    invoice.save()
                except:
                    return redirect("donate_500")
                return render_to_response("rsr/project/donate/donate_step3.html",
                                          dict(invoice=invoice,
                                               project=p,
                                               payment_engine=engine,
                                               mollie_order_url=order_url),
                                          context_instance=RequestContext(request))
            elif engine == "paypal":
                invoice.save()
                pp_dict = dict(
                    cmd="_donations",
                    currency_code=invoice.currency,
                    business=invoice.gateway,
                    amount=invoice.amount,
                    item_name=description,
                    invoice=int(invoice.id),
                    lc=invoice.locale,
                    notify_url=urljoin(request.domain_url, reverse("paypal_ipn")),
                    return_url=return_url,
                    cancel_url=request.domain_url)
                pp_form = PayPalPaymentsForm(initial=pp_dict)
                if is_test_donation:
                    pp_button = pp_form.sandbox()
                else:
                    pp_button = pp_form.render()
                return render_to_response("rsr/project/donate/donate_step3.html",
                                          dict(invoice=invoice,
                                               payment_engine=engine,
                                               pp_form=pp_form,
                                               pp_button=pp_button,
                                               project=p),
                                          context_instance=RequestContext(request))
    else:
        donate_form = InvoiceForm(project=p,
                                  engine=engine,
                                  initial=dict(is_public=True))
        if request.session.get("donation_return_url", False):
            request.session["cancel_url"] = urljoin(request.session["donation_return_url"],
                                                    reverse("project_main", kwargs={'project_id': p.id}))
        else:
            request.session["cancel_url"] = reverse("project_main", kwargs={'project_id': p.id})
    return render_to_response("rsr/project/donate/donate_step2.html",
                              dict(donate_form=donate_form,
                                   payment_engine=engine,
                                   project=p),
                              context_instance=RequestContext(request))


def void_invoice(request, invoice_id, action=None):
    invoice = get_object_or_404(Invoice, pk=invoice_id)
    if invoice.status == 1:
        invoice.status = 2
        invoice.save()
        if action == "back":
            return redirect("complete_donation",
                            project_id=invoice.project.id,
                            engine=invoice.engine)
        elif action == "cancel":
            if request.session.get("donation_return_url", False):
                return redirect(urljoin(request.session["donation_return_url"],
                                        reverse("project_main",
                                                kwargs={'project_id': invoice.project.id})))
            else:
                return redirect("project_main", project_id=invoice.project.id)
    return redirect("project_list", slug="all")


def mollie_report(request, mollie_response=None):
    transaction_id = request.GET.get("transaction_id", None)
    if transaction_id:
        invoice = Invoice.objects.get(transaction_id=transaction_id)
        request_dict = dict(partnerid=invoice.gateway, transaction_id=transaction_id)
        try:
            mollie_response = query_mollie(request_dict, "check")
        except:
            pass
        if mollie_response is not None and mollie_response["paid"] == "true":
            mollie_fee = get_mollie_fee()
            invoice.amount_received = invoice.amount - mollie_fee
            invoice.status = 3
        else:
            invoice.status = 2
        invoice.save()
    return HttpResponse("OK")


def donate_thanks(request,
                  invoice=None,
                  template="rsr/project/donate/donate_thanks.html"):
    paypal_invoice_id = request.GET.get("invoice", None)
    mollie_transaction_id = request.GET.get("transaction_id", None)
    if paypal_invoice_id is not None:
        invoice = Invoice.objects.get(pk=int(paypal_invoice_id))
    elif mollie_transaction_id is not None:
        invoice = Invoice.objects.get(transaction_id=str(mollie_transaction_id))
    if invoice is not None:
        return render_to_response(template,
                                  dict(invoice=invoice,
                                       project=invoice.project),
                                  context_instance=RequestContext(request))
    return redirect("index")


@render_to("rsr/global_map.html")
def global_map(request):
    projects = Project.objects.published()
    marker_icon = getattr(settings, "GOOGLE_MAPS_MARKER_ICON", "")
    return dict(projects=projects, marker_icon=marker_icon)

def get_update_month_and_year(update):
    return (update.created_at.date().month, update.created_at.date().year)

def get_country(project):
    return project.primary_location.country.name

@render_to('rsr/akvo_at_a_glance.html')
def data_overview(request):
    MONTHS = [
        u'Jan',
        u'Feb',
        u'Mar',
        u'Apr',
        u'May',
        u'Jun',
        u'Jul',
        u'Aug',
        u'Sep',
        u'Oct',
        u'Nov',
        u'Dec',
    ]
    projects = Project.objects.published().order_by('primary_location__country')
    orgs = Organisation.objects.all()

    projects_by_country = [['Country', 'No. of Projects']]
    # Group projects by country.
    # The exclude filter is there to remove projects with broken data, i.e. a primary_loction that is set,
    # but has no corresponding ProjectLocation object
    country_projects = groupby(projects.filter(
        primary_location__isnull=False).exclude(primary_location__latitude__isnull=True), get_country
    )
    projects_by_country.extend([[country_project[0], len(list(country_project[1]))] for country_project in country_projects])
    country_lookup = dict([(country.name, country.pk) for country in Country.objects.all()])

    updates = ProjectUpdate.objects.all().order_by('created_at')
    groupdates = groupby(updates, get_update_month_and_year)
    updates_by_month = [['Month', 'Updates']]
    updates_by_month.extend([['%s %s' % (MONTHS[groupdate[0][0]-1], str(groupdate[0][1])), len(list(groupdate[1]))] for groupdate in groupdates])

    return dict(projects=projects, orgs=orgs, updates_by_month=json.dumps(updates_by_month), projects_by_country=json.dumps(projects_by_country), country_lookup=json.dumps(country_lookup))


@cache_page(60 * 15)
def global_project_map_json(request):
    "Should be replaced with API calls when the API is ready."
    data = []
    for project in Project.objects.published():
        try:
            image_url = project.current_image.extra_thumbnails['map_thumb'].absolute_url
        except:
            image_url = ""
        for location in project.locations.all():
            data.append(dict(title=project.title,
                             url=project.get_absolute_url(),
                             latitude=location.latitude,
                             longitude=location.longitude,
                             image_url=image_url))
    return HttpResponse(json.dumps(data), content_type="application/json")


@cache_page(60 * 15)
def global_organisation_map_json(request):
    "Should be replaced with API calls when the API is ready."
    data = []
    for organisation in Organisation.objects.has_location():
        try:
            image_url = organisation.logo.extra_thumbnails["map_thumb"].absolute_url
        except:
            image_url = ""
        for location in organisation.locations.all():
            data.append(dict(name=organisation.name,
                             url=organisation.get_absolute_url(),
                             latitude=location.latitude,
                             longitude=location.longitude,
                             image_url=image_url))
    return HttpResponse(json.dumps(data), content_type="application/json")


@cache_page(60 * 15)
def global_organisation_projects_map_json(request, org_id):
    "Should be replaced with API calls when the API is ready."
    locations = []
    organisation = Organisation.objects.get(id=org_id)
    for project in organisation.published_projects():
        try:
            image_url = project.current_image.extra_thumbnails['map_thumb'].absolute_url
        except:
            image_url = ""
        for location in project.locations.all():
            locations.append(dict(title=project.title,
                                  url=project.get_absolute_url(),
                                  latitude=location.latitude,
                                  longitude=location.longitude,
                                  image_url=image_url))
    callback = request.GET.get('callback')
    location_data = json.dumps(locations)
    if callback:
        location_data = '%s(%s);' % (callback, location_data)
    return HttpResponse(location_data, content_type='application/json')


@require_POST
@csrf_exempt
def get_api_key(request):
    username = request.POST.get("username", "")
    password = request.POST.get("password", "")
    if username and password:
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            user_id = user.id
            user_profile = get_user_model().objects.get(user=user)
            try:
                org_id = user_profile.organisations.all()[0].id
                projects = user_profile.organisations.all()[0].published_projects()
            except:
                return HttpResponseForbidden()
            if not user_profile.api_key:
                user_profile.save()
            xml_root = etree.Element("credentials")
            user_id_element = etree.SubElement(xml_root, "user_id")
            user_id_element.text = str(user_id)
            username_element = etree.SubElement(xml_root, "username")
            username_element.text = username
            org_id_element = etree.SubElement(xml_root, "org_id")
            org_id_element.text = str(org_id)
            api_key_element = etree.SubElement(xml_root, "api_key")
            api_key_element.text = user_profile.api_key
            pub_projs_element = etree.SubElement(xml_root, "published_projects")
            for proj in projects:
                proj_id_element = etree.SubElement(pub_projs_element, "id")
                proj_id_element.text = str(proj.id)
            xml_tree = etree.ElementTree(xml_root)
            xml_data = etree.tostring(xml_tree)
            return HttpResponse(xml_data, content_type="text/xml")
    return HttpResponseForbidden()
