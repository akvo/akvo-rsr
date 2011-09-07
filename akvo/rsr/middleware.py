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

from djangotoolbox.utils import make_tls_property

from akvo.rsr.models import PartnerSite


SITE_ID = settings.__dict__['_wrapped'].__class__.SITE_ID = make_tls_property()


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, organisation_id=None, partner_site=None, site=None):
        if settings.PVW_RSR:
            return
        domain = request.get_host().split(':')[0]
        local_domains = ('akvo.dev', 'localhost', '127.0.0.1')
        if domain in local_domains:  # local development
            if domain in local_domains:
                site = Site.objects.get(domain='akvo.org')
        elif domain.endswith('akvoapp.org') or domain == 'akvoapp.dev':  # Partner Site instance
            try:
                url_base = request.path.split('/')[1]
                if url_base:
                    partner_site = PartnerSite.objects.get(url_base=url_base)
                    site = Site.objects.get(domain='akvoapp.org')
            except:
                site = Site.objects.get(domain='akvo.org')
        elif domain.endswith('akvo.org'):  # Regular Akvo instance
            site = Site.objects.get(domain='akvo.org')
        else:  # probably a partner-nominated domain
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
                site = Site.objects.get(domain='akvoapp.org')
            except:
                raise Http404
        if partner_site is not None:
            organisation_id = partner_site.organisation.id
            request.urlconf = 'akvo.urls_partner_sites'
        SITE_ID.value = site.id
        request.partner_site = partner_site
        request.organisation_id = organisation_id
        return
