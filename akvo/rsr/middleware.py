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

from akvo.rsr.utils import make_tls_property


SITE_ID = settings.__dict__['_wrapped'].__class__.SITE_ID = make_tls_property()


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, site=None):
        domain = request.get_host().split(':')[0]
        parts = domain.split('.')
        if domain.endswith('.dev'):  # local development domain
            try:
                site = Site.objects.get(development_domain=domain)
            except:
                raise Http404
        elif domain.endswith('.akvo.org'):  # akvo development/production domain
            try:
                site = Site.objects.get(domain=domain)
            except:
                site = Site.objects.get(domain='www.akvo.org')
                request.host = site.domain
        else:  # probably a partner-nominated domain
            try:
                site = Site.objects.get(partner_domain=domain)
            except:
                raise Http404
        if site is not None and site.enabled:
            SITE_ID.value = site.id
            if site.is_partner_site:
                request.organisation_id = site.organisation.id
                request.urlconf = 'akvo.urls_partner_sites'
        return
