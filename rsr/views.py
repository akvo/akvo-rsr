# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Organisation, Project, ProjectUpdate, ProjectComment, Funding, FundingPartner, MoSmsRaw, PHOTO_LOCATIONS, STATUSES, UPDATE_METHODS
from akvo.rsr.models import funding_aggregate, UserProfile, MoMmsRaw, MoMmsFile
from akvo.rsr.forms import OrganisationForm, RSR_RegistrationForm, RSR_ProfileUpdateForm, RSR_PasswordChangeForm, RSR_AuthenticationForm, RSR_RegistrationProfile

from django import newforms as forms
from django import oldforms
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, HttpResponsePermanentRedirect
from django.template import RequestContext
from django.newforms import ModelForm
from django.shortcuts import render_to_response, get_object_or_404
from django.core.paginator import Paginator
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

def mdgs_water_calc(projects):
    '''
    Calculate the water MDGs for the projects
    '''
    #find the projects with at least 7 years of improved water
    enough_years = projects.filter(improved_water_years__gte=7)
    #add up all improved water for the filtered projects
    return sum(enough_years.values_list('improved_water', flat=True))

def mdgs_sanitation_calc(projects):
    '''
    Calculate the sanitation MDGs for the projects
    '''
    #find the projects with at least 7 years of improved sanitation
    enough_years = projects.filter(improved_sanitation_years__gte=7)
    #add up all improved sanitation for the filtered projects
    return sum(enough_years.values_list('improved_sanitation', flat=True))

#def funding_aggregate(projects):
#    '''
#    Create funding aggregate data about a collection of projects in a queryset.
#    '''    
#    f = Funding.objects.all().filter(project__in = projects)
#    funding_total = 0 #total requested funding for projects
#    for field in ('employment', 'building', 'training', 'maintenance', 'other', ):
#        funding_total += sum(f.values_list(field, flat=True))
#    # how much has ben pledged so far
#    funding_pledged = sum(FundingPartner.objects.all().filter(project__in = projects).values_list('funding_amount', flat=True))
#    return funding_total, funding_pledged

def akvo_at_a_glance(projects, org=None):
    '''
    Create aggregate data about a collection of projects in a queryset.
    If org is supplied modify funding aggregate to reflect that orgs commitment to the projects.
    '''
    status_none     = projects.filter(status__exact='N').count()
    status_active   = projects.filter(status__exact='A').count()
    status_onhold   = projects.filter(status__exact='H').count()
    status_complete = projects.filter(status__exact='C').count()
    mdgs_water       = mdgs_water_calc(projects) #sum(projects.values_list('mdg_count_water', flat=True))
    mdgs_sanitation  = mdgs_sanitation_calc(projects) #sum(projects.values_list('mdg_count_water', flat=True))
    project_count   = projects.count()
    o = Organisation.objects.all()
    fieldpartner_count      = o.filter(field_partner__exact=True).count()
    supportpartner_count    = o.filter(support_partner__exact=True).count()
    fundingpartner_count    = o.filter(funding_partner__exact=True).count()
    num_organisations = o.count()
    funding_total, funding_pledged, funding_needed = funding_aggregate(projects, organisation=org)
    
    stats ={
        'status_none': status_none,
        'status_active': status_active,
        'status_onhold': status_onhold,
        'status_complete': status_complete,
        'mdgs_water': mdgs_water,
        'mdgs_sanitation': mdgs_sanitation,
        'project_count': project_count,
        'fieldpartner_count': fieldpartner_count,
        'supportpartner_count': supportpartner_count,
        'fundingpartner_count': fundingpartner_count,
        'num_organisations': num_organisations,
        'funding_total': funding_total,
        'funding_needed': funding_needed,
        'funding_pledged': funding_pledged,
    }
    return stats

