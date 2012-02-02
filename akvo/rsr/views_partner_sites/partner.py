# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.shortcuts import get_object_or_404
from django.http import Http404

from akvo.rsr.views_partner_sites.base import BaseView, BaseListView
from akvo.rsr.models import Organisation

__all__ = [
    'PartnerListView',
    'PartnerView',
    ]


class PartnerListView(BaseListView):
    """Represents the partner list for the current organisation. Makes the
    partners available as partner_list in the template"""
    template_name = 'partner_sites/partners/partner_list.html'
    context_object_name = 'partner_list'

    def get_context_data(self, **kwargs):
        context = super(PartnerListView, self).get_context_data(**kwargs)
        context['organisation'] = self.request.partner_site.organisation
        return context

    def get_queryset(self):
        return self.request.partner_site.organisation.partners().distinct()


class PartnerView(BaseView):
    """Main partner view, 'partner' is available in the template. If the
    organisation is not a partner throw a 404"""
    template_name = 'partner_sites/partners/partner_main.html'

    def get_context_data(self, **kwargs):
        context = super(PartnerView, self).get_context_data(**kwargs)
        context['partner'] = get_object_or_404(
            Organisation, pk=self.kwargs['org_id']
        )
        if context['partner'] != context['organisation'] and \
           context['partner'] not in context['organisation'].partners():
            raise Http404
        return context
