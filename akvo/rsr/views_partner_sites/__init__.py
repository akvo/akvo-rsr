# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.views.generic import TemplateView, ListView
from django.shortcuts import get_object_or_404
from ..models import Organisation, Project, ProjectUpdate


class BaseView(TemplateView):

    def get_context_data(self, **kwargs):
        """Add the current organisation to the context"""
        context = super(BaseView, self).get_context_data(**kwargs)
        context['organisation'] = get_object_or_404(Organisation,
            pk=self.request.organisation_id)
        return context


class BaseProjectListView(ListView):
    context_object_name = 'project_list'

    def get_queryset(self):
        self.organisation = get_object_or_404(Organisation,
            pk=self.request.organisation_id)

        projects = self.organisation.published_projects().funding()
        return projects.order_by('id')

    def get_context_data(self, **kwargs):
        context = super(BaseProjectListView,
            self).get_context_data(**kwargs)
        context['organisation'] = get_object_or_404(Organisation,
            pk=self.request.organisation_id)
        return context


class HomeView(BaseView):
    template_name = "partner_sites/home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)

        #get three latest updates
        latest_updates = ProjectUpdate.objects.exclude(photo__exact=''). \
            order_by('-time')[:3]
        context['latest_updates'] = latest_updates

        return context


class MapView(BaseView):
    template_name = "partner_sites/map.html"


class ProjectListView(BaseProjectListView):
    """List projects..."""
    template_name = 'partner_sites/project/project_list.html'


class ProjectView(BaseView):
    """Presents the first page in the partner sites hierarchy"""
    #template_name = "partnersites/project_main.html"
    template_name = "partner_sites/project/project_main.html"

    def get_context_data(self, **kwargs):
        context = super(ProjectView, self).get_context_data(**kwargs)
        context['project'] = \
            get_object_or_404(Project, pk=self.kwargs['project_id'])
        return context
