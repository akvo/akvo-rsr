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
    def process_request(self, request, organisation_id=None, partner_site=None):
        if settings.PVW_RSR:
            return
        domain = request.get_host().split(':')[0]
        domain_parts = domain.split('.')
        local_domains = ('localhost', '127.0.0.1', 'akvo.dev')
        if domain.endswith('akvo.org') or domain in local_domains:  # Regular RSR instance
            site = Site.objects.get(id=1)
        elif domain.endswith('akvoapp.org') or domain.endswith('akvoapp.dev'):  # Partner site instance
            site = Site.objects.get(id=2)
            if len(domain_parts) == 3:
                url_base = domain_parts[-3]
            elif len(domain_parts) >= 4:
                url_base = domain_parts[-4]
            try:
                partner_site = PartnerSite.objects.get(url_base=url_base)
            except:
                pass
        else:  # Partner site instance on partner-nominated domain
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
                site = Site.objects.get(id=2)
            except:
                raise Http404
        if partner_site is not None:
            organisation_id = partner_site.organisation.id
            request.partner_site = partner_site
            request.organisation_id = organisation_id
            request.urlconf = 'akvo.urls.partner_sites'
        SITE_ID.value = site.id
        return
