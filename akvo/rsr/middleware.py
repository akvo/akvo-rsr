# -*- coding: utf-8 -*-

"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.contrib.sites.models import Site

from akvo.rsr.utils import make_tls_property


SITE_ID = settings.__dict__['_wrapped'].__class__.SITE_ID = make_tls_property()


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, partner_site=None):
        domain = request.get_host().split(':')[0]
        parts = domain.split('.')
        num_parts = len(parts)
        if domain.endswith('.dev'):  # local development domain
            hostname = parts[-2]
            if not hostname == 'akvo':
                try:
                    partner_site = Site.objects.get(development_domain=domain)
                except:
                    pass
        elif domain.endswith('.akvo.org'):  # akvo development/production domain
            if num_parts >= 3:
                hostname = parts[-3]
                if not hostname == 'www':
                    if ((num_parts == 3 and not hostname in settings.RESERVED_HOSTNAMES) or
                        (num_parts >=4 and hostname in settings.RESERVED_HOSTNAMES)):
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
            SITE_ID.value = partner_site.id
            request.organisation_id = partner_site.organisation.id
            request.urlconf = 'akvo.urls_partner_sites'
        return
