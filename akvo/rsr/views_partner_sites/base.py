# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.conf import settings
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView, ListView
from ..models import Organisation, Project


__all__ = [
    'BaseListView',
    'BaseProjectView',
    'BaseView',
    ]


class BaseView(TemplateView):
    """Base view that adds current organisation to the template context or
    throws a 404."""

    def get_context_data(self, **kwargs):
        context = super(BaseView, self).get_context_data(**kwargs)
        context['organisation'] = \
            get_object_or_404(Organisation, pk=self.request.organisation_id)
        context['return_url'] = self.request.partner_site.return_url
        if settings.DEBUG:
            from django.db import connection
            context['queries'] = connection.queries
        return context


class BaseListView(ListView):
    """List view that are extended with the current organisation and the
    proejcts connected to the organisation available in the template context
    variable project_list"""
    context_object_name = 'project_list'

    def get_context_data(self, **kwargs):
        context = super(BaseListView, self).get_context_data(**kwargs)
        context['organisation'] = \
            get_object_or_404(Organisation, pk=self.request.organisation_id)
        context['return_url'] = self.request.partner_site.return_url
        if settings.DEBUG:
            from django.db import connection
            context['queries'] = connection.queries
        return context

    def get_queryset(self):
        return get_object_or_404(Organisation,
                                 pk=self.request.organisation_id) \
                                    .published_projects().funding() \
                                    .order_by('id')


class BaseProjectView(BaseView):
    """View that extends BaseView with current project or throws a 404. We
    also verify that the project is related to the current organisation"""

    def get_context_data(self, **kwargs):
        context = super(BaseProjectView, self).get_context_data(**kwargs)
        context['project'] = \
            get_object_or_404(Project, pk=self.kwargs['project_id'])
        if context['project'] not in context['organisation'] \
            .published_projects():
            raise Http404
        return context
