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
from django.core.urlresolvers import reverse
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
        """Make sure not to cache the sign in page."""
        return super(SignInView, self).dispatch(*args, **kwargs)

    def form_valid(self, form):
        """On valid form login and redirect the user to the appropriate url"""
        login(self.request, form.get_user())

        redirect_blacklist = [reverse('sign_in'),
                              reverse('sign_out')]

        redirect_to = self.request.POST.get('next', '/')
        if redirect_to in redirect_blacklist:
            redirect_to = "/"

        return HttpResponseRedirect(redirect_to)

    def get_context_data(self, **kwargs):
        context = super(SignInView, self).get_context_data(**kwargs)
        context['next'] = self.request.GET.get('next', '/')
        # create url to RSR register page
        rsr_domain = getattr(settings, 'RSR_DOMAIN', 'rsr.akvo.org')
        register1_path = reverse('register1', urlconf='akvo.urls.rsr')
        register1_url = "http://{rsr_domain}{register1_path}".format(
            rsr_domain= rsr_domain,
            register1_path = register1_path,
        )
        register2_path = reverse('register2', urlconf='akvo.urls.rsr')
        org_query_string = "?org_id={}".format(self.request.organisation_id)
        register2_url = "http://{rsr_domain}{register2_path}{org_query_string}".format(
            rsr_domain= rsr_domain,
            register2_path = register2_path,
            org_query_string=org_query_string,
        )
        rsr_password_reset_path = reverse('rsr_password_reset', urlconf='akvo.urls.rsr')
        rsr_password_reset_url = "http://{rsr_domain}{rsr_password_reset_path}".format(
            rsr_domain= rsr_domain,
            rsr_password_reset_path = rsr_password_reset_path,
        )
        if getattr(settings, 'HTTPS_SUPPORT', True):
            return register2_url.replace('http://', 'https://')
        context['register1_url'] = register1_url
        context['register2_url'] = register2_url
        context['rsr_password_reset_url'] = rsr_password_reset_url
        context['organisation_absolute_url'] = self.request.partner_site.organisation.get_absolute_url()
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
        app_domain = getattr(settings, 'AKVOAPP_DOMAIN', 'akvoapp.org')
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
