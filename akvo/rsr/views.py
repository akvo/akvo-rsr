# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.filters import ProjectFilterSet, remove_empty_querydict_items
from akvo.rsr.models import (MiniCMS, FocusArea, Category, Organisation,
                             Project, ProjectUpdate, ProjectComment, Country,
                             UserProfile, Invoice, SmsReporter)
from akvo.rsr.forms import (InvoiceForm, OrganisationForm, RSR_RegistrationFormUniqueEmail,
                            RSR_ProfileUpdateForm, ProjectUpdateForm)

from akvo.rsr.decorators import fetch_project
from akvo.rsr.iso3166 import COUNTRY_CONTINENTS

from akvo.rsr.utils import (wordpress_get_lastest_posts, get_rsr_limited_change_permission,
                            get_random_from_qs, state_equals)

from django import forms
from django import http
from django.conf import settings
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.sites.models import RequestSite
from django.core.paginator import Paginator
from django.core.urlresolvers import reverse
from django.db.models import Sum
from django.forms import ModelForm
from django.http import HttpResponse, HttpResponseRedirect, HttpResponsePermanentRedirect, HttpResponseServerError
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import Context, RequestContext, loader
from django.utils.translation import ugettext_lazy as _, get_language
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from datetime import datetime
from registration.models import RegistrationProfile
import random

from mollie.ideal.utils import query_mollie, get_mollie_fee
from paypal.standard.forms import PayPalPaymentsForm
from notification.models import Notice

REGISTRATION_RECEIVERS = ['gabriel@akvo.org', 'thomas@akvo.org', 'beth@akvo.org']

def server_error(request, template_name='500.html'):
    '''
    Overwrites the default error 500 view to pass MEDIA_URL to the template
    '''
    t = loader.get_template(template_name) # You need to create a 500.html template.
    return http.HttpResponseServerError(t.render(Context({
        'MEDIA_URL': settings.MEDIA_URL
    })))

