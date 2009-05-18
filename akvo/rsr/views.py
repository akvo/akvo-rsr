# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Organisation, Project, ProjectUpdate, ProjectComment, FundingPartner, MoSmsRaw, PHOTO_LOCATIONS, STATUSES, UPDATE_METHODS
from akvo.rsr.models import UserProfile, MoMmsRaw, MoMmsFile
from akvo.rsr.forms import OrganisationForm, RSR_RegistrationFormUniqueEmail, RSR_ProfileUpdateForm# , RSR_RegistrationForm, RSR_PasswordChangeForm, RSR_AuthenticationForm, RSR_RegistrationProfile

from django import forms
#from django import oldforms
from django.conf import settings
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm, SetPasswordForm, PasswordChangeForm
from django.http import HttpResponse, HttpResponseRedirect, HttpResponsePermanentRedirect
from django.template import RequestContext
from django.forms import ModelForm
from django.shortcuts import render_to_response, get_object_or_404
from django.core.mail import send_mail
from django.core.paginator import Paginator
from django.core.urlresolvers import reverse
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.contrib.auth.decorators import login_required


from BeautifulSoup import BeautifulSoup
from datetime import datetime
import time
import feedparser
from registration.models import RegistrationProfile
import random

REGISTRATION_RECEIVERS = ['gabriel@akvo.org', 'thomas@akvo.org', 'beth@akvo.org']

# PAUL
from akvo.rsr.models import PayPalInvoice
from paypal.standard.forms import PayPalPaymentsForm

from django import http
from django.template import Context, loader

