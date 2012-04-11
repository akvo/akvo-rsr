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

from akvo.rsr.models import Organisation, Project

__all__ = [
    'BaseProjectListView',
    'BaseProjectView',
    'BaseListView',
    'BaseView',
    ]


class DebugViewMixin(object):
    """In debug mode show query information"""

    def get_context_data(self, **kwargs):
        context = super(DebugViewMixin, self).get_context_data(**kwargs)
        if settings.DEBUG:
            from django.db import connection
            context['queries'] = connection.queries
        return context


class PartnerSitesMixin(object):
    """Add partner sites context info to the request"""

    def get_context_data(self, **kwargs):
        context = super(PartnerSitesMixin, self).get_context_data(**kwargs)
        context['favicon'] = self.request.partner_site.favicon
        context['logo'] = self.request.partner_site.logo
        context['organisation'] = \
            get_object_or_404(Organisation, pk=self.request.organisation_id)
        context['return_url'] = self.request.partner_site.return_url
        context['stylesheet'] = self.request.partner_site.stylesheet

        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = 'https://'
        else:
            protocol = 'http://'
        context['app_url'] = '%s%s.%s' % (protocol, \
                                          self.request.partner_site.hostname,
                                          settings.APP_DOMAIN_NAME)
        context['domain_url'] = '%s%s' % (protocol, settings.DOMAIN_NAME)
        return context


class BaseView(DebugViewMixin, PartnerSitesMixin, TemplateView):
    """Base view that adds current organisation to the template context or
    throws a 404. Also adds the return_url, favicon and stylesheet context
    variables."""

    def get_context_data(self, **kwargs):
        return super(BaseView, self).get_context_data(**kwargs)


class BaseProjectView(BaseView):
    """View that extends BaseView with current project or throws a 404. We
    also verify that the project is related to the current organisation,
    if not we throw a 404."""

    def get_context_data(self, **kwargs):
        context = super(BaseProjectView, self).get_context_data(**kwargs)
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        if project not in context['organisation'].published_projects():
            raise Http404
        updates = project.project_updates.all().order_by('-time')
        updates_with_images = updates.exclude(photo__exact='')
        can_add_update = project.connected_to_user(self.request.user)
        context.update({
            'project': project,
            'updates': updates,
            'updates_with_images': updates_with_images,
            'can_add_update': can_add_update,
        })
        return context


class BaseListView(DebugViewMixin, PartnerSitesMixin, ListView):
    """List view that are extended with the current organisation and the
    proejcts connected to the organisation available in the template context
    variable project_list"""

    def get_context_data(self, **kwargs):
        return super(BaseListView, self).get_context_data(**kwargs)


class BaseProjectListView(BaseListView):
    """List view that extends BaseListView with a project list queryset"""
    context_object_name = 'projects_list'

    def get_queryset(self):
        projects = get_object_or_404(Organisation, pk=self.request.organisation_id) \
            .published_projects().funding().latest_update_fields().order_by('-id')
        return projects