def featured_projects(projects):
    for i in range(3):
        pass

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
    bandwidth = request.session.get('bandwidth', False)
    # is this a returned user?
    if not bandwidth:
        # nope, no session. so are we returning from cookie test?
        if request.session.test_cookie_worked():
            # new user, with cookies enabled
            request.session['bandwidth'] = bandwidth = 'low'
            request.session.delete_test_cookie()
            return HttpResponseRedirect('/rsr/')
        else:
            # virgin user or no cookies?
            no_cookie = request.GET.get('nocookie')
            if not no_cookie:
                # brand new user, test for cookieness
                return HttpResponseRedirect('/rsr/settestcookie/')
            elif no_cookie != 'True':
                return HttpResponseRedirect('/rsr/?nocookie=True')
            else:
                bandwidth = 'low'
    try:
        feed = feedparser.parse("http://www.akvo.org/blog?feed=rss2")
        latest1 = feed.entries[0]
        soup = BeautifulSoup(latest1.content[0].value)
        img_src1 = soup('img')[0]['src']
        latest2 = feed.entries[1]
        soup = BeautifulSoup(latest2.content[0].value)
        img_src2 = soup('img')[0]['src']
    except:
        soup = img_src1 = img_src2 = ''
        latest1 = latest2 = {
            'author': '',
            'summary': _('The blog is not available at the moment.'),
        }
    p = Project.objects.all()        
    if bandwidth == 'low':
        grid_projects = p.filter(current_image__startswith='img').order_by('?')[:12]
    else:
        grid_projects = None
    stats = akvo_at_a_glance(p)
    #return render_to_response('rsr/index.html', {'latest': latest, 'img_src': img_src, 'soup':soup, }, context_instance=RequestContext(request))
    return {'latest1': latest1, 'img_src1': img_src1, 'latest2': latest2, 'img_src2': img_src2, 'stats': stats, 'bandwidth': bandwidth, 'grid_projects': grid_projects}

def oldindex(request):
    "Fix for old url of old rsr front that has become the akvo home page"
    return HttpResponsePermanentRedirect('/')

def project_list_data(request, projects):
    order_by = request.GET.get('order_by', 'name')
    if order_by in ['funds_requested', 'funds_needed']:
        projects = projects.extra(order_by = ['-%s' % order_by, 'name'])
    else:
        projects = projects.order_by(order_by, 'name')
    PROJECTS_PER_PAGE = 10
    paginator = Paginator(projects, PROJECTS_PER_PAGE)
    page = paginator.page(request.GET.get('page', 1))
    stats = akvo_at_a_glance(Project.objects.all())
    return page, stats
    
@render_to('rsr/project_directory.html')
def projectlist(request):
    '''
    List of all projects in RSR
    Context:
    projects: list of all projects
    stats: the aggregate projects data
    page: paginator
    '''
    projects = Project.objects.all().extra(
        select={'funds_requested': 'SELECT employment+building+training+maintenance+other FROM rsr_funding WHERE rsr_funding.project_id = rsr_project.id',
                'funds_needed': 'SELECT DISTINCT employment+building+training+maintenance+other-(SELECT (CASE WHEN SUM(funding_amount) IS NULL THEN 0 ELSE SUM(funding_amount) END) FROM rsr_fundingpartner WHERE rsr_fundingpartner.project_id = rsr_project.id) FROM rsr_funding WHERE rsr_funding.project_id = rsr_project.id',}
    )
    page, stats = project_list_data(request, projects)
    return {'projects': projects, 'stats': stats, 'page': page, }

@render_to('rsr/project_directory.html')
def filteredprojectlist(request, org_id):
    '''
    List of  projects in RSR
    filtered on an organisation
    Context:
    projects: list of all projects
    stats: the aggregate projects data
    page: paginator
    o: organisation
    '''
    # get all projects org_id is asociated with
    o = Organisation.objects.get(id=org_id)
    projects = o.projects()
    projects = projects.extra(
        select={'funds_requested': 'SELECT employment+building+training+maintenance+other FROM rsr_funding WHERE rsr_funding.project_id = rsr_project.id',
                'funds_needed': 'SELECT DISTINCT employment+building+training+maintenance+other-(SELECT (CASE WHEN SUM(funding_amount) IS NULL THEN 0 ELSE SUM(funding_amount) END) FROM rsr_fundingpartner WHERE rsr_fundingpartner.project_id = rsr_project.id) FROM rsr_funding WHERE rsr_funding.project_id = rsr_project.id',}
    )
    page, stats = project_list_data(request, projects)
    return {'projects': projects, 'stats': stats, 'page': page, 'o': o, }

