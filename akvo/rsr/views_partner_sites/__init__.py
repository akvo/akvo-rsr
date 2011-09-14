# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.views.generic import ListView
from django.shortcuts import get_object_or_404
from ..models import Organisation, Project, ProjectUpdate
from .base import BaseListView, BaseProjectView, BaseView

__all__ = [
    'BaseListView',
    'BaseProjectView',
    'BaseView',
    'ProjectMainView',
    'UpdateDirectoryView',
    'UpdateView'
    ]


class ProjectMainView(BaseProjectView):
    """Extend the project view with the current update"""
    template_name = "partner_sites/project/project_main.html"

    def get_context_data(self, **kwargs):
        context = super(ProjectMainView, self).get_context_data(**kwargs)
        context['updates_with_images'] = context['project'] \
            .project_updates.all().exclude(photo__exact='').order_by('-time')
        return context


class UpdateDirectoryView(ListView):
    """View that adds latest updates to the partner sites home pages. The
    updates are available as "latest_updates" in the template"""
    template_name = "partner_sites/project/update_list.html"
    context_object_name = 'update_list'

    def get_context_data(self, **kwargs):
        context = super(UpdateDirectoryView, self).get_context_data(**kwargs)
        context['organisation'] = \
            get_object_or_404(Organisation, pk=self.request.organisation_id)
        context['project'] = get_object_or_404(Project, \
                                               pk=self.kwargs['project_id'])
        return context

    def get_queryset(self):
        return get_object_or_404(Project, pk=self.kwargs['project_id']) \
            .project_updates.all().order_by('-time')


class UpdateView(BaseProjectView):
    """Extend the project view with the current update"""
    template_name = "partner_sites/project/update_main.html"

    def get_context_data(self, **kwargs):
        context = super(UpdateView, self).get_context_data(**kwargs)
        context['update'] = get_object_or_404(ProjectUpdate,
                                              id=self.kwargs['update_id'])
        return context
