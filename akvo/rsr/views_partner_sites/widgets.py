# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

import json

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
    """"""
    def get_context_data(self, **kwargs):
        context = super(BaseWidgetView, self).get_context_data(**kwargs)
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        context['project'] = project
        context['app_url'] = self.request.app_url
        context['domain_url'] = self.request.domain_url
        context['style'] = 'darkBG'
        if self.request.GET.get('style') == 'light':
            context['style'] = 'lightBG'
        return context


class GetWidgetView(BaseView):
    template_name = 'partner_sites/widgets/get_widget1.html'

    def post(self, request, *args, **kwargs):
        self.template_name = 'partner_sites/widgets/get_widget2.html'
        context = dict(self.get_context_data().items()
                       + self.get_post_context().items())
        return self.render_to_response(context)

    def get_post_context(self):
        widget_type = self.request.POST.get('widget-type', '')
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        return {
            'widget_type': widget_type,
            'project': project,
        }


class ProjectMapView(TemplateView):
    template_name = 'partner_sites/widgets/projects_map.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectMapView, self).get_context_data(**kwargs)
        context['height'] = self.request.GET.get('height', '300')
        context['width'] = self.request.GET.get('width', '600')
        context['bgcolor'] = self.request.GET.get('bgcolor', 'B50000')
        context['state'] = self.request.GET.get('state', 'dynamic')
        context['organisation'] = (
            get_object_or_404(Organisation, pk=self.request.organisation_id))
        return context


class CobrandedBannerView(BaseWidgetView):
    template_name = 'partner_sites/widgets/cobranded_banner.html'


class ProjectNarrowView(BaseWidgetView):
    template_name = 'partner_sites/widgets/project_narrow.html'


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
        app_url = '%s%s.%s' % (protocol, self.request.partner_site.hostname,
                               settings.APP_DOMAIN_NAME)
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
                        ''' % (app_url, project_url, project.title, 'Location',
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