@render_to('rsr/organisation_directory.html')
def orglist(request, org_type='all'):
    '''
    List of all projects in RSR
    Context:
    orgz: list of all organisations
    stats: the aggregate projects data
    page: paginated orgz
    '''
    #from dbgp.client import brk
    #brk(host="vnc.datatrassel.se", port=9000)
    orgz = Organisation.objects.all()
    if org_type != 'all':
        if org_type == 'field':
            orgz = orgz.filter(field_partner__exact=True)
        elif org_type == 'support':
            orgz = orgz.filter(support_partner__exact=True)
        elif org_type == 'funding':
            orgz = orgz.filter(funding_partner__exact=True)
        elif org_type == 'ngo':
            orgz = orgz.filter(organisation_type__exact='N')
        elif org_type == 'governmental':
            orgz = orgz.filter(organisation_type__exact='G')
        elif org_type == 'commercial':
            orgz = orgz.filter(organisation_type__exact='C')
        elif org_type == 'knowledge':
            orgz = orgz.filter(organisation_type__exact='K')
    try:
        order_by = request.GET.get('order_by', 'name')
        orgz = orgz.order_by(order_by, 'name')
    except:
        pass
    ORGZ_PER_PAGE = 20
    paginator = Paginator(orgz, ORGZ_PER_PAGE)
    page = paginator.page(request.GET.get('page', 1))
    projects = Project.objects.all()
    stats = akvo_at_a_glance(projects)
    return {'orgz': orgz, 'org_type': org_type, 'stats': stats, 'page': page}

class SigninForm(forms.Form):
    #from dbgp.client import brk
    #brk(host="vnc.datatrassel.se", port=9000)
    username = forms.CharField(widget=forms.TextInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'})) 
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'}))

#not used...    
#def signin(request):
#    '''
#    Sign in page for RSR
#    Context:
#    form: the sign in form    
#    '''
#    form = SigninForm()
#    if request.method == 'POST':
#        username = request.POST['username']
#        password = request.POST['password']
#        next     = request.POST.get('next', '/rsr/')
#        user = authenticate(username=username, password=password)
#        if user is not None:
#            if user.is_active:
#                login(request, user)
#                return HttpResponseRedirect(next)
#            else:
#                return HttpResponseRedirect('http://www.akvo.org/')
#        else:
#            form.has_errors = True
#            # Return an 'invalid login' error message.
#    elif request.method == 'GET':
#        next     = request.GET['next']
#    context_instance=RequestContext(request, {'next': next})
#    return render_to_response('rsr/sign_in.html', {'form': form, }, context_instance=context_instance)

from django.contrib.auth import REDIRECT_FIELD_NAME
#copied from django.contrib.auth.views to be able to use a custom Form
def login(request, template_name='registration/login.html', redirect_field_name=REDIRECT_FIELD_NAME):
    "Displays the login form and handles the login action."    
    manipulator = RSR_AuthenticationForm() # this line is changed
    redirect_to = request.REQUEST.get(redirect_field_name, '')
    if request.POST:
        errors = manipulator.get_validation_errors(request.POST)
        if not errors:
            # Light security check -- make sure redirect_to isn't garbage.
            if not redirect_to or '//' in redirect_to or ' ' in redirect_to:
                from django.conf import settings
                redirect_to = settings.LOGIN_REDIRECT_URL
            from django.contrib.auth import login
            login(request, manipulator.get_user())
            if request.session.test_cookie_worked():
                request.session.delete_test_cookie()
            return HttpResponseRedirect(redirect_to)
    else:
        errors = {}
    request.session.set_test_cookie()

    if Site._meta.installed:
        current_site = Site.objects.get_current()
    else:
        current_site = RequestSite(request)

    return render_to_response(template_name, {
        'form': oldforms.FormWrapper(manipulator, request.POST, errors),
        redirect_field_name: redirect_to,
        'site_name': current_site.name,
    }, context_instance=RequestContext(request))

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
             form_class=RSR_RegistrationForm,
             profile_callback=None,
             template_name='registration/registration_form2.html',
            ):
    org_id = request.GET.get('org_id', None)
    if not org_id:
        return HttpResponseRedirect('/rsr/accounts/register1/')
    organisation = Organisation.objects.get(pk=org_id)
    if request.method == 'POST':
        #from dbgp.client import brk
        #brk(host="vnc.datatrassel.se", port=9000)
        form = form_class(data=request.POST, files=request.FILES)
        if form.is_valid():
            new_user = form.save(profile_callback=profile_callback)
            return HttpResponseRedirect('/rsr/accounts/register/complete/')
    else:
        form = form_class(initial={'org_id': org_id})
    context = RequestContext(request)
    return render_to_response(template_name,
                              { 'form': form, 'organisation': organisation, },
                              context_instance=context)

