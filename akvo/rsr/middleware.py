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


def _build_api_link(request, resource, object_id):
    """
    Build a new link that will redirect from the '/v1/api/project/?depth=X' resource to
    '/v1/api/project_extra(_deep)/' resource.
    """
    protocol = 'https' if request.is_secure() else 'http'
    object_id_part = '/' if not object_id else '/{0}/'.format(object_id)
    return '{0}://{1}/api/v1/{2}{3}?{4}'.format(
        protocol, request.META['HTTP_HOST'], resource, object_id_part, request.GET.urlencode()
    )


class HostDispatchMiddleware(object):
    """RSR page dispatch middleware."""

    def process_request(self, request):
        """Route on request."""
        request.rsr_page = None
        DEFAULT_REDIRECT_URL = "{}://{}".format(request.scheme, settings.RSR_DOMAIN)

        try:
            # Make sure host is valid - otherwise redirect to RSR_DOMAIN.
            # Do nothing if called on "normal" RSR host.
            host = request.get_host()
            if _is_rsr_host(host):
                return None
        except DisallowedHost:
            request.META['HTTP_HOST'] = settings.RSR_DOMAIN
            return redirect(DEFAULT_REDIRECT_URL)

        # Check if called on naked app domain - if so redirect
        if _is_naked_app_host(host):
            return redirect(DEFAULT_REDIRECT_URL)

        # Check if site exists
        try:
            site = _partner_site(host)
        except PartnerSite.DoesNotExist:
            return redirect(DEFAULT_REDIRECT_URL)

        # Check if site is enabled
        if not site.enabled:
            return redirect(DEFAULT_REDIRECT_URL)

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

        if response is not None:
            response['X-RSR-Version'] = "tag={}, commit={}, branch={}".format(
                context['deploy_tag'],
                context['deploy_commit_id'],
                context['deploy_branch'])
        return response


class APIRedirectMiddleware(object):
    """
    In special cases, the old API links should be redirected:

    - /api/v1/project/ with depth = 1 should be redirected to /api/v1/project_extra/.
    - /api/v1/project/ with depth > 1 should be redirected to /api/v1/project_extra_deep/.
    """
    @staticmethod
    def process_response(request, response):
        project_extra_fields = ['api', 'v1', 'project', ]
        path_list = request.path.split('/')

        if all(field in path_list for field in project_extra_fields):
            try:
                object_id = path_list[4] if len(path_list) > 4 and int(path_list[4]) else None
            except ValueError:
                object_id = None

            depth = request.GET.get('depth')
            if depth == '1':
                return redirect(_build_api_link(request, 'project_extra', object_id))
            if depth > '1':
                return redirect(_build_api_link(request, 'project_extra_deep', object_id))
        return response