def server_error(request, template_name='500.html'):
    '''
    Daniel
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
                return render_to_response(output[1], output[0], RequestContext(request))
            elif isinstance(output, dict):
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

@render_to('rsr/index.html')
def index(request):
    '''
    The RSR home page.
    Context:
    latest: the latest entry from the akvo.org/blog feed
    soup: the blog entry HTML
    img_src: the url to the first image of the blog entry
    '''
    #from dbgp.client import brk
    #brk(host="192.168.1.123", port=9000)
    
    ##### old code supporting two versions of the home page. removed for now #####
    #bandwidth = request.session.get('bandwidth', False)
    # is this a returned user?
    #if not bandwidth:
    #    # nope, no session. so are we returning from cookie test?
    #    if request.session.test_cookie_worked():
    #        # new user, with cookies enabled
    #        request.session['bandwidth'] = bandwidth = 'low'
    #        request.session.delete_test_cookie()
    #        return HttpResponseRedirect('/rsr/')
    #    else:
    #        # virgin user or no cookies?
    #        no_cookie = request.GET.get('nocookie')
    #        if not no_cookie:
    #            # brand new user, test for cookieness
    #            return HttpResponseRedirect('/rsr/settestcookie/')
    #        elif no_cookie != 'True':
    #            return HttpResponseRedirect('/rsr/?nocookie=True')
    #        else:
    #            bandwidth = 'low'
    ###############################################################################
    bandwidth = 'low'
    try:
        # Create exception to avoid loading the blogs whe we run in debug mode.
        # Speeds up the home page considerably when pulling over the inteweb
        if settings.DEBUG:
            raise
        feed = feedparser.parse("http://www.akvo.org/blog?feed=rss2")
        latest1 = feed.entries[0]
        soup = BeautifulSoup(latest1.content[0].value)
        img_src1 = soup('img')[0]['src']
        latest2 = feed.entries[1]
        soup = BeautifulSoup(latest2.content[0].value)
        img_src2 = soup('img')[0]['src']
        
        le_feed = feedparser.parse("http://www.akvo.org/blog?feed=rss2")
        le_latest1 = le_feed.entries[0]
        le_latest2 = le_feed.entries[1]
    except:
        soup = img_src1 = img_src2 = ''
        le_latest1 = le_latest2 = {
            'title': _('The blog is not available at the moment.'),
        }
        latest1 = latest2 = {
            'author': '',
            'summary': _('The blog is not available at the moment.'),
        }
    projs = Project.objects.published()
    if bandwidth == 'low':
        #TODO: better filtering criteria, we want to find all projects that have an image
        unfunded_visible_projs = projs.need_funding().filter(current_image__startswith='db')
        if len(unfunded_visible_projs) > 7:
            grid_projects = unfunded_visible_projs.order_by('?')[:8]
        else:
            grid_projects = projs.filter(current_image__startswith='db').order_by('?')[:8]
    else:
        grid_projects = None
    #stats = akvo_at_a_glance(p)
    #return render_to_response('rsr/index.html', {'latest': latest, 'img_src': img_src, 'soup':soup, }, context_instance=RequestContext(request))
    return {
        'latest1': latest1,
        'img_src1': img_src1,
        'latest2': latest2,
        'img_src2': img_src2,
        'le_latest1': le_latest1,
        'le_latest2': le_latest2,
        'bandwidth': bandwidth,
        'grid_projects': grid_projects,
        'orgs': Organisation.objects,
        'projs': projs,
        'version': settings.URL_VALIDATOR_USER_AGENT,
    }

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

@render_to('rsr/liveearth.html')
def liveearth(request):
    '''
    List of all projects in RSR
    Context:
    projects: list of all projects
    stats: the aggregate projects data
    page: paginator
    '''
    live_earth = Organisation.objects.get(pk=settings.LIVE_EARTH_ID)
    projs = live_earth.all_projects().funding()
    page = project_list_data(request, projs)
    return {'projs': projs, 'orgs': live_earth.partners(), 'page': page, }


    
@render_to('rsr/project_directory.html')
def projectlist(request):
    '''
    List of all projects in RSR
    Context:
    projects: list of all projects
    stats: the aggregate projects data
    page: paginator
    '''
    projs = Project.objects.published().funding()
    showcases = projs.need_funding().order_by('?')[:3]
    page = project_list_data(request, projs)
    return {'projs': projs, 'orgs': Organisation.objects, 'page': page, 'showcases': showcases,}

@render_to('rsr/project_directory.html')
def filteredprojectlist(request, org_id):
    '''
    List of  projects in RSR
    filtered on an organisation
    Context:
    projs: list of all projects
    page: paginator
    o: organisation
    '''
    #for use in akvo at a glance
    projs = Project.objects.published().funding()
    # get all projects the org is asociated with
    o = Organisation.objects.get(pk=org_id)
    projects = o.published_projects().funding()
    showcases = projects.order_by('?')[:3]
    page = project_list_data(request, projects)
    return {'projs': projs, 'orgs': Organisation.objects, 'page': page, 'showcases': showcases, 'o': o,}

@render_to('rsr/organisation_directory.html')
def orglist(request, org_type='all'):
    '''
    List of all projects in RSR
    Context:
    orgs: list of all organisations
    stats: the aggregate projects data
    page: paginated orgs
    '''
    orgs = Organisation.objects
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
    try:
        order_by = request.GET.get('order_by', 'name')
        orgs = orgs.order_by(order_by, 'name')
    except:
        pass
    ORGS_PER_PAGE = 20
    paginator = Paginator(orgs, ORGS_PER_PAGE)
    page = paginator.page(request.GET.get('page', 1))
    projs = Project.objects.published()
    return {'projs': projs, 'orgs': orgs, 'org_type': org_type, 'page': page}

class SigninForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'})) 
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'}))


from django.contrib.auth import REDIRECT_FIELD_NAME
from django.views.decorators.cache import never_cache
#copied from django.contrib.auth.views to be able to customize the form widget attrs
def login(request, template_name='registration/login.html', redirect_field_name=REDIRECT_FIELD_NAME):
    "Displays the login form and handles the login action."
    redirect_to = request.REQUEST.get(redirect_field_name, '')
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        # RSR mod to add css class to widgets
        form.fields['username'].widget.attrs = {'class': 'signin_field input'}
        form.fields['password'].widget.attrs = {'class': 'signin_field input'}
        if form.is_valid():
            # Light security check -- make sure redirect_to isn't garbage.
            if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
                redirect_to = settings.LOGIN_REDIRECT_URL
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
    if Site._meta.installed:
        current_site = Site.objects.get_current()
    else:
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
    return HttpResponseRedirect('/rsr/')

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
            new_user = form.save()
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
                                'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS },
                              context_instance=context)    
    
    #activation_key = activation_key.lower() # Normalize before trying anything with it.
    #user = RegistrationProfile.objects.activate_user(activation_key)
    #if user:
    #    #Since we want to verify the user before letting anyone in we set is_active
    #    #to False (it is set to True by RegistrationProfile.objects.activate_user)
    #    user.is_active = False
    #    user.save()
    #    current_site = Site.objects.get_current()
    #    subject = 'Akvo user email confirmed'                
    #    message = 'A user, %s, has confirmed her email. Check it out!' % user.username
    #    send_mail(subject, message, 'noreply@%s' % current_site, REGISTRATION_RECEIVERS)
    #if extra_context is None:
    #    extra_context = {}
    #context = RequestContext(request)
    #for key, value in extra_context.items():
    #    context[key] = callable(value) and value() or value
    #return render_to_response(template_name,
    #                          { 'account': user,
    #                            'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS },
    #                          context_instance=context)


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
def update_user_profile(request,
                        success_url='/rsr/accounts/update/complete/',
                        form_class=RSR_ProfileUpdateForm,
                        template_name='registration/update_form.html',
                        extra_context=None
                       ):
    if request.method == 'POST':
        form = form_class(data=request.POST, files=request.FILES)
        if form.is_valid():
            updated_user = form.update(request.user)
            return HttpResponseRedirect(success_url)
    else:
        form = form_class(initial={
            'first_name':request.user.first_name,
            'last_name':request.user.last_name,
        })
    if extra_context is None:
        extra_context = {}
    context = RequestContext(request)
    for key, value in extra_context.items():
        context[key] = callable(value) and value() or value
    return render_to_response(template_name, {'form': form}, context_instance=context)

@render_to('rsr/project_updates.html')
def projectupdates(request, project_id):
    '''
    List of all updates for a project
    Context:
    p: project
    updates: list of updates, ordered by time in reverse
    '''
    p           = get_object_or_404(Project, pk=project_id)
    updates     = Project.objects.get(id=project_id).project_updates.all().order_by('-time')
    return {'p': p, 'updates': updates, }
    
@render_to('rsr/project_comments.html')
def projectcomments(request, project_id):
    '''
    List of all updates for a project
    Context:
    p: project
    updates: list of updates, ordered by time in reverse
    '''
    p           = get_object_or_404(Project, pk=project_id)
    comments    = Project.objects.get(id=project_id).projectcomment_set.all().order_by('-time')
    form        = CommentForm()
    return {'p': p, 'comments': comments, 'form': form, }

class UpdateForm(ModelForm):

    js_snippet = "return taCount(this,'myCounter')"
    js_snippet = mark_safe(js_snippet)    
    title           = forms.CharField(
                        widget=forms.TextInput(
                            attrs={'class':'input', 'maxlength':'50', 'size':'25', 'onKeyPress':'return taLimit(this)', 'onKeyUp':js_snippet}
                      ))
    text            = forms.CharField(required=False, widget=forms.Textarea(attrs={'class':'textarea', 'cols':'50'}))
    #status          = forms.CharField(widget=forms.RadioSelect(choices=STATUSES, attrs={'class':'radio'}))
    photo           = forms.ImageField(required=False, widget=forms.FileInput(attrs={'class':'input', 'size':'15', 'style':'height: 2em'}))
    photo_location  = forms.CharField(required=False, widget=forms.RadioSelect(choices=PHOTO_LOCATIONS, attrs={'class':'radio'}))
    photo_caption   = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'input', 'size':'25', 'maxlength':'75',}))
    photo_credit    = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'input', 'size':'25', 'maxlength':'25',}))
    
    class Meta:
        model = ProjectUpdate
        exclude = ('time', 'project', 'user', )

@login_required()
def updateform(request, project_id):
    '''
    Form for creating a project update
    Context:
    p: project
    form: the update form
    '''
    p = get_object_or_404(Project, pk=project_id)
    # check that the current user is allowed to edit
    if not p.connected_to_user(request.user):
        return HttpResponseRedirect('/rsr/error/access_denied/')
        
    if request.method == 'POST':

        form = UpdateForm(request.POST, request.FILES, )
        if form.is_valid():
            update = form.save(commit=False)
            update.project = p
            update.time = datetime.now()
            update.user = request.user
            update.update_method = 'W'
            update.save()
            return HttpResponseRedirect('./')
    else:
        form = UpdateForm()
    return render_to_response('rsr/update_form.html', {'form': form, 'p': p, }, RequestContext(request))

def mms_update(request):
    '''
    Create a project update from incoming MMS
    Returns a simple "OK" to the gateway
    '''
    # see if message already has been recieved for some reason, if so ignore
    try:
        # if we find an mms already, do nuthin...
        mms = MoMmsRaw.objects.get(mmsid__exact=request.GET.get('mmsid'))
    except:
        try:
            raw = {}
            request.encoding = 'iso-8859-1'
            # loop over all query variables and put them in a dict to use as data for MoSmsRaw object creation
            for f in MoMmsRaw._meta.fields:
                if f.name == 'sender': #can't have a field named "from", python keyword...
                    raw[f.name] = request.GET.get('from')
                else:
                    raw[f.name] = request.GET.get(f.name)
            raw['saved_at'] = datetime.now() #our own time stamp
            mms = MoMmsRaw.objects.create(**raw)
            for i in range(int(mms.filecount)): #BUG: mms.filecount SHOULD be an int already, but gets fetched as unicode! sql schema says the field is an integer field...
                fileraw = {}
                for f in MoMmsFile._meta.fields:
                    if f.name != 'mms':
                        fileraw[f.name] = request.GET.get('%s[%d]' % (f.name, i))
                fileraw['mms'] = mms
                mmsfile = MoMmsFile.objects.create(**fileraw)
            # find the user owning the phone number. If found create an update
            try:
                u = UserProfile.objects.get(phone_number__exact=mms.sender)
                success = u.create_mms_update(mms)
            except:
                pass #no user with a matching mobile phone number...
        except:
            pass #TODO: logging!
    return HttpResponse("OK") #return OK under all conditions

def sms_update(request):
    '''
    Create a project update from incoming SMS
    Returns a simple "OK" to the gateway
    '''
    # see if message already has been recieved for some reason, if so ignore
    try:
        mo = MoSmsRaw.objects.get(incsmsid__exact=request.GET.get('incsmsid'))
    except:
        try:
            raw = {}
            request.encoding = 'iso-8859-1'
            # loop over all query variables and put them in a dict to use as data for MoSmsRaw object creation
            for f in MoSmsRaw._meta.fields:
                raw[f.name] = request.GET.get(f.name)
            raw['saved_at'] = datetime.now()
            mo = MoSmsRaw.objects.create(**raw)
            # find the user owning the phone number. If found create an update
            u = UserProfile.objects.get(phone_number__exact=request.GET.get("sender"))
            if u:
                #sms_data = {
                #    'time':  datetime.fromtimestamp(float(request["delivered"])),
                #    'text':  request["text"],#.decode("latin-1"), #incoming latin-1, decode to unicode
                #}
                success = u.create_sms_update(mo)
        except:
            pass #TODO: logging!
    return HttpResponse("OK") #return OK under all conditions

class CommentForm(ModelForm):

    comment     = forms.CharField(widget=forms.Textarea(attrs={
                                    'class':'textarea',
                                    'rows':'10',
                                    'cols':'30',
                                    'width': '280px',
                                    'margin': '0 auto'
                                }))
    
    class Meta:
        model   = ProjectComment
        exclude = ('time', 'project', 'user', )

@login_required()
def commentform(request, project_id):
    '''
    URL for posting a comment to a project
    Redirects to the project overview page (/rsr/project/n/ n=project id)
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
            return HttpResponseRedirect('./')
    return HttpResponseRedirect('./')

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

