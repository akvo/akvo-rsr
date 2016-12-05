# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import logging
import json
from django.conf import settings
from django.core.exceptions import DisallowedHost
from django.db.models import Q
from django.core.urlresolvers import (get_resolver, LocaleRegexURLResolver)
from django.shortcuts import redirect
from akvo.rsr.context_processors import extra_context
from akvo.rsr.models import PartnerSite
from django.utils import translation
from django.http import HttpResponseRedirect, HttpResponse


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


class DefaultLanguageMiddleware(object):

    """A non working (BROKEN) default language middleware.

    A try in supporting default languages, but since this will redirect all url_patterns and
    not only i18n ones it's broken.
    """

    def __init__(self):
        """."""
        self._is_language_prefix_patterns_used = False
        for url_pattern in get_resolver(None).url_patterns:
            if isinstance(url_pattern, LocaleRegexURLResolver):
                self._is_language_prefix_patterns_used = True
                break

    def is_language_prefix_patterns_used(self):
        """."""
        return self._is_language_prefix_patterns_used

    def is_i18n_path(self, path):
        """."""
        from akvo.urls import localised_patterns
        print "=> {}".format(localised_patterns)
        from django.core.urlresolvers import resolve, Resolver404
        try:
            resolve(path, localised_patterns)
            return True
        except Resolver404:
            return False
        except TypeError, e:
            return False
        return False

    def process_request(self, request):
        """Redirect to selected language."""
        if not request.rsr_page:
            return None

        if self.is_i18n_path(request.path):
            print "{} was i18n path".format(request.path)
        else:
            print "{} was not 18n path".format(request.path)

        language_from_path = translation.get_language_from_path(request.path_info)
        if not language_from_path:
            if request.rsr_page.default_language:
                lang = request.rsr_page.default_language
                return HttpResponseRedirect('/{}{}'.format(lang, request.path))
            return HttpResponseRedirect('/en{}'.format(request.path))
        return None


class HostDispatchMiddleware(object):

    """RSR page dispath middleware."""

    # def process_request(self, request, cname_domain=False, rsr_page=None):
    def process_request(self, request):
        """Route on request."""
        request.rsr_page = None
        try:
            # Make sure host is valid - otherwise redirect to RSR_DOMAIN.
            # Do nothing if called on "normal" RSR host.
            host = request.get_host()
            if _is_rsr_host(host):
                return None
        except DisallowedHost:
            request.META['HTTP_HOST'] = settings.RSR_DOMAIN
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


class NonHtmlDebugToolbarMiddleware(object):
    """
    The Django Debug Toolbar usually only works for views that return HTML.
    This middleware wraps any non-HTML response in HTML if the request
    has a 'debug' query parameter (e.g. http://localhost/foo?debug)
    Special handling for json (pretty printing) and
    binary data (only show data length)
    """

    @staticmethod
    def process_response(request, response):
        if request.GET.get('debug') == '':
            if response['Content-Type'] == 'application/octet-stream':
                new_content = '<html><body>Binary Data, ' \
                    'Length: {}</body></html>'.format(len(response.content))
                response = HttpResponse(new_content)
            elif response['Content-Type'] != 'text/html':
                content = response.content
                try:
                    json_ = json.loads(content)
                    content = json.dumps(json_, sort_keys=True, indent=2)
                except ValueError:
                    pass
                response = HttpResponse('<html><body><pre>{}'
                                        '</pre></body></html>'.format(content))

        return response
