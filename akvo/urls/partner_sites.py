# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.conf.urls.defaults import patterns, url
from akvo.rsr import views_partner_sites as views
from django_counter.urls import urlpatterns as counter_urls


urlpatterns = patterns('',
    # Home
    url(r'^$',
        views.HomeView.as_view(),
        name='home'),

    # Projects
    url(r'^(?P<project_id>\d+)/$',
        views.ProjectMainView.as_view(),
        name='project_main'),

    url(r'^(?P<project_id>\d+)/funding/$',
        views.ProjectFundingView.as_view(),
        name='project_funding'),

    # Project updates
    url(r'^(?P<project_id>\d+)/updates/$',
        views.ProjectUpdateListView.as_view(),
        name='update_list'),

    url(r'^(?P<project_id>\d+)/updates/(?P<update_id>\d+)/$',
        views.ProjectUpdateView.as_view(),
        name='update_main'),

    # Partners
    url(r'^partners/$',
        views.PartnerListView.as_view(),
        name='partner_list'),

    url(r'^partners/(?P<partner_id>\d+)/$',
        views.PartnerView.as_view(),
        name='partner_main'),
)

urlpatterns += counter_urls