@render_to('rsr/organisation.html')
def orgdetail(request, org_id):
    o = get_object_or_404(Organisation, pk=org_id)
    org_projects = o.published_projects()
    org_partners = o.partners()
    return {'o': o, 'org_projects': org_projects, 'org_partners': org_partners, }

@render_to('rsr/project_main.html')
def projectmain(request, project_id):
    '''
    The project overview page
    Context:
    p: the project
    updates: the three latest updates
    comments: the three latest comments
    form: the comment form
    '''
    p           = get_object_or_404(Project, pk=project_id)
    updates     = Project.objects.get(id=project_id).project_updates.all().order_by('-time')[:3]
    comments    = Project.objects.get(id=project_id).projectcomment_set.all().order_by('-time')[:3]
    form        = CommentForm()
    return {'p': p, 'updates': updates, 'comments': comments, 'form': form }

@render_to('rsr/project_details.html')    
def projectdetails(request, project_id):
        p       = get_object_or_404(Project, pk=project_id)
        return {'p': p, }
    
@render_to('rsr/project_funding.html')    
def projectfunding(request, project_id):
        p       = get_object_or_404(Project, pk=project_id)
        return {'p': p, }

def getwidget(request, project_id):
    '''
    user_level is None, 1 or 2. No user level check on step 2
    '''
    if not request.POST:
        try:
            account_level = request.user.get_profile().organisation.organisationaccount.account_level
        except:
            account_level = 'free'
        p = get_object_or_404(Project.objects, pk=project_id)
        orgs = p.all_partners()
        return render_to_response('rsr/machinery_step1.html', {'project': p, 'account_level': account_level, 'organisations': orgs}, context_instance=RequestContext(request))
    else:
        widget_type = request.POST['widget-type']
        widget_choice = request.POST['widget-choice']
        widget_site = request.POST['widget-site']
        if widget_choice == 'random-from-org':
            o = get_object_or_404(Organisation, pk=request.POST['widget-organisations'])
        elif widget_choice == 'project-list':
            o = get_object_or_404(Organisation, pk=request.POST['widget-organisations'])
        else:
            o = None
        p = get_object_or_404(Project, pk=project_id)
        return render_to_response('rsr/machinery_step2.html', {'project': p, 'organisation':o, 'widget_choice': widget_choice, 'widget_type': widget_type, 'widget_site': widget_site }, context_instance=RequestContext(request))