#from registraion.views, to use custom manager RSR_RegistrationProfile
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
    activation_key = activation_key.lower() # Normalize before trying anything with it.
    account = RSR_RegistrationProfile.objects.activate_user(activation_key)
    if extra_context is None:
        extra_context = {}
    context = RequestContext(request)
    for key, value in extra_context.items():
        context[key] = callable(value) and value() or value
    return render_to_response(template_name,
                              { 'account': account,
                                'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS },
                              context_instance=context)

#copied from django.contrib.auth.views to be able to use a custom Form
def password_change(request, template_name='registration/password_change_form.html'):
    new_data, errors = {}, {}
    form = RSR_PasswordChangeForm(request.user) #this line is changed!
    if request.POST:
        new_data = request.POST.copy()
        errors = form.get_validation_errors(new_data)
        if not errors:
            form.save(new_data)
            return HttpResponseRedirect('%sdone/' % request.path)
    return render_to_response(template_name, {'form': oldforms.FormWrapper(form, new_data, errors)},
        context_instance=RequestContext(request))
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

def updatelist(request, project_id):
    updates = Project.objects.get(id=project_id).projectupdate_set.all()
    template = 'rsr/update_list.html'
    return render_to_response(template, {'updates': updates}, context_instance=RequestContext(request, {'template': template }))

    #t = loader.get_template('rsr/update_list.html')
    #c = RequestContext({'updates': updates})
    #return HttpResponse(t.render(c))

@render_to('rsr/project_updates.html')
def projectupdates(request, project_id):
    '''
    List of all updates for a project
    Context:
    p: project
    updates: list of updates, ordered by time in reverse
    '''
    p           = get_object_or_404(Project, pk=project_id)
    updates     = Project.objects.get(id=project_id).projectupdate_set.all().order_by('-time')
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
    photo_caption   = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'input', 'size':'25',}))
    photo_credit    = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'input', 'size':'25',}))
    
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
    #brk(host="vnc.datatrassel.se", port=9000)
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
    #from dbgp.client import brk
    #brk(host="192.168.1.123", port=9000)
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
    #from dbgp.client import brk
    #brk(host="vnc.datatrassel.se", port=9000)
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
    #brk(host="vnc.datatrassel.se", port=9000)
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

#def org_projects(org_id):
#    '''
#    returns a queryset with all projects that have the organisation org_id
#    as any kind of partner
#    '''
#    projs = Project.objects.all()
#    return (projs.filter(supportpartner__support_organisation=org_id) | \
#             projs.filter(fieldpartner__field_organisation=org_id) | \
#             projs.filter(fundingpartner__funding_organisation=org_id)).distinct()

