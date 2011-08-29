# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from django.conf.urls.defaults import patterns, url
from akvo.rsr import views_partner_sites as views


urlpatterns = patterns('',
    url(r'^$', views.HomeView.as_view(), name='home'),
    url(r'^directory/$', views.BaseListView \
        .as_view(template_name='partner_sites/directory.html'),
                 name='project_list'),
    url(r'^map/$', views.BaseView \
        .as_view(template_name='partner_sites/map.html'),
                 name='project_map'),
    url(r'^(?P<project_id>\d+)/$', views.BaseProjectView \
        .as_view(template_name="partner_sites/project/project_main.html"),
                 name='project_main'),
    url(r'^(?P<project_id>\d+)/funding/$', views.BaseProjectView \
        .as_view(template_name="partner_sites/project/project_funding.html"),
                 name='project_funding'),
)
