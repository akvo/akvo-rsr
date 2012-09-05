# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.utils.translation import ugettext_lazy as _
from akvo.rsr.views_partner_sites.base import BaseView

__all__ = [
    'ForbiddenView',
    'NotFoundView',
    ]


class ForbiddenView(BaseView):
    '''Custom 403 view'''
    template_name = "partner_sites/status/403.html"

    def render_to_response(self, context, **kwargs):
        kwargs.update(dict(status=403))
        # template needs to be rendered for later middleware not to complain
        return super(ForbiddenView, self).render_to_response(context, **kwargs).render()

    def get_context_data(self, **kwargs):
        context = super(ForbiddenView, self).get_context_data(**kwargs)
        try:
            message = self.request.error_message
        except AttributeError:
            message = _(u'We\'re sorry, you are not allowed to access this page.')
        context['error_message'] = message
        return context


class NotFoundView(BaseView):
    "View returning http status 404, not found"
    template_name = 'partner_sites/status/404.html'

    def render_to_response(self, context, **kwargs):
        kwargs.update(dict(status=404))
        # template needs to be rendered for later middleware not to complain
        return super(NotFoundView, self).render_to_response(context, **kwargs).render()