def org_activities(organisation):
    # assoc resolves to all projects associated with organisation, where organisation can function in any of the three partner functions
    assoc = organisation.projects()
    orgz = Organisation.objects.all()
    # partners resolves to all orgz that are partners of any kind to the list of projects in assoc
    partners = (orgz.filter(field_partners__project__in = assoc.values('pk').query) | \
                orgz.filter(support_partners__project__in = assoc.values('pk').query) | \
                orgz.filter(funding_partners__project__in = assoc.values('pk').query)).distinct()
    # remove organisation from queryset
    return assoc, partners.exclude(id=organisation.id)

@render_to('rsr/organisation.html')
def orgdetail(request, org_id):
    o = get_object_or_404(Organisation, pk=org_id)
    org_projects = o.projects()
    org_partners = o.partners()
    org_stats = akvo_at_a_glance(org_projects, o)
    #proj_count = org_stats['project_count'] #'extracted' for use in pluralised blocktrans
    return {'o': o, 'org_projects': org_projects, 'org_partners': org_partners, 'org_stats': org_stats, } #'proj_count': proj_count, }

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
    updates     = Project.objects.get(id=project_id).projectupdate_set.all().order_by('-time')[:3]
    comments    = Project.objects.get(id=project_id).projectcomment_set.all().order_by('-time')[:3]
    form        = CommentForm()
    return {'p': p, 'updates': updates, 'comments': comments, 'form': form }
    #return render_to_response('rsr/project_main.html',
    #    {'p': p, 'updates': updates, 'comments': comments, 'form': form }, context_instance=RequestContext(request))

@render_to('rsr/project_details.html')    
def projectdetails(request, project_id):
        p       = get_object_or_404(Project, pk=project_id)
        return {'p': p, }
    
@render_to('rsr/project_funding.html')    
def projectfunding(request, project_id):
        p       = get_object_or_404(Project, pk=project_id)
        return {'p': p, }
       
def flashgallery(request):
    '''
    Generate the xml file for TiltViewer
    '''
    # Get 18 random projects with a current image
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
    pct = int(request.GET.get('pct', 0))
    if pct:
        box = [(0,0),(pct,20)]
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
    p = Project.objects.get(pk=1)
    updates     = Project.objects.get(id=1).projectupdate_set.all().order_by('-time')[:3]
    comments    = Project.objects.get(id=1).projectcomment_set.all().order_by('-time')[:3]
    grid_projects = Project.objects.filter(current_image__startswith='img').order_by('?')[:12]

    projects = Project.objects.all()
    stats = akvo_at_a_glance(projects)

    orgz = Organisation.objects.all()

    o = Organisation.objects.get(pk=1)
    org_projects, org_partners = org_activities(o)
    org_stats = akvo_at_a_glance(org_projects)
    
    return render_to_response('dev/%s.html' % template_name,
        {'dev': dev, 'p': p, 'updates': updates, 'comments': comments, 'projects': projects, 'stats': stats, 'orgz': orgz, 'o': o, 'org_projects': org_projects, 'org_partners': org_partners, 'org_stats': org_stats, 'grid_projects': grid_projects, }, context_instance=RequestContext(request))

class HttpResponseNoContent(HttpResponse):
    status_code = 204
    
def test_widget(request):
    return render_to_response('widgets/featured_project.html', context_instance=RequestContext(request))
    
def ajax_tab_goals(request, project_id):
    try:
        p = Project.objects.get(pk=project_id)
        return render_to_response('rsr/ajax_tab_goals.html', {'p': p,}, context_instance=RequestContext(request))        
    except Project.DoesNotExist:
        return HttpResponseNoContent()
    
def ajax_tab_sustainability(request, project_id):
    try:
        p = Project.objects.get(pk=project_id)
        return render_to_response('rsr/ajax_tab_sustainability.html', {'p': p,}, context_instance=RequestContext(request))        
    except Project.DoesNotExist:
        return HttpResponseNoContent()
    
def ajax_tab_context(request, project_id):
    try:
        p = Project.objects.get(pk=project_id)
        return render_to_response('rsr/ajax_tab_context.html', {'p': p,}, context_instance=RequestContext(request))        
    except Project.DoesNotExist:
        return HttpResponseNoContent()
