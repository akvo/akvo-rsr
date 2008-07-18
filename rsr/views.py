from akvo.rsr.models import Organization, Project, ProjectUpdate, ProjectComment, Funding, FundingPartner, PHOTO_LOCATIONS, STATUSES, UPDATE_METHODS
from akvo.rsr.models import funding_aggregate

from django import newforms as forms
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.newforms import ModelForm
from django.shortcuts import render_to_response, get_object_or_404
from django.core.paginator import Paginator
from django.utils.safestring import mark_safe
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from BeautifulSoup import BeautifulSoup
from datetime import datetime
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

def akvo_at_a_glance(projects):
    '''
    Create aggregate data about a collection of projects in a queryset.
    '''
    status_none     = projects.filter(status__exact='N').count()
    status_active   = projects.filter(status__exact='A').count()
    status_onhold   = projects.filter(status__exact='H').count()
    status_complete = projects.filter(status__exact='C').count()
    mdgs_water       = mdgs_water_calc(projects) #sum(projects.values_list('mdg_count_water', flat=True))
    mdgs_sanitation  = mdgs_sanitation_calc(projects) #sum(projects.values_list('mdg_count_water', flat=True))
    project_count   = projects.count()
    o = Organization.objects.all()
    fieldpartner_count      = o.filter(field_partner__exact=True).count()
    supportpartner_count    = o.filter(support_partner__exact=True).count()
    fundingpartner_count    = o.filter(funding_partner__exact=True).count()
    partners_total = fieldpartner_count + supportpartner_count + fundingpartner_count
    funding_total, funding_pledged = funding_aggregate(projects)
    
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
        'partners_total': partners_total,
        'funding_total': funding_total,
        'funding_needed': funding_total - funding_pledged,
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
            bandwidth = 'ask'
            request.session.delete_test_cookie()
        else:
            # virgin user or no cookies?
            no_cookie = request.GET.get('nocookie')
            if not no_cookie:
                # brand new user, test for cookieness
                return HttpResponseRedirect('/rsr/settestcookie/')
            elif no_cookie == 'test':
                return HttpResponseRedirect('/rsr/?nocookie=True')
            elif no_cookie == 'True':
                bandwidth = 'low'
    try:
        feed = feedparser.parse("http://www.akvo.org/blog?feed=rss2")
        latest = feed.entries[0]
        soup = BeautifulSoup(latest.content[0].value)
        img_src = soup('img')[0]['src']
    except:
        soup = img_src = ''
        latest = {
            'author': '',
            'summary': 'The blog is not available at the moment.',
        }
    p = Project.objects.all()        
    if bandwidth == 'low':
        grid_projects = p.filter(current_image__startswith='img').order_by('?')[:12]
    else:
        grid_projects = None
    stats = akvo_at_a_glance(p)
    #return render_to_response('rsr/index.html', {'latest': latest, 'img_src': img_src, 'soup':soup, }, context_instance=RequestContext(request))
    return {'latest': latest, 'img_src': img_src, 'soup':soup, 'stats': stats, 'bandwidth': bandwidth, 'grid_projects': grid_projects}

def project_list_data(request, projects):
    try:
        order_by = request.GET.get('order_by', 'name')
        projects = projects.order_by(order_by, 'name')
    except:
        pass
    PROJECTS_PER_PAGE = 10
    paginator = Paginator(projects, PROJECTS_PER_PAGE)
    page = paginator.page(request.GET.get('page', 1))
    stats = akvo_at_a_glance(projects)
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
    projects = Project.objects.all()
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
    o = Organization.objects.get(id=org_id)
    projects = o.projects()
    page, stats = project_list_data(request, projects)
    return {'projects': projects, 'stats': stats, 'page': page, 'o': o, }

@render_to('rsr/organization_directory.html')
def orglist(request, org_id=0):
    '''
    List of all projects in RSR
    Context:
    orgz: list of all organizations
    stats: the aggregate projects data
    '''
    if org_id != 0:
        orgz = Organization.objects.all() #TODO: some sort o orgz filtering...all orgz assosciated with org_id?
    else:
        orgz = Organization.objects.all()
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
    return {'orgz': orgz, 'stats': stats, 'page': page}

