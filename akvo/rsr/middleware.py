# -*- coding: utf-8 -*-

"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.contrib.sites.models import Site
from django.http import Http404
from django.shortcuts import redirect

from akvo.rsr.models import PartnerSite


def make_tls_property(default=None):
    """Creates a class-wide instance property with a thread-specific value."""
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


DEFAULT_SITE_ID = getattr(settings, 'SITE_ID', None)
settings.__class__.SITE_ID = make_tls_property(DEFAULT_SITE_ID)

DEFAULT_PARTNER_SITE = getattr(settings, 'PARTNER_SITE', None)
settings.__class__.PARTNER_SITE = make_tls_property(DEFAULT_PARTNER_SITE)

PARTNER_SITES_DEVELOPMENT_DOMAIN = getattr(settings, 'PARTNER_SITES_DEVELOPMENT_DOMAIN', 'akvoapp.dev')
PARTNER_SITES_DOMAINS = getattr(settings, 'PARTNER_SITES_DOMAINS',
        ('akvoapp.org', 'akvotest.org', 'akvotest2.org', 'akvotest3.org', PARTNER_SITES_DEVELOPMENT_DOMAIN))
PARTNER_SITES_MARKETING_SITE = getattr(settings, 'PARTNER_SITES_MARKETING_SITE', 'http://www.akvoapp.org/')


def is_rsr(domain):
    """Predicate to determine if an incoming request domain should be handled as a regular instance of Akvo RSR."""
    dev_domains = ('localhost', '127.0.0.1', 'akvo.dev')
    if domain == 'akvo.org' or domain.endswith('.akvo.org') or domain in dev_domains:
        return True
    return False


def is_partner_site(domain):
    """Predicate to determine if an incoming request domain should be handled as a partner site instance."""
    domain_parts = tuple(domain.split('.'))
    if len(domain_parts) >= 3:
        domain_name = '%s.%s' % domain_parts[-2:]
        if domain_name in PARTNER_SITES_DOMAINS:
            return True
    return False


def get_or_create_site(domain):
    try:
        sites = Site.objects.filter(domain=domain)
        site, duplicates = sites[0], sites[1:]
        if duplicates:
            for duplicate in duplicates:
                duplicate.delete()
    except DoesNotExist:
        site = Site(domain=domain, name=name)
    return site


class PartnerSitesRouterMiddleware(object):

    def process_request(self, request, partner_site=None):
        domain = request.get_host().split(':')[0]
        if is_rsr(domain):  # Vanilla Akvo RSR instance
            get_or_create_site(domain)
            request.urlconf = 'akvo.urls.rsr'
        elif is_partner_site(domain):  # Partner site instance
            hostname = domain.split('.')[-3]
            try:
                partner_site = PartnerSite.objects.get(hostname=hostname)
                if partner_site is not None:
                    site = get_or_create_site(hostname)
            except:
                pass
            if partner_site is None or not partner_site.enabled:
                return redirect(PARTNER_SITES_MARKETING_SITE)
        else:  # Partner site instance on partner-nominated domain
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
                if partner_site is not None:
                    site = get_or_create_site(partner_site.hostname)
            except:
                raise Http404
        if partner_site is not None and partner_site.enabled:
            request.partner_site = settings.PARTNER_SITE = partner_site
            request.organisation_id = partner_site.organisation.id
            request.urlconf = 'akvo.urls.partner_sites'
        settings.SITE_ID = site.id
        return
