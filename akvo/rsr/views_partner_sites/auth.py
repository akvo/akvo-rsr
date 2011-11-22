# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.conf import settings
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
    Uses Django's AuthenticationForm and makes sure that the view is not
    cached. The view verifies and redirect to the app domain (akvoapp.org) if
    requested from partners domain.
    """
    template_name = 'partner_sites/auth/sign-in.html'
    form_class = AuthenticationForm

    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        return super(SignInView, self).dispatch(*args, **kwargs)

    def form_valid(self, form):
        login(self.request, form.get_user())
        return HttpResponseRedirect(self.request.POST.get('next', '/'))

    def render_to_response(self, context):
        """..."""
        if not self._on_app_domain():
            return HttpResponseRedirect(self._get_redirect_url())
        return super(SignInView, self).render_to_response(context)

    def _get_redirect_url(self):
        url = 'http://%s.%s%s' % (self.request.partner_site.hostname, \
                                 settings.APP_DOMAIN_NAME,
                                 self.request.get_full_path())
        if getattr(settings, 'HTTPS_SUPPORT', True):
            return url.replace('http://', 'https://')
        return url

    def _on_app_domain(self):
        """Verifies that the current request is hosted on the app
        domain (akvoapp.org)"""
        if self.request.partner_site.cname != self.request.META['HTTP_HOST']:
            return True
        return False


def signout(request):
    '''Signs out a user from partner sites.'''
    logout(request)
    return HttpResponseRedirect(request.GET.get('next', '/'))
