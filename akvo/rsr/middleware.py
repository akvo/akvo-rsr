# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.conf.settings import RESERVED_HOSTNAMES
from django.contrib.sites.models import Site


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, partner_site=None):
        domain = request.get_host().split(':')[0]
        if domain.endswith('.dev'):  # local development domain
            try:
                partner_site = Site.objects.get(development_domain=domain)
            except:
                pass
        elif domain.endswith('.akvo.org'):  # akvo dev/production
            parts = domain.split('.')
            num_parts = len(parts)
            if num_parts >= 3:
                hostname = parts[-3]
                if ((num_parts == 3 and not hostname in RESERVED_HOSTNAMES) or
                    (num_parts >=4 and hostname in RESERVED_HOSTNAMES)):
                    try:
                        partner_site = Site.objects.get(domain=domain)
                    except:
                        pass
        else:  # probably a partner-nominated domain
            try:
                partner_site = Site.objects.get(partner_domain=domain)
            except:
                pass
        if partner_site is not None and partner_site.enabled:
            request.partner_id = partner_site.organisation.id
            request.urlconf = 'akvo.urls_partner_sites'
        return
