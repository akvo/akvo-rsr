# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404, redirect

from akvo.rsr.views_partner_sites.auth import SignInView, signout
from akvo.rsr.views_partner_sites.base import BaseProjectListView
from akvo.rsr.views_partner_sites.partner import PartnerListView, PartnerView
from akvo.rsr.views_partner_sites.project import ProjectFundingView, ProjectMainView, \
    ProjectUpdateFormView, ProjectUpdateListView, ProjectUpdateView
from akvo.rsr.views_partner_sites.widgets import ProjectMapView, ProjectCordinates
from akvo.rsr.iso3166 import COUNTRY_CONTINENTS, CONTINENTS
from akvo.rsr.models import Organisation, Country
from akvo.rsr.filters import remove_empty_querydict_items, ProjectFilterSet


__all__ = [
    'HomeView',
    'OrganisationMapView',
    'PartnerListView',
    'PartnerView',
    'ProjectFundingView',
    'ProjectMainView',
    'ProjectUpdateFormView',
    'ProjectUpdateFormView',
    'ProjectUpdateListView',
    'ProjectUpdateView',
    'SignInView',
    'signout',
    'ProjectCordinates',
    ]


class HomeView(BaseProjectListView):
    """Represents the home page (/) on a partner site"""
    template_name = 'partner_sites/home.html'
    context_object_name = 'filtered_projects'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        if context['filtered_projects'].form.data:
            continent_code = context['filtered_projects'].form.data.get('continent', '')
            country_id = context['filtered_projects'].form.data.get('locations__country', '')
            org_id = context['filtered_projects'].form.data.get('organisation', '')
            context['search_country'] = Country.objects.get(pk=int(country_id)) \
                if country_id else ''
            context['search_continent'] = dict(CONTINENTS)[continent_code] \
                if continent_code else ''
            context['search_organisation'] = Organisation.objects.get(pk=int(org_id)) \
                if org_id else ''
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

        return super(HomeView, self).render_to_response(context)

    def get_queryset(self):
        projects = get_object_or_404(
            Organisation, pk=self.request.organisation_id
        ).published_projects().funding().latest_update_fields().order_by('-id')
        return ProjectFilterSet(
            self.request.GET.copy() or None,
            queryset=projects,
            organisation_id=self.request.organisation_id
        )
