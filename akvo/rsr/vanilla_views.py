# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext

from .forms import RegisterForm


def index(request):
    return HttpResponseRedirect('register')


def login(request):
    context = RequestContext(request)
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            return render_to_response('v3/register_complete.html', {'user': user}, context_instance=context)
    else:
        form = AuthenticationForm()
    return render_to_response('v3/sign_in.html', {'form': form}, context_instance=context)


def register(request):
    context = RequestContext(request)
    if request.method == 'POST':
        form = RegisterForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            user = form.save(request)
            return render_to_response('v3/register_complete.html', {'user': user}, context_instance=context)
    else:
        form = RegisterForm()
    return render_to_response('v3/register.html', {'form': form}, context_instance=context)