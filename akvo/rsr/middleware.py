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


SITE_ID = settings.__class__.SITE_ID = make_tls_property()


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, partner_site=None):
        host = request.get_host().split(':')
        domain = host[0]
        default_dev_domain = getattr(settings, 'PARTNER_SITES_DEVELOPMENT_DOMAIN', 'akvoapp.dev')
        dev_domains = ('localhost', '127.0.0.1', 'akvo.dev', default_dev_domain)
        partner_site_domains = getattr(settings, 'PARTNER_SITES_DOMAINS',
            ('akvoapp.org', 'akvotest.org', 'akvotest2.org', default_dev_domain))
        marketing_site = getattr(settings, 'PARTNER_SITES_MARKETING_SITE', 'http://www.akvoapp.org/')
        if domain.endswith('akvo.org') or domain in dev_domains:  # Regular RSR instance
            site = Site.objects.get(id=2) if domain in dev_domains else Site.objects.get(id=1)
            request.urlconf = 'akvo.urls.rsr'
        elif domain == default_dev_domain:
            return redirect(marketing_site)
        elif (domain.endswith('.akvoapp.org') or
              domain.endswith('.akvotest.org') or
              domain.endswith('.akvotest2.org') or
              domain.endswith('.akvoapp.dev')):  # Partner site instance
            domain_parts = len(domain.split('.'))
            if domain_parts >= 3:
                hostname = domain_parts[-3]
                try:
                    partner_site = PartnerSite.objects.get(hostname=hostname)
                    if partner_site is not None:
                        site = Site.objects.get_or_create(domain=hostname, name=hostname)
                except:
                    pass
            if partner_site is None or not partner_site.enabled:
                return redirect(marketing_site)
        else:  # Partner site instance on partner-nominated domain (probably)
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
                if partner_site is not None:
                    site = Site.objects.get_or_create(domain=partner_site.hostname, name=partner_site.hostname)
            except:
                raise Http404
        if partner_site is not None and partner_site.enabled:
            request.partner_site = partner_site
            request.organisation_id = partner_site.organisation.id
            request.urlconf = 'akvo.urls.partner_sites'
        SITE_ID = site.id
        return
