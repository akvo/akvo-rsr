# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import logging
from django.conf import settings
from django.core.exceptions import DisallowedHost
from django.db.models import Q
from django.shortcuts import redirect
from akvo.rsr.context_processors import extra_context
from akvo.rsr.models import PartnerSite


def _is_rsr_host(hostname):
    """Predicate function that checks if request is made to the RSR_DOMAIN."""
    rsr_hosts = ['127.0.0.1', 'localhost', settings.RSR_DOMAIN]
    return hostname in rsr_hosts


def _is_naked_app_host(hostname):
    """Predicate function that checks if request is made to the RSR_DOMAIN."""
    if hostname == settings.AKVOAPP_DOMAIN:
        return True
    return False


def _partner_site(netloc):
    """From a netloc return PartnerSite or raise a DoesNotExist."""
    return PartnerSite.objects.get(
        Q(hostname=PartnerSite.yank_hostname(netloc)) | Q(cname=netloc)
    )


class HostDispatchMiddleware(object):

    """Simple test for middleware testing."""

    # def process_request(self, request, cname_domain=False, rsr_page=None):
    def process_request(self, request):
        """Route on request."""
        request.rsr_page = None
        host = request.get_host()

        # Make sure host is valid - otherwise redirect to RSR_DOMAIN.
        # Do nothing if called on "normal" RSR host.
        try:
            if _is_rsr_host(host):
                return None
        except DisallowedHost:
            return redirect("http://{}".format(settings.RSR_DOMAIN))

        # Check if called on naked app domain - if so redirect
        if _is_naked_app_host(host):
            return redirect("http://{}".format(settings.RSR_DOMAIN))

        # Check if site exists
        try:
            site = _partner_site(host)
        except PartnerSite.DoesNotExist:
            return redirect("http://{}".format(settings.RSR_DOMAIN))

        # Check if site is enabled
        if not site.enabled:
            return redirect("http://{}".format(settings.RSR_DOMAIN))

        # Set site to request object
        request.rsr_page = site
        return None


class ExceptionLoggingMiddleware(object):

    """Used to log exceptions on production systems."""

    def process_exception(self, request, exception):
        """."""
        logging.exception('Exception handling request for ' + request.path)


class RSRVersionHeaderMiddleware(object):

    """Add a response header with RSR version info."""

    def process_response(self, request, response):
        """Add the X-RSR-Version header."""
        context = extra_context(request)

        response['X-RSR-Version'] = "tag={}, commit={}, branch={}".format(
            context['deploy_tag'],
            context['deploy_commit_id'],
            context['deploy_branch'])
        return response
