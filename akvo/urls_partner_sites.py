# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from django.conf.urls.defaults import patterns, url
from akvo.rsr import views_partner_sites as views


urlpatterns = patterns('',
    url(r'^$',
        views.HomeView.as_view(), name='home'),
    url(r'^projects/$',
        views.ProjectListView.as_view(), name='project_list'),
    url(r'^map/$',
        views.MapView.as_view(), name='project_map'),
    url(r'^projects/(?P<project_id>\d+)/$',
        views.ProjectView.as_view(), name='project_main'),
)
