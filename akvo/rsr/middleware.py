# -*- coding: utf-8 -*-

"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.

"""

from django.conf import settings
from django.contrib.sites.models import Site
from django.core.urlresolvers import (LocaleRegexURLResolver, is_valid_path,
                                      get_resolver, set_urlconf)
from django.http import HttpResponseRedirect
from django.middleware.locale import LocaleMiddleware
from django.shortcuts import redirect
from django.utils import translation
from django.utils.cache import patch_vary_headers
from akvo.rsr.context_processors import extra_context

from akvo.rsr.models import PartnerSite

import logging
import re


__all__ = ["PagesLocaleMiddleware",
           "PagesRouterMiddleware",
           "get_domain",
           "get_or_create_site",
           "is_partner_site_instance",
           "is_rsr_instance",
           "make_tls_property"]


def make_tls_property(default=None):
    "Creates a class-wide instance property with a thread-specific value."
    class TLSProperty(object):
        def __init__(self):
            from threading import local
            self.local = local()

        def __get__(self, instance, cls):
            if not instance:
                return self
            return self.value

        def __set__(self, instance, value):
            self.value = value

        def _get_value(self):
            return getattr(self.local, 'value', default)

        def _set_value(self, value):
            self.local.value = value
        value = property(_get_value, _set_value)

    return TLSProperty()


def _patch_setattr(obj):
    """Purpose of this is to allow changes to settings object again after it is
    changed to tls property.

    Without this patch the following is not possible::

        settings.SITE_ID = 1
        settings.SITE_ID = 42
        assert settings.SITE_ID == 42 # this fails without this patch

    """
    old_setattr = obj.__setattr__
    def wrap_setattr(self, name, value):
        try:
            getattr(self.__class__, name).value = value
        except AttributeError:
            old_setattr(name, value)
    obj.__class__.__setattr__ = wrap_setattr


_patch_setattr(settings)

DEFAULT_SITE_ID = getattr(settings, "SITE_ID", None)
DEFAULT_PARTNER_SITE = getattr(settings, "PARTNER_SITE", None)

settings.__class__.SITE_ID = make_tls_property(DEFAULT_SITE_ID)
settings.__class__.PARTNER_SITE = make_tls_property(DEFAULT_PARTNER_SITE)

RSR_SITE_REGEXPS = map(re.compile, settings.RSR_SITE_REGEXPS)
PARTNER_SITE_REGEXPS = map(re.compile, settings.PARTNER_SITE_REGEXPS)


def get_domain(request):
    original_domain = request.get_host().split(":")[0]
    if original_domain == "rsr.akvo.org":
        domain = original_domain
    else:
        domain_parts = original_domain.split(".")[-4:]
        domain = ".".join(domain_parts)
    return domain


def is_rsr_instance(hostname):
    return any([site.search(hostname) for site in RSR_SITE_REGEXPS])


def is_rsr_page_instance(hostname):
    return any([site.search(hostname) for site in PARTNER_SITE_REGEXPS])


def get_or_create_site(domain):
    if domain.startswith('www.'):
        domain = domain[4:]

    # As a result of an issue(1) we need to ensure that we don't
    # delete the fixture should we find duplicates
    # There is no guaranteed ordering(2) we should explicitly order them in such
    # a way that the fixture would appear first, i.e. by ensuring 'ORDER BY id ASC'
    #
    # (1) https://github.com/akvo/akvo-provisioning/issues/29
    # (2) http://stackoverflow.com/questions/7163640/what-is-the-default-order-of-a-list-returned-from-a-django-filter-call
    sites = Site.objects.filter(domain=domain).order_by('id')
    if sites.count() >= 1:
        site, duplicates = sites[0], sites[1:]
        if duplicates.count():
            for duplicate in duplicates:
                duplicate.delete()
    else:
        site = Site(domain=domain, name=domain)
        site.save()
    return site


class PagesRouterMiddleware(object):

    def process_request(self, request, cname_domain=False, rsr_page=None):

        domain = get_domain(request)

        if is_rsr_instance(domain):
            request.rsr_page = None

        elif is_rsr_page_instance(domain):
            try:
                domain_parts = domain.split(".")
                hostname = domain_parts[0]
                if hostname == 'www':
                    hostname = domain_parts[1]

                rsr_page = PartnerSite.objects.get(hostname=hostname)
            except:
                pass
            if rsr_page is None or not rsr_page.enabled:
                return redirect("http://rsr.akvo.org")

        else:  # Probably an RSR Page instance on partner-nominated domain
            cname_domain = True
            try:
                rsr_page = PartnerSite.objects.get(cname=domain)
            except:
                return redirect("http://rsr.akvo.org")

        if rsr_page is not None and rsr_page.enabled:
            if cname_domain:
                rsr_page_domain = getattr(settings, 'AKVOAPP_DOMAIN', 'akvoapp.org')
            else:
                rsr_page_domain = ".".join(domain.split(".")[1:])
            request.rsr_page = settings.RSR_PAGE = rsr_page
            request.app_domain = ".".join(
                (rsr_page.hostname, rsr_page_domain)
            )
            request.akvoapp_root_url = "http://%s" % request.app_domain
            request.organisation_id = rsr_page.organisation.id
            request.rsr_page = rsr_page
            request.default_language = rsr_page.default_language

        request.domain_url = "http://%s" % settings.RSR_DOMAIN
        site = get_or_create_site(domain)
        settings.SITE_ID = site.id
        return


class PagesLocaleMiddleware(LocaleMiddleware):
    """
    Partner sites aware version of Django's LocaleMiddleware. Since we
    swap out the root urlconf for a partner sites specific one, and the
    original Django LocaleMiddleware didn't like that.

    """

    def process_request(self, request):
        check_path = self.is_language_prefix_patterns_used(request)
        language = translation.get_language_from_request(
            request, check_path=check_path)
        translation.activate(language)
        request.LANGUAGE_CODE = translation.get_language()

    def process_response(self, request, response):
        # First set the default language, this will be used if there is none
        # in the path
        default_language = getattr(request, 'default_language', '')
        if default_language:
            translation.activate(default_language)

        language = translation.get_language()
        if (response.status_code == 404 and
                not translation.get_language_from_path(request.path_info) and
                self.is_language_prefix_patterns_used(request)):
            language_path = '/%s%s' % (language, request.path_info)
            if settings.APPEND_SLASH and not language_path.endswith('/'):
                language_path += '/'

            if is_valid_path(language_path, settings.ROOT_URLCONF):
                language_url = "%s://%s/%s%s" % (
                    request.is_secure() and 'https' or 'http',
                    request.get_host(), language, request.get_full_path())
                return HttpResponseRedirect(language_url)
        translation.deactivate()

        patch_vary_headers(response, ('Accept-Language',))
        if 'Content-Language' not in response:
            response['Content-Language'] = language
        return response

    def is_language_prefix_patterns_used(self, request):
        """Returns `True` if the `LocaleRegexURLResolver` is used
        at root level of the urlpatterns, else it returns `False`."""
        urlconf = getattr(request, 'urlconf', None)
        for url_pattern in get_resolver(urlconf).url_patterns:
            if isinstance(url_pattern, LocaleRegexURLResolver):
                return True
        return False


class ExceptionLoggingMiddleware(object):
    """ Used to log exceptions on production systems
    """
    def process_exception(self, request, exception):

        logging.exception('Exception handling request for ' + request.path)


class RSRVersionHeaderMiddleware(object):
    """ Add a response header with RSR version info
    """
    def process_response(self, request, response):
        context = extra_context(request)
        response['X-RSR-Version'] = "Tag:{deploy_tag} Commit:{deploy_commit_id} Branch:{deploy_branch}".format(
                deploy_tag=context['deploy_tag'],
                deploy_commit_id=context['deploy_commit_id'],
                deploy_branch=context['deploy_branch'],
            )
        return response
