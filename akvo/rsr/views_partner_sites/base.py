# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from urlparse import urljoin

from django.conf import settings
from django.http import Http404
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import TemplateView, ListView
from django.core.urlresolvers import reverse, set_urlconf
from django.utils import translation

from akvo.rsr.filters import remove_empty_querydict_items, ProjectFilterSet
from akvo.rsr.iso3166 import COUNTRY_CONTINENTS, CONTINENTS
from akvo.rsr.models import Organisation, Country, Project


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
        context['organisation'] = get_object_or_404(
            Organisation, pk=self.request.organisation_id
        )
        context['return_url'] = self.request.partner_site.return_url
        context['stylesheet'] = self.request.partner_site.stylesheet
        context['app_url'] = self.request.app_url
        context['domain_url'] = self.request.domain_url
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

        privileged_user = project.connected_to_user(self.request.user)
        unprivileged_user = not privileged_user
        authenticated_user = self.request.user.is_authenticated()
        unpublished_project = not project.is_published()
        draft = False

        # Enable draft preview for privileged users, additional logic in
        # the draft section of project pages templates
        if unpublished_project and authenticated_user and unprivileged_user:
            raise PermissionDenied
        if unpublished_project and unprivileged_user:
            raise Http404
        if unpublished_project and privileged_user:
            draft = True

        updates = project.project_updates.all().order_by('-time')
        updates_with_images = updates.exclude(photo__exact='')

        context.update({
            'project': project,
            'updates': updates,
            'updates_with_images': updates_with_images,
            'can_add_update': privileged_user,
            'draft': draft
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
    context_object_name = 'filtered_projects'

    def get_context_data(self, **kwargs):
        context = super(BaseProjectListView, self).get_context_data(**kwargs)
        form_data = context['filtered_projects'].form.data
        if form_data:
            continent_code = form_data.get('continent', '')
            country_id = form_data.get('locations__country', '')
            org_id = form_data.get('organisation', '')
            context['search_country'] = Country.objects.get(pk=int(country_id)) if country_id else ''
            context['search_continent'] = dict(CONTINENTS)[continent_code] if continent_code else ''
            context['search_organisation'] = Organisation.objects.get(pk=int(org_id)) if org_id else ''
        return context

    def render_to_response(self, context):
        """here we sanitize the query string, removing empty variables, and
        then we add the continent if the country is part of the query string
        """
        # remove empty query string variables
        query_dict = remove_empty_querydict_items(self.request.GET)
        # if filtering on country, set the correct continent
        country_id = query_dict.get('locations__country', '')
        if country_id:
            continent = dict(COUNTRY_CONTINENTS)[Country.objects.get(pk=int(country_id)).iso_code]
            if not query_dict.get('continent', None) == continent:
                query_dict['continent'] = continent
                return redirect("%s?%s" % (reverse('home'), query_dict.urlencode()))

        return super(BaseProjectListView, self).render_to_response(context)

    def get_queryset(self):
        projects = get_object_or_404(
            Organisation, pk=self.request.organisation_id
        ).published_projects().latest_update_fields().order_by('-id')
        return ProjectFilterSet(
            self.request.GET.copy() or None,
            queryset=projects,
            organisation_id=self.request.organisation_id
        )
