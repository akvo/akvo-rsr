# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django import http
from django.conf import settings
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from django.template import Context, loader
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView

from akvo.rsr.views_partner_sites.base import PartnerSitesMixin, BaseView

__all__ = [
    'SignInView',
    'signout',
    'FourOThreeView',
    'FourOFourView',
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
        """Make sure not to cache the sign in page."""
        return super(SignInView, self).dispatch(*args, **kwargs)

    def form_valid(self, form):
        """On valid form login and redirect the user to the appropriate url"""
        login(self.request, form.get_user())
        return HttpResponseRedirect(self.request.POST.get('next', '/'))

    def get_context_data(self, **kwargs):
        context = super(SignInView, self).get_context_data(**kwargs)
        context['next'] = self.request.GET.get('next', '/')
        return context

    def render_to_response(self, context):
        """If the request is made on a non app domain make sure it's redirected
        to the app domain"""
        if not self._on_app_domain():
            return HttpResponseRedirect(self._get_redirect_url())
        return super(SignInView, self).render_to_response(context)

    def _get_redirect_url(self):
        """Helper method that builds the url to the sign in page on the app
        domain. Next querystring variables are passed on and https support
        is honored."""
        hostname = self.request.partner_site.hostname
        app_domain = settings.APP_DOMAIN_NAME
        request_path = self.request.get_full_path()
        url = 'http://%s.%s%s' % (hostname, app_domain, request_path)

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
    """Signs out a user from partner sites."""
    logout(request)
    return HttpResponseRedirect(request.GET.get('next', '/'))



class FourOThreeView(BaseView):
    "View returning http status 403, forbidden"
    template_name = 'partner_sites/status/403.html'

    def render_to_response(self, context, **kwargs):
        kwargs.update(dict(status = 403))
        # template needs to be rendered for later middleware not to complain
        return super(FourOThreeView, self).render_to_response(context, **kwargs).render()


class FourOFourView(BaseView):
    "View returning http status 404, not found"
    template_name = 'partner_sites/status/404.html'

    def render_to_response(self, context, **kwargs):
        kwargs.update(dict(status = 404))
        # template needs to be rendered for later middleware not to complain
        return super(FourOFourView, self).render_to_response(context, **kwargs).render()
