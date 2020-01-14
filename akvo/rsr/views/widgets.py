# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


import random

from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from akvo.rsr.models import Organisation, Project


__all__ = [
    'ProjectMapView',
    'CobrandedBannerView',
    'ProjectNarrowView',
]


class BaseWidgetView(TemplateView):

    """Setup a common base widget."""

    def get_context_data(self, **kwargs):
        context = super(BaseWidgetView, self).get_context_data(**kwargs)
        context['style'] = 'darkBG'
        if self.request.GET.get('style') == 'light':
            context['style'] = 'lightBG'
        return context


class ProjectBaseWidgetView(BaseWidgetView):

    """Extends the base widget with a project from url."""

    def get_context_data(self, **kwargs):
        context = super(ProjectBaseWidgetView, self).get_context_data(**kwargs)
        context['project'] = get_object_or_404(
            Project, pk=int(self.kwargs['project_id']))
        return context


class RandomBaseWidgetView(BaseWidgetView):

    """Extends the base widget with random project."""

    def get_context_data(self, **kwargs):
        context = super(RandomBaseWidgetView, self).get_context_data(**kwargs)
        org_id = self.request.GET.get('organisation_id', '0')
        organisation = get_object_or_404(Organisation, pk=org_id)
        context['project'] = random.choice(organisation.active_projects())
        return context


class CobrandedBannerView(ProjectBaseWidgetView):
    template_name = 'widgets/cobranded_banner.html'


class RandomCobrandedBannerView(RandomBaseWidgetView):
    template_name = 'widgets/cobranded_banner.html'


class ProjectNarrowView(ProjectBaseWidgetView):
    template_name = 'widgets/project_narrow.html'


class RandomProjectNarrowView(RandomBaseWidgetView):
    template_name = 'widgets/project_narrow.html'


class ProjectSmallView(ProjectBaseWidgetView):
    template_name = 'widgets/project_small.html'


class RandomProjectSmallView(RandomBaseWidgetView):
    template_name = 'widgets/project_small.html'


class ProjectListView(BaseWidgetView):
    template_name = 'widgets/project_list.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectListView, self).get_context_data(**kwargs)
        order_by = self.request.GET.get('order_by', 'title')
        org_id = self.request.GET.get('organisation_id')
        organisation = get_object_or_404(Organisation, pk=org_id)
        projects = organisation.active_projects().select_related(
            'publishingstatus',
            'primary_location',
            'primary_location__country',
            'last_update',
        ).prefetch_related(
            'recipient_countries',
            'partnerships',
            'partnerships__organisation',
        )

        if order_by == 'status':
            projects = projects.order_by('status', 'title')
        elif order_by == 'last_update':
            projects = projects.order_by('-last_update', 'title')
        elif order_by in ['budget', 'funds_needed']:
            projects = projects.extra(order_by=['-%s' % order_by, 'title'])
        else:
            projects = projects.order_by('title')  # default to project title

        context['organisation'] = organisation
        context['projects_count'] = projects.count()  # Limit to 100 projects
        context['projects'] = projects[:100]  # Limit to 100 projects
        return context


class ProjectMapView(BaseWidgetView):
    template_name = 'widgets/projects_map.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectMapView, self).get_context_data(**kwargs)
        context['height'] = self.request.GET.get('height', '300')
        context['heightpx'] = str(int(context['height']) - 30) + 'px'
        context['width'] = self.request.GET.get('width', '600')
        context['widthpx'] = str(context['width']) + 'px'
        context['style'] = self.request.GET.get('style', 'dark')
        context['state'] = self.request.GET.get('state', 'dynamic')
        org_id = self.request.GET.get('organisation_id')
        organisation = get_object_or_404(Organisation, pk=org_id)
        context['projects'] = organisation.active_projects()
        return context
