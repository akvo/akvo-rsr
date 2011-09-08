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


DOMAIN_NAME = settings.__dict__['_wrapped'].__class__.DOMAIN_NAME = make_tls_property()
SITE_ID = settings.__dict__['_wrapped'].__class__.SITE_ID = make_tls_property()


class PartnerSitesRouterMiddleware(object):
    def process_request(self, request, hostname='', port=None, partner_site=None):
        if settings.PVW_RSR:
            return
        host = request.get_host().split(':')
        domain = host[0]
        if len(host) == 2:
            port = int(host[1])
        domain_parts = domain.split('.')
        local_domains = ('localhost', '127.0.0.1', 'akvo.dev')
        if domain.endswith('akvo.org') or domain in local_domains:  # Regular RSR instance
            if domain in local_domains:
                domain_name = 'akvo.dev'
            site = Site.objects.get(id=1)
            request.urlconf = 'akvo.urls.rsr'
        elif domain == 'www.akvoapp.org' or domain == 'akvoapp.dev':  # Partner sites marketing instance
            domain_name = domain
            site = Site.objects.get(id=2)
            request.urlconf = 'akvo.urls.partner_sites_marketing'
        elif ((domain.endswith('.akvoapp.org') and not domain == 'www.akvoapp.org') or
              domain.endswith('.akvoapp.dev')):  # Partner site instance
            domain_name = domain
            site = Site.objects.get(id=2)
            if len(domain_parts) == 3:  # matches hostname.akvoapp.org|dev
                hostname = domain_parts[-3]
            elif domain_parts[-1] == 'org' and len(domain_parts) >= 4:  # matches hostname.test.akvoapp.org
                hostname = domain_parts[-4]
            try:
                partner_site = PartnerSite.objects.get(hostname=hostname)
            except:
                host = u'.'.join(domain_parts[-2:])
                if port is not None:
                    host = u'%s:%d' % (host, port)
                if host.startswith('akvoapp.org'):
                    redirect_url = u'http://www.%s/' % host
                elif host.startswith('akvoapp.dev'):
                    redirect_url = u'http://%s/' % host
                return redirect(redirect_url)
        else:  # Partner site instance on partner-nominated domain
            site = Site.objects.get(id=2)
            try:
                partner_site = PartnerSite.objects.get(cname=domain)
                domain_name = '%s.akvoapp.org' % partner_site.hostname
            except:
                raise Http404
        if partner_site is not None:
            if partner_site.enabled:
                request.partner_site = partner_site
                request.organisation_id = partner_site.organisation.id
                request.urlconf = 'akvo.urls.partner_sites'
        DOMAIN_NAME.value = domain_name
        SITE_ID.value = site.id
        return