def flashgallery(request):
    '''
    Generate the xml file for TiltViewer
    '''
    # Get 12 random projects with a current image
    projects = Project.objects.filter(current_image__startswith='img').order_by('?')[:12]
    return render_to_response('rsr/gallery.xml', {'projects': projects, }, context_instance=RequestContext(request), mimetype='text/xml')

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
    
from django.db.models import Max

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
        p = random.choice(Project.objects.published())
    bgcolor = request.GET.get('bgcolor', 'B50000')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    site = request.GET.get('site', 'www.akvo.org')
    return render_to_response('widgets/%s.html' % template.replace('-', '_'),
                                 {'project': p, 'request_get': request.GET, 'bgcolor': bgcolor, 'textcolor': textcolor, 'site': site },
                                 context_instance=RequestContext(request))

def project_list_widget(request, template='project-list', org_id=0):
    bgcolor = request.GET.get('bgcolor', 'B50000')
    textcolor = request.GET.get('textcolor', 'FFFFFF')
    site = request.GET.get('site', 'www.akvo.org')
    if int(org_id):
        o = get_object_or_404(Organisation, pk=org_id)
        p = o.published_projects().funding()
    else:
        p = Project.objects.published().funding()
    order_by = request.GET.get('order_by', 'name')
    #p = p.annotate(last_update=Max('project_updates__time'))
    p = p.extra(select={'last_update':'SELECT MAX(time) FROM rsr_projectupdate WHERE project_id = rsr_project.id'})
    if order_by == 'country__continent':		
        p = p.order_by(order_by, 'country__country_name','name')
    #elif order_by == 'country__country_name':
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
            'bgcolor': bgcolor, 'textcolor': textcolor,  'projects': p,
            'org_id': org_id, 'request_get': request.GET, 'site': site
        },
        context_instance=RequestContext(request))

