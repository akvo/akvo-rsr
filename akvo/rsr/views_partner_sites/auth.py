# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic.edit import FormView

from akvo.rsr.views_partner_sites.base import PartnerSitesMixin

__all__ = [
    'SignInView',
    'signout',
    ]


class SignInView(PartnerSitesMixin, FormView):
    """Handles the signin on partner sites
    0. If already signed in, just loop through the auth
    1. Verify that on the <partner>.akvoapp.org(or test/dev) domain.
    2.
    """
    template_name = 'partner_sites/auth/sign-in.html'
    form_class = AuthenticationForm

    def form_valid(self, form):
        login(self.request, form.get_user())
        return HttpResponseRedirect(self.request.POST.get('next', '/'))

    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        return super(SignInView, self).dispatch(*args, **kwargs)


def signout(request):
    '''Signs out a user from partner sites.'''
    logout(request)
    return HttpResponseRedirect(request.GET.get('next', '/'))
