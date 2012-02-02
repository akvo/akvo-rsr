# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.conf import settings
from django.conf.urls.defaults import patterns, url
from django_counter.urls import urlpatterns as counter_urls

from akvo.rsr import views_partner_sites as views
from akvo.rsr.feeds import ProjectUpdates, OrganisationUpdates

urlpatterns = patterns('',
    # Home
    url(r'^$',
        views.HomeView.as_view(),
        name='home'),

    # Projects
    url(r'^project/(?P<project_id>\d+)/$',
        views.ProjectMainView.as_view(),
        name='project_main'),

    url(r'^project/(?P<project_id>\d+)/funding/$',
        views.ProjectFundingView.as_view(),
        name='project_funding'),

    # Project updates
    url(r'^project/(?P<project_id>\d+)/updates/$',
        views.ProjectUpdateListView.as_view(),
        name='update_list'),

    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/$',
        views.ProjectUpdateView.as_view(),
        name='update_main'),

    # Partners
    url(r'^organisations/$',
        views.PartnerListView.as_view(),
        name='partner_list'),

    url(r'^organisation/(?P<org_id>\d+)/$',
        views.PartnerView.as_view(),
        name='organisation_main'),

    # RSS
    url(r'^rss/project/(?P<project_id>\d+)/updates/$',
        ProjectUpdates(),
        name="rss_project_updates"),

    url(r'^rss/organisation/(?P<org_id>\d+)/updates/$',
        OrganisationUpdates(),
        name="rss_org_updates"),

    # Widgets
    url(r'^widgets/projects/map/$',
        views.ProjectMapView.as_view(),
        name="widget_org_map"),
    
    # Beta API
    url(r'^api/beta/projects_cordinates.json$',
        views.ProjectCordinates.as_view(),
        #views.projects_cordinates,
        name="api_projects_cordinates"), 
    
)

if getattr(settings, 'PARTNER_SITES_AUTH', False):
    urlpatterns += (
        # Auth
        url(r'^rsr/signin/$',
            views.SignInView.as_view(),
            name="sign_in"),

        url(r'^rsr/signout/$',
            views.signout,
            name='sign_out'),

        url(r'^project/(?P<project_id>\d+)/update/$',
            views.ProjectUpdateAddView.as_view(),
            name='update_add'),

        url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/edit/$',
            views.ProjectUpdateEditView.as_view(),
            name='update_edit'),
    )

urlpatterns += counter_urls

urlpatterns += patterns('',
    (r'^rsr/media/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT}),
)
