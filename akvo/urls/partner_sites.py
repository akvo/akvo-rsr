# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from django.conf.urls.defaults import patterns, url
from akvo.rsr import views_partner_sites as views
from django_counter.urls import urlpatterns as counter_urls


urlpatterns = patterns('',
    # Projects
    url(r'^$', \
        views.BaseListView.as_view(template_name='partner_sites/home.html'),
        name='home'),

    url(r'^(?P<project_id>\d+)/$',
        views.ProjectMainView.as_view(),
        name='project_main'),

    # Project updates
    url(r'^(?P<project_id>\d+)/updates/$',
        views.UpdateDirectoryView.as_view(),
        name='update_list'),

    url(r'^project/(?P<project_id>\d+)/updates/(?P<update_id>\d+)/$',
        views.UpdateView.as_view(),
        name='update_main'),

    # Partners
    url(r'^partners/$', \
        views.PartnerDirectoryView.as_view(),
        name='partner_list'),

    url(r'^partners/(?P<partner_id>\d+)/$',
        views.PartnerView.as_view(),
        name='partner_main'),
)

urlpatterns += counter_urls