def render_to(template):
    """
    Decorator for Django views that sends returned dict to render_to_response function
    with given template and RequestContext as context instance.

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
                output[0].update({'lang':get_language()})
                return render_to_response(output[1], output[0], RequestContext(request))
            elif isinstance(output, dict):
                # add current language for template caching purposes
                output.update({'lang':get_language()})
                return render_to_response(template, output, RequestContext(request))
            return output
        return wrapper
    return renderer

def set_low_bandwidth(request):
    request.session['bandwidth'] = 'low'
    return HttpResponseRedirect('/rsr/')

def set_high_bandwidth(request):
    request.session['bandwidth'] = 'high'
    return HttpResponseRedirect('/rsr/')

def set_test_cookie(request):
    request.session.set_test_cookie()
    return HttpResponseRedirect('/rsr/?nocookie=test')

# This is defined in and imported from utils.py
#def get_random_from_qs(qs, count):
#    "used as replacement for qs.order_by('?')[:count] since that 'freezes' the result when using johnny-cache"
#    qs_list = list(qs.values_list('pk', flat=True))
#    random.shuffle(qs_list)
#    return qs.filter(pk__in=qs_list[:count])

# http://www.julienphalip.com/blog/2008/08/16/adding-search-django-site-snap/
import re
from django.db.models import Q
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
    query = None # Query to search for every search term
    terms = normalize_query(query_string)
    for term in terms:
        or_query = None # Query to search for a given term in each field
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


@render_to('rsr/index.html')
def index(request, cms_id=None):
    '''
    The RSR home page.
    '''        
    preview = False
    focus_areas = FocusArea.objects.exclude(slug='all')

    if cms_id:
        cms = MiniCMS.objects.get(pk=cms_id)
        preview = True
    else:
        try:
            cms = MiniCMS.objects.filter(active=True)[0]
        except:
            cms = MiniCMS.objects.get(pk=1)

    # posts that we get the titles from and display in the top news box
    news_posts = wordpress_get_lastest_posts(
        'wordpress', getattr(settings, 'NEWS_CATEGORY_ID', 13), getattr(settings, 'NEWS_ARTICLE_COUNT', 2)
    )
    # posts that we show in the more headlines box
    blog_posts = wordpress_get_lastest_posts(
        'wordpress', getattr(settings, 'FEATURE_CATEGORY_ID', None), getattr(settings, 'FEATURE_ARTICLE_COUNT', 2)
    )
    # from this category we draw the image to show in the news box
    image_posts = wordpress_get_lastest_posts(
        'wordpress', getattr(settings, 'IMAGE_CATEGORY_ID', 11), getattr(settings, 'IMAGE_CATEGORY_ID', 1)
    )

    news_image = ''
    news_title = ''

    projects = Project.objects.published().funding()
    orgs = Organisation.objects.all()

    people_served = projects.get_largest_value_sum(getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'))
    #round to nearest whole 1000
    people_served = int(people_served / 1000) * 1000
        
    #get three featured updates with video and/or photo
    updates = ProjectUpdate.objects.exclude(photo__exact='', video__exact='').filter(project__in=Project.objects.active()).order_by('-time')[:3]
    if news_posts:
        for post in image_posts:
            if post.get('image', None):
                news_image = post['image']
                news_title = post['title']
                break

    context_dict = {
        #'updates': updates,
        'focus_areas': focus_areas,
        'cms': cms,
        'version': getattr(settings, 'URL_VALIDATOR_USER_AGENT', 'Django'),
        'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
        'site_section': 'index',
        'blog_posts': blog_posts,
        'news_posts': news_posts,
        'preview':  preview,
    }
    context_dict.update({
        'orgs': orgs,
        'projects': projects,
        'people_served': people_served,
        'projects_total_total_budget': round(projects.total_total_budget() / 100000) / 10.0,
        'updates': updates,
    })
    return context_dict

def oldindex(request):
    "Fix for old url of old rsr front that has become the akvo home page"
    return HttpResponsePermanentRedirect('/')

def project_list_data(request, projects):
    order_by = request.GET.get('order_by', 'name')
    if order_by in ['total_budget', 'funds_needed']:
        projects = projects.extra(order_by = ['-%s' % order_by, 'name'])
    else:
        projects = projects.order_by(order_by, 'name')
    PROJECTS_PER_PAGE = 10
    paginator = Paginator(projects, PROJECTS_PER_PAGE)
    page = paginator.page(request.GET.get('page', 1))
    return page


@render_to('rsr/focus_areas.html')
def focusareas(request):
    return {'site_section': 'areas',}


@render_to('rsr/project/project_directory.html')
#@render_to('rsr/project/project_list.html')
def project_list(request, slug='all'):
    # remove empty query string variables
    query_dict = remove_empty_querydict_items(request.GET)
    # if filtering on country, set the correct continent
    country_id = query_dict.get('locations__country', '')
    if country_id:
        if not query_dict.get('continent', None) == dict(COUNTRY_CONTINENTS)[Country.objects.get(pk=int(country_id)).iso_code]:
            query_dict['continent'] = dict(COUNTRY_CONTINENTS)[Country.objects.get(pk=int(country_id)).iso_code]
            return HttpResponseRedirect("%s?%s" % (reverse('project_list', args=[slug] ), query_dict.urlencode()))

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

    queryset = queryset.funding().latest_update_fields().distinct().order_by('-pk')

    filtered_projects = ProjectFilterSet(query_dict or None, queryset=queryset)

    return {
        'filter': filtered_projects,
        'site_section': 'projects',
        'focus_area': focus_area,
        'org': org,
        'slug': slug
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
    projs = Project.objects.published().funding()
    # get all projects the org is asociated with
    o = get_object_or_404(Organisation, pk=org_id)
    projects = o.published_projects().funding()
    showcases = projects.order_by('?')[:3]
    page = project_list_data(request, projects)
    return {'projs': projs, 'orgs': Organisation.objects, 'page': page, 'showcases': showcases, 'o': o,}

@render_to('rsr/organisation/landing_pages/liveearth.html')
def liveearth(request):
    '''List of all projects associated with Live Earth
    Context:
    projects: list of all projects
    stats: the aggregate projects data
    page: paginator
    '''
    org = get_object_or_404(Organisation, pk=getattr(settings, 'LIVE_EARTH_ID', 0))
    projects = org.published_projects().funding()
    page = project_list_data(request, projects)
    active_projects = projects.status_not_cancelled().status_not_archived()
    return {
        'page': page,
        'org': org,
        'active_projects': active_projects,
        'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
    }
    
@render_to('rsr/organisation/landing_pages/wfw.html')
def walking_for_water(request):
    '''List of all projects associated with Walking for Water
    Context:                                                                       
    projects: list of all projects                                                 
    stats: the aggregate projects data                                             
    page: paginator                                                                
    '''
    org = get_object_or_404(Organisation, pk=getattr(settings, 'WALKING_FOR_WATER_ID', 0))
    projects = org.published_projects().funding()
    page = project_list_data(request, projects)
    active_projects = projects.status_not_cancelled().status_not_archived()
    return {
        'page': page,
        'org': org,
        'active_projects': active_projects,
        'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
    }

@render_to('rsr/organisation/landing_pages/rabobank.html')
def rabobank(request):
    '''List of all projects associated with Rabobank 
    Context:
    projects: list of all projects
    stats: the aggregate projects data
    page: paginator
    '''
    org = get_object_or_404(Organisation, pk=getattr(settings, 'RABOBANK_ID', 0))
    projects = org.published_projects().funding()
    delivered_business_people = projects.status_complete().get_largest_value_sum(getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people running sustainable business'))
    upcoming_business_people = projects.active().get_largest_value_sum(getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people running sustainable business')) - delivered_business_people
    # round to nearest whole 1000
    # people_served = int(people_served / 1000) * 1000
    page = project_list_data(request, projects)
    active_projects = projects.status_not_cancelled().status_not_archived()
    return {
        'page': page,
        'org': org,
        'upcoming_business_people': upcoming_business_people,
        'delivered_business_people': delivered_business_people,
        'projects_total_total_budget': round(projects.total_total_budget() / 100000) / 10.0,
        'active_projects': active_projects,
        'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
    }
        
@render_to('rsr/project/project_directory.html')
def projectlist(request):
    '''List of relevant projects in RSR
    To preserve good url practice (one url == one dataset); links for the sorting is handled in the template.
    '''
    # Get relevant projects
    projects = Project.objects.published().status_not_archived().funding().select_related()
    # Get projects either by using the query or all
    query_string = ''
    if ('q' in request.GET) and request.GET['q'].strip():
        query_string = request.GET['q']
    #project_query = get_query(query_string, ['name', 'subtitle','country__name','city','state','goals_overview','current_status_detail','project_plan_detail','sustainability','context','notes',])
    project_query = get_query(query_string, ['name', 'subtitle','country__name','city','state',])
    projects = projects.filter(project_query)
    # Add extra last_update column
    projects = projects.extra(select={'last_update':'SELECT MAX(time) FROM rsr_projectupdate WHERE project_id = rsr_project.id'})
    # Setup sort query
    order_by = request.GET.get('order_by', 'name')
    last_order = request.GET.get('last_order')
    sort = request.GET.get('sort', 'asc')
    # sort desv or asc
    if sort == 'asc':
        projects = projects.order_by(order_by, 'name')
    else:
        projects = projects.order_by('-%s' % order_by, 'name')
    # Setup paginator
    PROJECTS_PER_PAGE = 10
    paginator = Paginator(projects, PROJECTS_PER_PAGE)
    page = paginator.page(request.GET.get('page', 1))
    return {
        'site_section': 'projects',
        'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
        'page': page,
        'query_string': query_string,
        'request_get': request.GET,
        'sort': sort,
        'order_by': order_by,
        'last_order': last_order,
    }

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
        orgs = orgs.supportpartners()
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
        org_query = get_query(query_string, ['name', 'long_name','locations__country__name','locations__city','locations__state','contact_person','contact_email',])
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
        'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
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
    if order_by not in ['name','organisation_type','country','country__continent']:
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
        orgs = orgs.order_by(sort_order_value+order_by, 'organisation_type','country','country__continent')
    elif order_by == 'organisation_type':
        orgs = orgs.order_by(sort_order_value+order_by,'country__continent','country','name')
    elif order_by == 'country':
        orgs = orgs.order_by(sort_order_value+order_by,'organisation_type','name')
    elif order_by == 'country__continent':
        orgs = orgs.order_by(sort_order_value+order_by,'country','organisation_type','name')
    
    return {
        'orgs': orgs,
        'order_by': order_by,
        'sort': sort_order,
        'mode': mode,
        'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
    }


class SigninForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'})) 
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'}))


from django.contrib.auth import REDIRECT_FIELD_NAME
from django.views.decorators.cache import never_cache
#copied from django.contrib.auth.views to be able to customize the form widget attrs
def login(request, template_name='registration/login.html', redirect_field_name=REDIRECT_FIELD_NAME):
    "Displays the login form and handles the login action."
    redirect_to = request.REQUEST.get(redirect_field_name, '')
    # Check for exeptions to the return to start of sign in process
    if redirect_to == "/rsr/accounts/register/complete/":
        redirect_to = "/"
    
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        # RSR mod to add css class to widgets
        form.fields['username'].widget.attrs = {'class': 'signin_field input'}
        form.fields['password'].widget.attrs = {'class': 'signin_field input'}
        if form.is_valid():
            # Light security check -- make sure redirect_to isn't garbage.
            if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
                redirect_to = getattr(settings, 'LOGIN_REDIRECT_URL', '/rsr/')
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
    Redirects to /rsr/
    '''
    logout(request)
    return HttpResponseRedirect('/')

def register1(request):
    '''
    The user chooses organisation as a preliminary step to registering an Akvo RSR account.
    '''
    if request.method == 'POST':
        form = OrganisationForm(data=request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/rsr/accounts/register2/?org_id=%d' % form.cleaned_data['organisation'].id)
    else:
        form = OrganisationForm()    
    context = RequestContext(request)
    return render_to_response('registration/registration_form1.html', { 'form': form }, context_instance=context)

def register2(request,
        form_class=RSR_RegistrationFormUniqueEmail,
        template_name='registration/registration_form2.html',
    ):
    org_id = request.GET.get('org_id', None)
    if not org_id:
        return HttpResponseRedirect('/rsr/accounts/register1/')
    organisation = Organisation.objects.get(pk=org_id)
    if request.method == 'POST':
        form = form_class(data=request.POST, files=request.FILES)
        if form.is_valid():
            new_user = form.save(request)
            return HttpResponseRedirect('/rsr/accounts/register/complete/')
    else:
        form = form_class(initial={'org_id': org_id})
    context = RequestContext(request)
    return render_to_response(template_name,
                              { 'form': form, 'organisation': organisation, },
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
    
    activation_key = activation_key.lower() # Normalize before trying anything with it.

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
                              { 'account': account,
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
    success_url='/rsr/accounts/update/complete/',
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
            'first_name':user.first_name,
            'last_name':user.last_name,
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
            'profile': user.get_profile()
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
    project     = get_object_or_404(Project, pk=project_id)
    updates     = project.project_updates.all().order_by('-time')
    comments    = project.projectcomment_set.all().order_by('-time')[:3]
    can_add_update = project.connected_to_user(request.user)
    return {
        'project': project,
        'updates': updates,
        'can_add_update':can_add_update,
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
    comments = project.projectcomment_set.all().order_by('-time')[:3]
    edit_timeout   = settings.PROJECT_UPDATE_TIMEOUT
    return {
        'project'               : project,
        'update'                : update,
        'can_add_update'        : can_add_update, 
        'can_edit_update'       : can_edit_update,
        'hide_latest_updates'   : True,
        'site_section'          : 'projects', 
        'comments'              : comments,
        'edit_timeout'          : edit_timeout
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
    comments = Project.objects.get(id=project_id).projectcomment_set.all().order_by('-time')
    form = CommentForm()
    updates = project.project_updates.all().order_by('-time')[:3]
    return {
        'project': project, 
        'comments': comments, 
        'form': form, 
        'project_section':'comments', 
        'hide_comments': True,
        'updates': updates,
        }


@login_required()
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

    if not user_is_authorized:
        return redirect('access_denied')

    if update_id is not None:
        edit_mode = True
        update = get_object_or_404(ProjectUpdate, id=update_id)

        if not (user_is_authorized and request.user == update.user):
            return redirect('access_denied')

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


class MobileProjectForm(forms.Form):
    project         = forms.ChoiceField(required=False, widget=forms.Select())

    def __init__(self, *args, **kwargs):
        profile = kwargs.pop('profile', None)
        forms.Form.__init__(self, *args, **kwargs)
        if profile and profile.available_gateway_numbers():
            self.fields['project'].choices = ((u'', u'---------'),) + tuple([(p.id, "%s - %s" % (unicode(p.pk), p.name)) for p in profile.my_unreported_projects()])

    def clean(self):
        """
        
        """
        return self.cleaned_data            
            
class MobileNumberForm(forms.Form):
    phone_number    = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'input', 'size':'25', 'maxlength':'15',}))

    def clean(self):
        """
        
        """
        cd = self.cleaned_data
        if not 'phone_number' in cd:
            raise forms.ValidationError(_(u'Field phone_number missing from MobileForm.'))        
        if cd['phone_number']:
            if self.has_changed():
                try:
                    UserProfile.objects.get(phone_number=cd['phone_number'])
                except:
                    pass
                else:
                    raise forms.ValidationError(_(u'The phone number %s is already registered for updating. Please check the number entered.' % cd['phone_number']))
        else:
            pass # disable updating for this user
        return self.cleaned_data            

@login_required()
def myakvo_mobile_number(request):
    '''
    Add (or change) mobile phone number for SMS reporting
    '''
    profile = request.user.get_profile()
    if request.method == 'POST':
        form = MobileNumberForm(request.POST, request.FILES, initial={'phone_number': profile.phone_number})
        if form.is_valid():
            # workflow for mobile Akvo
            if 'phone_number' in form.changed_data:
                if form.cleaned_data['phone_number']: # phone number added or changed
                    profile.add_phone_number(form.cleaned_data['phone_number'])
                else: # phone number removed
                    profile.disable_sms_update_workflow()
                #always save change to phone number
                profile.phone_number = form.cleaned_data['phone_number']
                profile.save()
            return HttpResponseRedirect(reverse('myakvo_mobile'))
    else:
        form = MobileNumberForm(initial={'phone_number': profile.phone_number},)
    return render_to_response('rsr/myakvo/mobile_number.html', {'form': form, }, RequestContext(request))

@login_required()
def myakvo_mobile(request):
    '''
    Handle the selection of projects for SMS reporting
    '''
    profile = request.user.get_profile()
    form_data = {'phone_number': profile.phone_number}
    notices = Notice.objects.notices_for(request.user, on_site=True)
    
    if request.method == 'POST':
        form = MobileProjectForm(request.POST, request.FILES, profile=profile)
        if form.is_valid():
            project = Project.objects.get(pk=form.cleaned_data['project'])
            profile.create_reporter(project)
            return HttpResponseRedirect('./')
    else:
        form = MobileProjectForm(form_data, profile=profile)
    return render_to_response(
        'rsr/myakvo/mobile.html', {
            'profile': profile,
            'form': form,
            'sms_updating_enabled': state_equals(profile, profile.STATE_UPDATES_ENABLED),
            'notices': notices,
        }, RequestContext(request))

@login_required()
def myakvo_cancel_reporter(request, reporter_id):
    '''
    '''
    profile = request.user.get_profile()
    reporter = SmsReporter.objects.get(id=reporter_id)
    profile.destroy_reporter(reporter)
    return HttpResponseRedirect(reverse('myakvo_mobile'))
    
class CommentForm(ModelForm):

    comment = forms.CharField(widget=forms.Textarea(attrs={
        'class':'textarea',
        'rows':'5',
        'cols':'75',
        #'width': '480px',
        #'style': 'margin:0 auto;'
    }))    
    class Meta:
        model   = ProjectComment
        exclude = ('time', 'project', 'user', )

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
            comment.time = datetime.now()
            comment.user = request.user
            comment.save()
    return HttpResponseRedirect(reverse('project_comments', args=[project_id]))

#def org_activities(organisation):
#    # assoc resolves to all projects associated with organisation, where organisation can function in any of the three partner functions
#    assoc = organisation.published_projects()
#    orgs = Organisation.objects.all()
#    # partners resolves to all orgs that are partners of any kind to the list of projects in assoc
#    partners = (orgs.filter(field_partners__project__in = assoc.values('pk').query) | \
#                orgs.filter(support_partners__project__in = assoc.values('pk').query) | \
#                orgs.filter(funding_partners__project__in = assoc.values('pk').query)).distinct()
#    # remove organisation from queryset
#    return assoc, partners.exclude(id=organisation.id)

    
@render_to('rsr/organisation/organisation.html')
def orgdetail(request, org_id):
    o = get_object_or_404(Organisation, pk=org_id)
    org_projects = o.published_projects().status_not_cancelled().status_not_complete()
    #org_projects = org_projects.status_not_cancelled().status_not_complete()
    org_partners = o.partners().distinct()
    return {
        'org': o, 
        'o': o, #TODO: fix template and remove
        'org_projects': org_projects, 
        'org_partners': org_partners,
        'site_section': 'projects',
        }

@render_to('rsr/project/project_main.html')
def projectmain(request, project_id):
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
    slider_width: used by the thumbnail image slider
    '''
    project = get_object_or_404(Project, pk=project_id)
    related = Project.objects.filter(categories__in=Category.objects.filter(projects=project)).distinct().exclude(pk=project.pk).published()
    related = get_random_from_qs(related, 2)
    all_updates = project.project_updates.all().order_by('-time')
    updates_with_images = all_updates.exclude(photo__exact='').order_by('-time')
    #slider_width = (len(updates_with_images) + 1) * 115    
    comments = project.projectcomment_set.all().order_by('-time')[:3]
    # comprehensions are fun! here we use it to get the categories that 
    # don't contain only 0 value benchmarks
    benchmarks = project.benchmarks.filter(
        category__in=[category for category in project.categories.all()
        if project.benchmarks.filter(category=category) \
            .aggregate(Sum('value'))['value__sum']
        ])

    # a little model meta data magic
    opts = project._meta
    if request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
        admin_change_url = reverse('admin:rsr_project_change', args=(project.id,)),
        admin_change_url = admin_change_url[0] #don't friggin ask why!!!
    else:
        admin_change_url = None
    return {
        'project'               : project,
        'p'                     : project, #compatibility with new_look
        'related'               : related,
        'updates'               : all_updates[:3],
        'benchmarks'            : benchmarks,
        'updates_with_images'   : updates_with_images,
        'can_add_update'        : project.connected_to_user(request.user),
        'admin_change_url'      : admin_change_url,
        'comments'              : comments, 
        'site_section'          : 'projects',
        #'slider_width'          : slider_width,
    }

def projectdetails(request, project_id):
    "Fix for old url with project details"
    return http.HttpResponsePermanentRedirect ('/rsr/project/%s/' % project_id )


@render_to('rsr/project/project_partners.html')  
def projectpartners(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    updates = project.project_updates.all().order_by('-time')[:3]
    comments = project.projectcomment_set.all().order_by('-time')[:3]
    return { 
        'project': project, 
        'site_section': 'projects', 
        'updates': updates, 
        'hide_project_partners': True,
        'can_add_update': project.connected_to_user(request.user),
        'comments': comments,
    }

@render_to('rsr/project/project_funding.html')  
def projectfunding(request, project_id):
    project = get_object_or_404(Project, pk=project_id)    
    public_donations = project.public_donations()
    updates = project.project_updates.all().order_by('-time')[:3]
    comments = project.projectcomment_set.all().order_by('-time')[:3]
    return { 
        'can_add_update': project.connected_to_user(request.user),
        'comments': comments,
        'hide_funding_link': True,
        'project': project, 
        'public_donations': public_donations, 
        'site_section': 'projects', 
        'updates': updates,
    }

def getwidget(request, project_id):
    '''
    user_level is None, 1 or 2. No user level check on step 2
    '''
    if not request.POST:
        try:
            account_level = request.user.get_profile().organisation.organisationaccount.account_level
        except:
            account_level = 'free'
        project = get_object_or_404(Project.objects, pk=project_id)
        orgs = project.all_partners()
        return render_to_response('rsr/project/get-a-widget/machinery_step1.html', {
                'project': project,
                'account_level': account_level, 'organisations': orgs,
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
        project = get_object_or_404(Project, pk=project_id)
        return render_to_response('rsr/project/get-a-widget/machinery_step2.html', {
            'project': project,
            'organisation':o, 
            'widget_choice': widget_choice, 
            'widget_type': widget_type, 
            'widget_site': widget_site,
            'site_section': 'projects',
        }, context_instance=RequestContext(request))

def fundingbarimg(request):
    '''
    create an image for use in the funding bar graphic
    '''
    import Image, ImageDraw 

    size = (100,20)             # size of the image to create
    im = Image.new('RGB', size, '#fff') # create the image
    draw = ImageDraw.Draw(im)   # create a drawing object that is
                                # used to draw on the new image
    # Now, we'll do the drawing:
    pct = request.GET.get('pct', 0)
    if pct:
        box = [(0,0),(min(int(pct), 100),20)]
        draw.rectangle(box, fill='#99ff99')
    
    del draw # I'm done drawing so I don't need this anymore
    
    # We need an HttpResponse object with the correct mimetype
    response = HttpResponse(mimetype="image/png")
    # now, we tell the image to save as a PNG to the 
    # provided file-like object
    im.save(response, 'PNG')

    return response # and we're done!
    
def templatedev(request, template_name):
    "Render a template in the dev folder. The template rendered is template_name.html when the path is /rsr/dev/template_name/"
    dev = {'path': 'dev/'}
    SAMPLE_PROJECT_ID = 2
    SAMPLE_ORG_ID = 42
    p = Project.objects.get(pk=SAMPLE_PROJECT_ID)
    updates     = Project.objects.get(id=SAMPLE_PROJECT_ID).project_updates.all().order_by('-time')[:3]
    comments    = Project.objects.get(id=SAMPLE_PROJECT_ID).projectcomment_set.all().order_by('-time')[:3]
    grid_projects = Project.objects.filter(current_image__startswith='img').order_by('?')[:12]

    projects = Project.objects.published()
    stats = akvo_at_a_glance(projects)

    orgs = Organisation.objects.all()

    o = Organisation.objects.get(pk=SAMPLE_ORG_ID)
    org_projects, org_partners = org_activities(o)
    org_stats = akvo_at_a_glance(org_projects)
    
    return render_to_response('dev/%s.html' % template_name,
        {'dev': dev, 'p': p, 'updates': updates, 'comments': comments, 'projects': projects, 'stats': stats, 'orgs': orgs, 'o': o, 'org_projects': org_projects, 'org_partners': org_partners, 'org_stats': org_stats, 'grid_projects': grid_projects, }, context_instance=RequestContext(request))

class HttpResponseNoContent(HttpResponse):
    status_code = 204
    

def select_project_widget(request, org_id, template=''):
    o = get_object_or_404(Organisation, pk=org_id) #TODO: better error handling for widgets than straight 404
    org_projects = o.published_projects()
    project = random.choice(org_projects)
    get = request.GET.copy() #needed to be able to modify the dict
    template = get.pop('widget', ['feature-side'])[0] #get.pop returns a list
    return HttpResponseRedirect('%s?%s' % (reverse('project_widget', args=[template, project.id]), get.urlencode()))

def project_widget(request, template='feature-side', project_id=None):
    if project_id:
        p = get_object_or_404(Project, pk=project_id)
    else:
        p = random.choice(Project.objects.published().status_not_archived().status_not_cancelled())
    bgcolor = request.GET.get('bgcolor', 'B50000')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    site = request.GET.get('site', 'www.akvo.org')
    
    return render_to_response('widgets/%s.html' % template.replace('-', '_'),
        {
            'project': p,
            'p': p, #compatibility with new_look
            'request_get': request.GET,
            'bgcolor': bgcolor,
            'textcolor': textcolor,
            'site': site
        },
        context_instance=RequestContext(request))

def project_list_widget(request, template='project-list', org_id=0):
    bgcolor = request.GET.get('bgcolor', 'B50000')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    site = request.GET.get('site', 'www.akvo.org')
    if int(org_id):
        o = get_object_or_404(Organisation, pk=org_id)
        #p = o.published_projects().status_not_archived().status_not_cancelled().funding()
        p = o.published_projects()
        p = p.status_not_archived().status_not_cancelled().funding()

    else:
        p = Project.objects.published().status_not_archived().status_not_cancelled().funding()
    order_by = request.GET.get('order_by', 'name')
    #p = p.annotate(last_update=Max('project_updates__time'))
    p = p.extra(select={'last_update':'SELECT MAX(time) FROM rsr_projectupdate WHERE project_id = rsr_project.id'})
    if order_by == 'country__continent':		
        p = p.order_by(order_by, 'country__name','name')
    #elif order_by == 'country__name':
    #    p = p.order_by(order_by,'name')
    #elif order_by == 'status':
    #    p = p.order_by(order_by,'name')
    elif order_by == 'last_update':
        p = p.order_by('-last_update', 'name')
    elif order_by in ['total_budget', 'funds_needed']:
        p = p.extra(order_by = ['-%s' % order_by, 'name'])
    else:
        p = p.order_by(order_by, 'name')
    return render_to_response('widgets/%s.html' % template.replace('-', '_'),
        {
            'bgcolor': bgcolor, 
            'textcolor': textcolor,  
            'projects': p,
            'org_id': org_id, 
            'request_get': request.GET, 
            'site': site,
            'lang': get_language(),
            'RSR_CACHE_SECONDS': getattr(settings, 'RSR_CACHE_SECONDS', 300),
        },
        context_instance=RequestContext(request))

@render_to('widgets/project_map.html')
def project_map_widget(request, org_id):
    bgcolor = request.GET.get('bgcolor', 'B50000')
    height = request.GET.get('height', '300')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    width = request.GET.get('width', '600')
    zoom = request.GET.get('zoom', '1')
    state = request.GET.get('state', 'static')

    if state != 'dynamic':
        state = 'static'
    
    try:
        map_height = int(height)-24 # Since we have a bottom bar of 24px
    except ValueError, e:
        map_height = 276 # 326px = default height(350px) - bottom bar(24px)
    
    return { 
        'bgcolor': bgcolor,
        'height': map_height,
        'org': get_object_or_404(Organisation, pk=org_id), 
        'textcolor': textcolor,
        'width': width,
        'zoom': zoom,
        'state': state,
        }

        
@fetch_project
@render_to('rsr/project/donate/donate_step1.html')
def setup_donation(request, p):
    if p not in Project.objects.published().status_not_cancelled().status_not_archived().need_funding():
        return redirect('project_main', project_id=p.id)
    request.session['original_http_referer'] = request.META.get('HTTP_REFERER', None)
    return {'project': p}

@fetch_project
def donate(request, p, engine, has_sponsor_banner=False):
    if p not in Project.objects.published().status_not_cancelled().status_not_archived().need_funding():
        return redirect('project_main', project_id=p.id)
    if get_object_or_404(Organisation, pk=getattr(settings, 'LIVE_EARTH_ID', 0)) in p.sponsor_partners():
        has_sponsor_banner = True
    if request.method == 'POST':
        donate_form = InvoiceForm(data=request.POST, project=p, engine=engine)
        if donate_form.is_valid():
            description = u'Akvo-%d-%s' % (p.id, p.name)
            cd = donate_form.cleaned_data
            invoice = donate_form.save(commit=False)
            invoice.project = p
            invoice.engine = engine
            invoice.name = cd['name']
            invoice.email = cd['email']
            invoice.campaign_code = cd['campaign_code']
            invoice.is_anonymous = not cd['is_public']
            original_http_referer = request.session.get('original_http_referer', None)
            if original_http_referer:
                invoice.http_referer = original_http_referer
                del request.session['original_http_referer']
            else:
                invoice.http_referer = request.META.get('HTTP_REFERER', None)
            if getattr(settings, 'DONATION_TEST', False):
                invoice.test = True
            if engine == 'ideal':
                invoice.bank = cd['bank']
                mollie_dict = {
                    'amount': invoice.amount * 100,
                    'bank_id': invoice.bank,
                    'partnerid': invoice.gateway,
                    'description': description,
                    'reporturl': getattr(settings, 'MOLLIE_REPORT_URL', 'http://www.akvo.org/rsr/mollie/report/'),
                    'returnurl': getattr(settings, 'MOLLIE_RETURN_URL', 'http://www.akvo.org/rsr/donate/ideal/thanks/'),
                }
                try:
                    mollie_response = query_mollie(mollie_dict, 'fetch')
                    invoice.transaction_id = mollie_response['transaction_id']
                    order_url = mollie_response['order_url']
                    invoice.save()
                except:
                    return redirect('donate_500')
                return render_to_response('rsr/project/donate/donate_step3.html',
                    {
                        'invoice': invoice,
                        'project': p,
                        'payment_engine': engine,
                        'mollie_order_url': order_url,
                        'has_sponsor_banner': has_sponsor_banner,
                        'live_earth_enabled': getattr(settings, 'LIVE_EARTH_ENABLED', False)
                    },
                    context_instance=RequestContext(request))
            elif engine == 'paypal':
                invoice.save()
                pp_dict = {
                    'cmd': getattr(settings, 'PAYPAL_COMMAND', '_donations'),
                    'currency_code': invoice.currency,
                    'business': invoice.gateway,
                    'amount': invoice.amount,
                    'item_name': description,
                    'invoice': int(invoice.id),
                    'lc': invoice.locale,
                    'notify_url': getattr(settings, 'PAYPAL_NOTIFY_URL', 'http://www.akvo.org/rsr/donate/paypal/ipn/'),
                    'return_url': getattr(settings, 'PAYPAL_RETURN_URL', 'http://www.akvo.org/rsr/donate/paypal/thanks/'),
                    'cancel_url': getattr(settings, 'PAYPAL_CANCEL_URL', 'http://www.akvo.org/'),
                }
                pp_form = PayPalPaymentsForm(initial=pp_dict)
                if getattr(settings, 'PAYPAL_TEST', False):
                    pp_button = pp_form.sandbox()
                else:
                    pp_button = pp_form.render()
                action = request.POST.get('action', None)
                return render_to_response('rsr/project/donate/donate_step3.html',
                                      {'invoice': invoice,
                                       'payment_engine': engine,
                                       'pp_form': pp_form, 
                                       'pp_button': pp_button,
                                       'project': p,
                                       'has_sponsor_banner': has_sponsor_banner,
                                       'live_earth_enabled': settings.LIVE_EARTH_ENABLED},
                                      context_instance=RequestContext(request))
    else:
        donate_form = InvoiceForm(project=p,
                                  engine=engine,
                                  initial=dict(is_public=True))
    return render_to_response('rsr/project/donate/donate_step2.html',
                              {'donate_form': donate_form,
                               'payment_engine': engine,
                               'project': p,
                               'has_sponsor_banner': has_sponsor_banner,
                               'live_earth_enabled': getattr(settings, 'LIVE_EARTH_ENABLED', False)
                            }, 
                            context_instance=RequestContext(request))

def void_invoice(request, invoice_id, action=None):
    invoice = get_object_or_404(Invoice, pk=invoice_id)
    if invoice.status == 1:
        invoice.status = 2
        invoice.save()
        if action == 'back':
            return redirect('complete_donation', project_id=invoice.project.id,
                engine=invoice.engine)
        elif action == 'cancel':
            return redirect('project_main', project_id=invoice.project.id)
    return redirect('project_list', slug='all')

def mollie_report(request):
    transaction_id = request.GET.get('transaction_id', None)
    if transaction_id:
        invoice = Invoice.objects.get(transaction_id=transaction_id)
        request_dict = {'partnerid': invoice.gateway,
            'transaction_id': transaction_id}
        try:
            mollie_response = query_mollie(request_dict, 'check')
        except:
            return HttpResonseServerError
        if mollie_response['paid'] == 'true':
            mollie_fee = get_mollie_fee()
            invoice.amount_received = invoice.amount - mollie_fee
            invoice.status = 3
        else:
            invoice.status = 2
        invoice.save()
        return HttpResponse('OK')
    return HttpResponseServerError

@csrf_exempt
@require_POST
def paypal_thanks(request):
    invoice_id = request.POST.get('invoice', None)
    if invoice_id:
        invoice = Invoice.objects.get(pk=invoice_id)
        return render_to_response('rsr/project/donate/donate_thanks.html',
                                  {'invoice': invoice,
                                   'project': invoice.project,
                                   'user': invoice.user},
                                  context_instance=RequestContext(request))
    return redirect('/')

@require_GET
@render_to('rsr/project/donate/donate_thanks.html')
def mollie_thanks(request):
    transaction_id = request.GET.get('transaction_id', None)
    if transaction_id:
        invoice = Invoice.objects.get(transaction_id=transaction_id)
        return {'invoice': invoice, 'project': invoice.project, 'user': invoice.user}
    return redirect('/')

@render_to('rsr/global_map.html')
def global_map(request):
    projects = Project.objects.published()
    marker_icon = getattr(settings, 'GOOGLE_MAPS_MARKER_ICON', '')
    return {'projects': projects, 'marker_icon': marker_icon}

@render_to('rsr/akvo_at_a_glance.html')
def data_overview(request):
    projects = Project.objects.published().funding()
    orgs = Organisation.objects.all()
    rsr_cache_seconds = getattr(settings, 'RSR_CACHE_SETTINGS', 300)
    template_context = dict(orgs=orgs, projects=projects,
        RSR_CACHE_SECONDS=rsr_cache_seconds)
    return template_context
