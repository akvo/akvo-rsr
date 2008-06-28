from akvo.rsr.models import Organization, Project, ProjectUpdate, ProjectComment, Funding, FundingPartner, PHOTO_LOCATIONS, STATUSES

from django import newforms as forms
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.newforms import ModelForm
from django.shortcuts import render_to_response, get_object_or_404
from django.utils.safestring import mark_safe
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from BeautifulSoup import BeautifulSoup
from datetime import datetime
import feedparser

def akvo_at_a_glance(projects):
    status_none     = projects.filter(status__exact='N').count()
    status_active   = projects.filter(status__exact='A').count()
    status_onhold   = projects.filter(status__exact='H').count()
    status_complete = projects.filter(status__exact='C').count()
    project_count   = projects.count()
    o = Organization.objects.all()
    fieldpartner_count      = o.filter(type__exact='F').count()
    sponsorpartner_count    = o.filter(type__exact='S').count()
    fundingpartner_count    = o.filter(type__exact='M').count()
    partners_total = fieldpartner_count + sponsorpartner_count + fundingpartner_count
    f = Funding.objects.all()
    funding_total = 0
    for field in ('employment', 'building', 'training', 'maintenance', 'other', ):
        funding_total += sum(f.values_list(field, flat=True))
    funding_pledged = sum(FundingPartner.objects.all().values_list('funding_amount', flat=True))
    
    stats ={
        'status_none': status_none,
        'status_active': status_active,
        'status_onhold': status_onhold,
        'status_complete': status_complete,
        'project_count': project_count,
        'fieldpartner_count': fieldpartner_count,
        'sponsorpartner_count': sponsorpartner_count,
        'fundingpartner_count': fundingpartner_count,
        'partners_total': partners_total,
        'funding_total': funding_total,
        'funding_pledged': funding_pledged,
    }
    return stats

def index(request):
    feed = feedparser.parse("http://www.akvo.org/blog?feed=rss2")
    latest = feed.entries[0]
    soup = BeautifulSoup(latest.content[0].value)
    img_src = soup('img')[0]['src']
    return render_to_response('rsr/index.html', {'latest': latest, 'img_src': img_src, 'soup':soup, }, context_instance=RequestContext(request))

def projectlist(request):
    p = Project.objects.all()
    stats = akvo_at_a_glance(p)
    return render_to_response('rsr/project_list.html', {'projects': p, 'stats': stats}, context_instance=RequestContext(request))

class SigninForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
    
def signin(request):
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
    logout(request)
    return HttpResponseRedirect('/rsr/')

def updatelist(request, project_id):
    updates = Project.objects.get(id=project_id).projectupdate_set.all()
    return render_to_response('rsr/update_list.html', {'updates': updates}, context_instance=RequestContext(request))

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

#from dbgp.client import brk

def projectupdates(request, project_id):
    p           = get_object_or_404(Project, pk=project_id)
    updates     = Project.objects.get(id=project_id).projectupdate_set.all().order_by('-time')
    return render_to_response('rsr/project_updates.html',
                            {'p': p, 'updates': updates, },
                            context_instance=RequestContext(request))
    
@login_required()
def updateform(request, project_id):
    #brk(host="vnc.datatrassel.se", port=9000)
    p = get_object_or_404(Project, pk=project_id)
    if request.method == 'POST':
        form = UpdateForm(request.POST, request.FILES, )
        if form.is_valid():
            update = form.save(commit=False)
            update.project = p
            update.time = datetime.now()
            update.user = request.user
            update.save()
            return HttpResponseRedirect('./')
    else:
        form = UpdateForm()
    context_instance=RequestContext(request)
    return render_to_response('rsr/update_form.html', {'form': form, 'project': p, }, context_instance=context_instance)

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

def projectmain(request, project_id):
    p           = get_object_or_404(Project, pk=project_id)
    updates     = Project.objects.get(id=project_id).projectupdate_set.all().order_by('-time')[:3]
    comments    = Project.objects.get(id=project_id).projectcomment_set.all().order_by('-time')[:3]
    form        = CommentForm()
    return render_to_response('rsr/project_main.html',
                            {
                                'p': p,
                                'updates': updates,
                                'comments': comments,
                                'form': form
                            },
                            context_instance=RequestContext(request))
    
@login_required()
def commentform(request, project_id):
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
