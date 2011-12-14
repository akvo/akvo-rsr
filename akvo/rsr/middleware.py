# -*- coding: utf-8 -*-

"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.http import Http404
from django.shortcuts import redirect

from akvo.rsr.models import PartnerSite


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, partner_site=None):
        host = request.get_host().split(':')
        domain = host[0]
        local_development_domains = ('localhost', '127.0.0.1', 'akvo.dev')
        marketing_site_url = 'http://www.akvoapp.org/'
        if domain.endswith('akvo.org') or domain in local_development_domains:  # Regular RSR instance
            request.urlconf = 'akvo.urls.rsr'
        elif domain == 'akvoapp.dev':
            return redirect(marketing_site_url)
        elif (domain.endswith('.akvoapp.org') or
              domain.endswith('.akvotest.org') or
              domain.endswith('.akvoapp.dev')):  # Partner site instance
            domain_parts = domain.split('.')
            if len(domain_parts) >= 3:  # matches (*.)hostname.akvoapp|akvotest.org and (*.)hostname.akvoapp.dev
                hostname = domain_parts[-3]
                try:
                    partner_site = PartnerSite.objects.get(hostname=hostname)
                except:
                    pass
            if partner_site is None or not partner_site.enabled:
                return redirect(marketing_site_url)
        else:  # Partner site instance on partner-nominated domain (probably)
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
            except:
                raise Http404
        if partner_site is not None and partner_site.enabled:
            request.partner_site = partner_site
            request.organisation_id = partner_site.organisation.id
            request.urlconf = 'akvo.urls.partner_sites'
        return
