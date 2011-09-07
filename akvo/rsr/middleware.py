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
        if site is None:
            site = Site.objects.get(id=1)
        domain = request.get_host().split(':')[0]
        if domain.endswith('akvoapp.org') or domain == 'akvoapp.dev':  # Partner site instance
            try:
                url_base = request.path.split('/')[1]
                if url_base:
                    partner_site = PartnerSite.objects.get(url_base=url_base)
                    site = Site.objects.get(id=2)
            except:
                raise Http404
        else:  # Partner site instance on partner-nominated domain
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
                site = Site.objects.get(id=2)
            except:
                pass
        if partner_site is not None:
            organisation_id = partner_site.organisation.id
            request.urlconf = 'akvo.urls_partner_sites'
        SITE_ID.value = site.id
        request.partner_site = partner_site
        request.organisation_id = organisation_id
        return
