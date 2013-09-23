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

from akvo.rsr.models import PartnerSite
import re


__all__ = ["PartnerSitesLocaleMiddleware",
           "PartnerSitesRouterMiddleware",
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


DEFAULT_SITE_ID = getattr(settings, "SITE_ID", None)
settings.__class__.SITE_ID = make_tls_property(DEFAULT_SITE_ID)

DEFAULT_PARTNER_SITE = getattr(settings, "PARTNER_SITE", None)
settings.__class__.PARTNER_SITE = make_tls_property(DEFAULT_PARTNER_SITE)


PARTNER_SITES_MARKETING_SITE = getattr(
    settings,
    "PARTNER_SITES_MARKETING_SITE",
    "http://www.akvoapp.org/"
)

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


def is_partner_site_instance(hostname):
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


class PartnerSitesRouterMiddleware(object):

    def process_request(self, request, cname_domain=False, partner_site=None):

        domain = get_domain(request)

        if is_rsr_instance(domain):
            urlconf = "akvo.urls.rsr"

        elif is_partner_site_instance(domain):
            urlconf = "akvo.urls.partner_sites"
            try:
                domain_parts = domain.split(".")
                hostname = domain_parts[0]
                if hostname == 'www':
                    hostname = domain_parts[1]

                partner_site = PartnerSite.objects.get(hostname=hostname)
            except:
                pass
            if partner_site is None or not partner_site.enabled:
                return redirect(PARTNER_SITES_MARKETING_SITE)

        else:  # Probably a partner site instance on partner-nominated domain
            cname_domain = True
            urlconf = "akvo.urls.partner_sites"
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
            except:
                return redirect(PARTNER_SITES_MARKETING_SITE)

        request.urlconf = urlconf
        set_urlconf(urlconf)

        if partner_site is not None and partner_site.enabled:
            if cname_domain:
                partner_site_domain = "akvoapp.org"
            else:
                partner_site_domain = ".".join(domain.split(".")[1:])
            request.partner_site = settings.PARTNER_SITE = partner_site
            request.app_domain = ".".join(
                (partner_site.hostname, partner_site_domain)
            )
            request.app_url = "http://%s" % request.app_domain
            request.organisation_id = partner_site.organisation.id
            request.default_language = partner_site.default_language

        request.domain_url = "http://%s" % settings.DOMAIN_NAME
        site = get_or_create_site(domain)
        settings.SITE_ID = site.id
        return


class PartnerSitesLocaleMiddleware(LocaleMiddleware):
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
            urlconf = getattr(request, 'urlconf', None)
            language_path = '/%s%s' % (language, request.path_info)
            if settings.APPEND_SLASH and not language_path.endswith('/'):
                language_path += '/'

            if is_valid_path(language_path, urlconf):
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
        for url_pattern in get_resolver(request.urlconf).url_patterns:
            if isinstance(url_pattern, LocaleRegexURLResolver):
                return True
        return False
