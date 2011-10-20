# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import TemplateView, ListView

from akvo.rsr.filters import remove_empty_querydict_items, ProjectFilterSet
from akvo.rsr.iso3166 import COUNTRY_CONTINENTS
from akvo.rsr.models import Organisation, Project, Country

__all__ = [
    'BaseProjectListView',
    'BaseProjectView',
    'BaseListView',
    'BaseView',
    ]


class BaseView(TemplateView):
    """Base view that adds current organisation to the template context or
    throws a 404. Also adds the return_url, favicon and stylesheet context
    variables."""

    def get_context_data(self, **kwargs):
        context = super(BaseView, self).get_context_data(**kwargs)
        context['organisation'] = \
            get_object_or_404(Organisation, pk=self.request.organisation_id)
        context['return_url'] = self.request.partner_site.return_url
        context['favicon'] = self.request.partner_site.favicon
        context['stylesheet'] = self.request.partner_site.stylesheet
        # Queries should be removed for production
        if settings.DEBUG:
            from django.db import connection
            context['queries'] = connection.queries
        return context


class BaseProjectView(BaseView):
    """View that extends BaseView with current project or throws a 404. We
    also verify that the project is related to the current organisation,
    if not we throw a 404."""

    def get_context_data(self, **kwargs):
        context = super(BaseProjectView, self).get_context_data(**kwargs)
        context['project'] = \
            get_object_or_404(Project, pk=self.kwargs['project_id'])
        if context['project'] not in context['organisation'] \
            .published_projects():
            raise Http404
        context['updates_with_images'] = context['project'] \
            .project_updates.all().exclude(photo__exact='') \
            .order_by('-time')[:3]
        return context


class BaseListView(ListView):
    """List view that are extended with the current organisation and the
    proejcts connected to the organisation available in the template context
    variable project_list"""

    def get_context_data(self, **kwargs):
        context = super(BaseListView, self).get_context_data(**kwargs)
        context['organisation'] = \
            get_object_or_404(Organisation, pk=self.request.organisation_id)
        context['return_url'] = self.request.partner_site.return_url
        context['favicon'] = self.request.partner_site.favicon
        context['stylesheet'] = self.request.partner_site.stylesheet
        if settings.DEBUG:
            from django.db import connection
            context['queries'] = connection.queries
        return context


class BaseProjectListView(BaseListView):
    """List view that extends BaseListView with a project list queryset"""
    context_object_name = 'filtered_projects'

    def render_to_response(self, context):
        """here we sanitize the query string, removing empty variables, and then we add the continent
        if the country is part of the query string
        """
        # remove empty query string variables
        query_dict = remove_empty_querydict_items(self.request.GET)
        # if filtering on country, set the correct continent
        country_id = query_dict.get('locations__country', '')
        if country_id:
            if not query_dict.get('continent', None) == dict(COUNTRY_CONTINENTS)[Country.objects.get(pk=int(country_id)).iso_code]:
                query_dict['continent'] = dict(COUNTRY_CONTINENTS)[Country.objects.get(pk=int(country_id)).iso_code]
                return redirect("%s?%s" % (reverse('home'), query_dict.urlencode()))

        return super(BaseProjectListView, self).render_to_response(context)

    def get_queryset(self):
        projects = get_object_or_404(
            Organisation, pk=self.request.organisation_id
        ).published_projects().funding().latest_update_fields().order_by('-id')
        return ProjectFilterSet(self.request.GET.copy() or None, queryset=projects, organisation_id=self.request.organisation_id)
