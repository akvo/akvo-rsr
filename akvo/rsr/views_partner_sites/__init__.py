# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.views.generic import TemplateView
from django.shortcuts import get_object_or_404
from ..models import Organisation

class PartnerSitesBaseView(TemplateView):
    """BaseView used only to add the org to the context according to
    the partnersite org_id"""

    def get_context_data(self, **kwargs):
        """Add the current organisation to the context"""
        context = super(PartnerSitesBaseView, self).get_context_data(**kwargs)
        context['organisation'] = get_object_or_404(Organisation,
            pk=self.request.organisation_id)
        return context


class HomeView(PartnerSitesBaseView):
    """Presents the first page in the partner sites hierarchy"""
    template_name = "partner_sites/home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        # Pic 5 projects just for fun
        #context['featured_projects'] = \
        #    self.organisation.published_projects().funding()[:5]
        return context