class SigninForm(forms.Form):
    #from dbgp.client import brk
    #brk(host="vnc.datatrassel.se", port=9000)
    username = forms.CharField(widget=forms.TextInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'})) 
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class':'input', 'size':'25', 'style':'margin: 0 20px'}))
    
def signin(request):
    '''
    Sign in page for RSR
    Context:
    form: the sign in form    
    '''
    form = SigninForm()
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        next     = request.POST['next']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(request.POST['next'])
            else:
                return HttpResponseRedirect('http://www.akvo.org/')
        else:
            form.has_errors = True
            # Return an 'invalid login' error message.
    elif request.method == 'GET':
        next     = request.GET['next']
    context_instance=RequestContext(request, {'next': next})
    return render_to_response('rsr/sign_in.html', {'form': form, }, context_instance=context_instance)

def signout(request):
    '''
    Sign out URL
    Redirects to /rsr/
    '''
    logout(request)
    return HttpResponseRedirect('/rsr/')

def updatelist(request, project_id):
    updates = Project.objects.get(id=project_id).projectupdate_set.all()
    template = 'rsr/update_list.html'
    return render_to_response(template, {'updates': updates}, context_instance=RequestContext(request, {'template': template }))

    #t = loader.get_template('rsr/update_list.html')
    #c = RequestContext({'updates': updates})
    #return HttpResponse(t.render(c))

class UpdateForm(ModelForm):

    js_snippet = "return taCount(this,'myCounter')"
    js_snippet = mark_safe(js_snippet)    
    title           = forms.CharField(
                        widget=forms.TextInput(
                            attrs={'class':'input', 'size':'25', 'onKeyPress':'return taLimit(this)', 'onKeyUp':js_snippet}
                      ))
    text            = forms.CharField(required=False, widget=forms.Textarea(attrs={'class':'textarea', 'cols':'50'}))
    status          = forms.CharField(widget=forms.RadioSelect(choices=STATUSES, attrs={'class':'radio'}))
    photo           = forms.ImageField(required=False, widget=forms.FileInput(attrs={'class':'input', 'size':'15', 'style':'height: 2em'}))
    photo_location  = forms.CharField(required=False, widget=forms.RadioSelect(choices=PHOTO_LOCATIONS, attrs={'class':'radio'}))
    photo_caption   = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'input', 'size':'25',}))
    photo_credit    = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'input', 'size':'25',}))
    
    class Meta:
        model = ProjectUpdate
        exclude = ('time', 'project', 'user', )

from dbgp.client import brk

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

#def org_projects(org_id):
#    '''
#    returns a queryset with all projects that have the organization org_id
#    as any kind of partner
#    '''
#    projs = Project.objects.all()
#    return (projs.filter(supportpartner__support_organization=org_id) | \
#             projs.filter(fieldpartner__field_organization=org_id) | \
#             projs.filter(fundingpartner__funding_organization=org_id)).distinct()

def org_activities(organization):
    # assoc resolves to all projects associated with organization, where organization can function in any of the three partner functions
    assoc = organization.projects()
    orgz = Organization.objects.all()
    # partners resolves to all orgz that are partners of any kind to the list of projects in assoc
    partners = (orgz.filter(field_partners__project__in = assoc.values('pk').query) | \
                orgz.filter(support_partners__project__in = assoc.values('pk').query) | \
                orgz.filter(funding_partners__project__in = assoc.values('pk').query)).distinct()
    # remove organization from queryset
    return assoc, partners.exclude(id=organization.id)

@render_to('rsr/organization.html')
def orgdetail(request, org_id):
    o = get_object_or_404(Organization, pk=org_id)
    org_projects = o.projects()
    org_partners = o.partners()
    org_stats = akvo_at_a_glance(org_projects)
    return {'o': o, 'org_projects': org_projects, 'org_partners': org_partners, 'org_stats': org_stats, }

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

def templatedev(request, template_name):
    "Render a template in the dev folder. The template rendered is template_name.html when the path is /rsr/dev/template_name/"
    dev = {'path': 'dev/'}
    p = Project.objects.get(pk=1)
    updates     = Project.objects.get(id=1).projectupdate_set.all().order_by('-time')[:3]
    comments    = Project.objects.get(id=1).projectcomment_set.all().order_by('-time')[:3]
    grid_projects = Project.objects.filter(current_image__startswith='img').order_by('?')[:12]

    projects = Project.objects.all()
    stats = akvo_at_a_glance(projects)

    orgz = Organization.objects.all()

    o = Organization.objects.get(pk=1)
    org_projects, org_partners = org_activities(o)
    org_stats = akvo_at_a_glance(org_projects)
    
    return render_to_response('dev/%s.html' % template_name,
        {'dev': dev, 'p': p, 'updates': updates, 'comments': comments, 'projects': projects, 'stats': stats, 'orgz': orgz, 'o': o, 'org_projects': org_projects, 'org_partners': org_partners, 'org_stats': org_stats, 'grid_projects': grid_projects, }, context_instance=RequestContext(request))

class HttpResponseNoContent(HttpResponse):
    status_code = 204
    
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