# PAUL
# PayPal Integration
from akvo.rsr.forms import PayPalInvoiceForm

# URL: /rsr/project/<id>/donate/
def donate(request, project_id):
    # Define some fixed global context for the view
    p = get_object_or_404(Project, pk=project_id)
    u = request.user
    t = datetime.now()
    fn = p.funding_still_needed()

    # Validate if the form was POSTed...
    if request.method == 'POST':
        donate_form = PayPalInvoiceForm(data=request.POST, user=u, project=p)
        # Validate the form
        if donate_form.is_valid():
            invoice = donate_form.save(commit=False)
            invoice.project = p
            if u.is_authenticated():
                invoice.user = u
            else:
                invoice.name = donate_form.cleaned_data['name']
                invoice.email = donate_form.cleaned_data['email']   
            invoice.time = t
            invoice.save()
            # Proceed to initialise the PayPalPaymentsForm
            if settings.PAYPAL_DEBUG:
                pp_dict = {
                    'cmd': getattr(settings, 'PAYPAL_COMMAND', '_donations'),
                    'currency_code': getattr(settings, 'PAYPAL_CURRENCY_CODE', 'EUR'),
                    'business': settings.PAYPAL_SANDBOX_BUSINESS,
                    'amount': invoice.amount,
                    'item_name': settings.PAYPAL_SANDBOX_PRODUCT_DESCRIPTION_PREFIX + 'Project ' + str(invoice.project.id) + ' - ' + invoice.project.name,
                    'invoice': invoice.id,
                    'lc': 'US',
                    'notify_url': settings.PAYPAL_SANDBOX_NOTIFY_URL,
                    'return_url': settings.PAYPAL_SANDBOX_RETURN_URL,
                    'cancel_url': settings.PAYPAL_SANDBOX_CANCEL_URL}
            else:
                pp_dict = {
                    'cmd': getattr(settings, 'PAYPAL_COMMAND', '_donations'),
                    'currency_code': getattr(settings, 'PAYPAL_CURRENCY_CODE', 'EUR'),
                    'business': settings.PAYPAL_BUSINESS,
                    'amount': invoice.amount,
                    'item_name': settings.PAYPAL_PRODUCT_DESCRIPTION_PREFIX + 'Project ' + str(invoice.project.id) + ' - ' + invoice.project.name,
                    'invoice': invoice.id,
                    'lc': 'US',
                    'notify_url': settings.PAYPAL_NOTIFY_URL,
                    'return_url': settings.PAYPAL_RETURN_URL,
                    'cancel_url': settings.PAYPAL_CANCEL_URL}
            pp_form = PayPalPaymentsForm(initial=pp_dict)
            if settings.PAYPAL_DEBUG:
                # Render the sandbox button
                pp_form.sandbox()
            else:
                # Render the button
                pp_form.render()
            return render_to_response('rsr/paypal_checkout.html',
                                        {'name': invoice.name, 
                                         'email': invoice.email, 
                                         'pp_form': pp_form, 
                                         'invoice_id': invoice.id, 
                                         'p': p, 
                                         'amount': invoice.amount,
                                         'sandbox': settings.PAYPAL_DEBUG,},
                                        context_instance=RequestContext(request))
    else:
        # ... otherwise initialise an empty form
        donate_form = PayPalInvoiceForm(user=u, project=p)
        
    # Display the form for non-POST requests or borked validations
    return render_to_response('rsr/project_donate.html', 
                              {'funding_still_needed': fn, 'donate_form': donate_form, 'p': p, }, 
                              context_instance=RequestContext(request))


# Presents the landing page after PayPal
def paypal_thanks(request):
    if request.GET:
        try:
            invoice_id = request.GET['invoice']
            invoice = PayPalInvoice.objects.get(id=invoice_id)
            p = Project.objects.get(id=invoice.project.id)
        except:
            return HttpResponseRedirect('/')
            
        try:
            u = User.objects.get(id=invoice.user_id)
        except:
            u = None
            
        return render_to_response('rsr/paypal_thanks.html',{'invoice': invoice, 'project': p, 'user': u}, context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect('/')