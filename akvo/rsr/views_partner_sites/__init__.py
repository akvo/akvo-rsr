# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from ..models import Organisation, Project, ProjectUpdate
from .base import BaseProjectListView, BaseProjectView, BaseView, BaseListView

__all__ = [
    'HomeView',
    'PartnerListView',
    'PartnerView',
    'ProjectFundingView',
    'ProjectMainView',
    'ProjectUpdateListView',
    'ProjectUpdateView',
    ]


class HomeView(BaseProjectListView):
    """View represents the home page"""
    template_name = 'partner_sites/home.html'


class ProjectMainView(BaseProjectView):
    """Extend the BaseProjectView with benchmarks """
    template_name = "partner_sites/project/project_main.html"

    def get_context_data(self, **kwargs):
        context = super(ProjectMainView, self).get_context_data(**kwargs)
        context['benchmarks'] = context['project'].benchmarks \
            .filter(category__in=[category for category in context['project']
                .categories.all()
                    if context['project'].benchmarks \
                        .filter(category=category) \
                            .aggregate(Sum('value'))['value__sum']
            ])
        return context


class ProjectFundingView(BaseProjectView):
    """View that represents the project funding page"""
    template_name = 'partner_sites/project/project_funding.html'


class ProjectUpdateListView(BaseListView):
    """View that adds latest updates to the partner sites home pages. The
    updates are available as "latest_updates" in the template"""
    template_name = "partner_sites/project/update_list.html"
    context_object_name = 'update_list'

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateListView, self).get_context_data(**kwargs)
        context['project'] = get_object_or_404(Project, \
                                               pk=self.kwargs['project_id'])
        return context

    def get_queryset(self):
        return get_object_or_404(Project, pk=self.kwargs['project_id']) \
            .project_updates.all().order_by('-time')


class ProjectUpdateView(BaseProjectView):
    """Extend the project view with the current update"""
    template_name = "partner_sites/project/update_main.html"

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateView, self).get_context_data(**kwargs)
        context['update'] = get_object_or_404(ProjectUpdate,
                                              id=self.kwargs['update_id'])
        return context


class PartnerListView(BaseListView):
    """Represents the partner list"""
    template_name = 'partner_sites/partners/partner_list.html'
    context_object_name = 'partner_list'

    def get_context_data(self, **kwargs):
        context = super(PartnerListView, self).get_context_data(**kwargs)
        context['organisation'] = \
            get_object_or_404(Organisation, pk=self.request.organisation_id)
        return context

    def get_queryset(self):
        return get_object_or_404(Organisation,
                                 pk=self.request.organisation_id) \
            .partners().distinct()


class PartnerView(BaseView):
    """Main partner view"""
    template_name = 'partner_sites/partners/partner_main.html'

    def get_context_data(self, **kwargs):
        context = super(PartnerView, self).get_context_data(**kwargs)
        context['partner'] = \
            get_object_or_404(Organisation, pk=self.kwargs['partner_id'])
        return context
