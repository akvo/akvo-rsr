# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

import json
import random

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from django.core.urlresolvers import reverse

from akvo.rsr.views_partner_sites.base import BaseView
from akvo.rsr.models import Organisation, Project


__all__ = [
    'GetWidgetView',
    'ProjectMapView',
    'CobrandedBannerView',
    'ProjectNarrowView',
    'ProjectCordinates',
]


class BaseWidgetView(TemplateView):
    """Setup a common base widget"""
    def get_context_data(self, **kwargs):
        context = super(BaseWidgetView, self).get_context_data(**kwargs)
        context['akvoapp_root_url'] = self.request.akvoapp_root_url
        context['domain_url'] = self.request.domain_url
        context['style'] = 'darkBG'
        if self.request.GET.get('style') == 'light':
            context['style'] = 'lightBG'
        return context


class ProjectBaseWidgetView(BaseWidgetView):
    """Extends the base widget with a project from url"""
    def get_context_data(self, **kwargs):
        context = super(ProjectBaseWidgetView, self).get_context_data(**kwargs)
        context['project'] = get_object_or_404(
            Project, pk=self.kwargs['project_id'])
        return context


class RandomBaseWidgetView(BaseWidgetView):
    """Extends the base widget with random project"""
    def get_context_data(self, **kwargs):
        context = super(RandomBaseWidgetView, self).get_context_data(**kwargs)
        partner = get_object_or_404(
            Organisation, pk=self.request.organisation_id)
        context['project'] = random.choice(partner.active_projects())
        return context


class CobrandedBannerView(ProjectBaseWidgetView):
    template_name = 'partner_sites/widgets/cobranded_banner.html'


class RandomCobrandedBannerView(RandomBaseWidgetView):
    template_name = 'partner_sites/widgets/cobranded_banner.html'


class ProjectNarrowView(ProjectBaseWidgetView):
    template_name = 'partner_sites/widgets/project_narrow.html'


class RandomProjectNarrowView(RandomBaseWidgetView):
    template_name = 'partner_sites/widgets/project_narrow.html'


class ProjectSmallView(ProjectBaseWidgetView):
    template_name = 'partner_sites/widgets/project_small.html'


class RandomProjectSmallView(RandomBaseWidgetView):
    template_name = 'partner_sites/widgets/project_small.html'


class ProjectListView(BaseWidgetView):
    template_name = 'partner_sites/widgets/project_list.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectListView, self).get_context_data(**kwargs)

        order_by = self.request.GET.get('order_by', 'title')
        organisation = (
            get_object_or_404(Organisation, pk=self.request.organisation_id))

        projects = organisation.published_projects(). \
            status_not_archived().status_not_cancelled()
        sql = (
            'SELECT MAX(time) '
            'FROM rsr_projectupdate '
            'WHERE project_id = rsr_project.id'
        )
        projects = projects.extra(select={'last_update': sql})

        if order_by == 'status':
            projects = projects.order_by('status', 'title')
        elif order_by == 'last_update':
            projects = projects.order_by('-last_update', 'title')
        elif order_by in ['budget', 'funds_needed']:
            projects = projects.extra(order_by=['-%s' % order_by, 'title'])
        else:
            projects = projects.order_by('title')  # default to project title

        context['organisation'] = organisation
        context['projects'] = projects
        return context


class ProjectMapView(TemplateView):
    template_name = 'partner_sites/widgets/projects_map.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectMapView, self).get_context_data(**kwargs)
        context['height'] = self.request.GET.get('height', '300')
        context['width'] = self.request.GET.get('width', '600')
        context['state'] = self.request.GET.get('state', 'dynamic')
        context['organisation'] = (
            get_object_or_404(Organisation, pk=self.request.organisation_id))

        # To handle old free form coloring via the bgcolor query parameter
        # the new way should be to use the "style" parameter with
        # dark(default) or light.
        context['bgcolor'] = self.request.GET.get('bgcolor')
        if not context['bgcolor']:
            context['bgcolor'] = '303030'
            if self.request.GET.get('style') == 'light':
                context['bgcolor'] = 'fff'
        return context


class GetWidgetView(BaseView):
    template_name = 'partner_sites/widgets/get_widget1.html'

    def get_context_data(self, **kwargs):
        context = super(GetWidgetView, self).get_context_data(**kwargs)
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        context['project'] = project
        return context

    def post(self, request, *args, **kwargs):
        self.template_name = 'partner_sites/widgets/get_widget2.html'
        context = dict(self.get_context_data().items()
                       + self.get_post_context().items())
        return self.render_to_response(context)

    def get_post_context(self):
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        kind = self.request.POST.get('kind')
        source = self.request.POST.get('source', 'specific')
        return {
            'project': project,
            'widget_kind': kind,
            'widget_source': source
        }


class ProjectCordinates(TemplateView):

    def get_queryset(self):
        projects = (
            get_object_or_404(Organisation,
                              pk=self.request.organisation_id)
            .published_projects().latest_update_fields().order_by('-id')
        )
        return projects

    def render_to_response(self, context, **kwargs):
        return HttpResponse(context, content_type='application/json', **kwargs)

    def get_context_data(self, **kwargs):
        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = 'https://'
        else:
            protocol = 'http://'
        akvoapp_root_url = '%s%s.%s' % (protocol, self.request.partner_site.hostname,
                               getattr(settings, 'AKVOAPP_DOMAIN', 'akvoapp.org'))
        projects = self.get_queryset()
        content = {'projects': []}

        for project in projects:
            project_url = reverse('project_main',
                                  kwargs={'project_id': project.id})

            info_window = '''
                            <div class="mapInfoWindow">
                                <a href="%s%s">%s</a><br>
                                <p class="small grey">
                                    %s: %s, %s
                                </p>
                            </div>
                        ''' % (akvoapp_root_url, project_url, project.title, 'Location',
                               project.primary_location.country.continent,
                               project.primary_location.city)

            content['projects'] \
                .append(dict(title=project.title,
                             latitude=project.primary_location.latitude,
                             longitude=project.primary_location.longitude,
                             content=info_window,
                             ))

        # Build jsonp with callback
        callback = self.request.GET.get('callback', '')
        return callback + '(' + json.dumps(content) + ');'
