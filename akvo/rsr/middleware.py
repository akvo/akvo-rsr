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

from djangotoolbox.utils import make_tls_property

from akvo.rsr.models import PartnerSite


PARTNER_SITES_ORGANISATION_ID = settings.__class__.PARTNER_SITES_ORGANISATION_ID = make_tls_property()
SITE_ID = settings.__class__.SITE_ID = make_tls_property()


PARTNER_SITES_DEVELOPMENT_DOMAIN = getattr(settings, 'PARTNER_SITES_DEVELOPMENT_DOMAIN', 'akvoapp.dev')
PARTNER_SITES_DOMAINS = getattr(settings, 'PARTNER_SITES_DOMAINS',
        ('akvoapp.org', 'akvotest.org', 'akvotest2.org', 'akvotest3.org', PARTNER_SITES_DEVELOPMENT_DOMAIN))
PARTNER_SITES_MARKETING_SITE = getattr(settings, 'PARTNER_SITES_MARKETING_SITE', 'http://www.akvoapp.org/')


def is_partner_site(domain):
    domain_parts = domain.split('.')
    if len(domain_parts) >= 3:
        domain_name = '%s.%s' % tuple(domain_parts[-2:])
        if domain_name in PARTNER_SITES_DOMAINS:
            return True
    return False


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, partner_site=None):
        host = request.get_host().split(':')
        domain = host[0]
        dev_domains = ('localhost', '127.0.0.1', PARTNER_SITES_DEVELOPMENT_DOMAIN)
        if domain.endswith('akvo.org') or domain in dev_domains:  # Regular RSR instance
            site, created = Site.objects.get_or_create(domain=domain, name=domain)
            request.urlconf = 'akvo.urls.rsr'
        elif domain == PARTNER_SITES_DEVELOPMENT_DOMAIN:
            return redirect(PARTNER_SITES_MARKETING_SITE)
        elif is_partner_site(domain):  # Partner site instance
            hostname = domain.split('.')[-3]
            try:
                partner_site = PartnerSite.objects.get(hostname=hostname)
                if partner_site is not None:
                    site, created = Site.objects.get_or_create(domain=hostname, name=hostname)
            except:
                pass
            if partner_site is None or not partner_site.enabled:
                return redirect(PARTNER_SITES_MARKETING_SITE)
        else:  # Partner site instance on partner-nominated domain
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
                if partner_site is not None:
                    site, created = Site.objects.get_or_create(domain=partner_site.hostname, name=partner_site.hostname)
            except:
                raise Http404
        if partner_site is not None and partner_site.enabled:
            request.partner_site = partner_site
            request.organisation_id = PARTNER_SITES_ORGANISATION_ID = partner_site.organisation.id
            request.urlconf = 'akvo.urls.partner_sites'
        SITE_ID = site.id
        return
