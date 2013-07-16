# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.conf import settings
from django.conf.urls.defaults import patterns, url
from django.conf.urls.i18n import i18n_patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django_counter.urls import urlpatterns as counter_urls

from akvo.rsr import views as rsr_views
from akvo.rsr.feeds import ProjectUpdates, OrganisationUpdates
from akvo.rsr.views_partner_sites import project as project_views
from akvo.rsr.views_partner_sites import partner as partner_views
from akvo.rsr.views_partner_sites import widgets as widget_views
from akvo.rsr.views_partner_sites import error as error_views
from akvo.rsr.views_partner_sites import auth as auth_views


handler403 = error_views.ForbiddenView.as_view()
handler404 = error_views.NotFoundView.as_view()

urlpatterns = i18n_patterns(
    '',

    url(r'^$',
        project_views.HomeView.as_view(),
        name='home'),

    # Projects
    url(r'^project/(?P<project_id>\d+)/$',
        project_views.ProjectMainView.as_view(),
        name='project_main'),

    url(r'^project/(?P<project_id>\d+)/funding/$',
        project_views.ProjectFundingView.as_view(),
        name='project_funding'),

    # Project donation thanks
    url(r'^donate/thanks/$',
        project_views.ProjectDonationThanksView.as_view(),
        name='donate_thanks'),

    # Project updates
    url(r'^project/(?P<project_id>\d+)/updates/$',
        project_views.ProjectUpdateListView.as_view(),
        name='update_list'),

    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/$',
        project_views.ProjectUpdateView.as_view(),
        name='update_main'),

    url(r'^project/(?P<project_id>\d+)/update/$',
        project_views.ProjectUpdateAddView.as_view(),
        name='update_add'),

    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/edit/$',
        project_views.ProjectUpdateEditView.as_view(),
        name='update_edit'),

    # Partners
    url(r'^organisations/$',
        partner_views.PartnerListView.as_view(),
        name='partner_list'),

    url(r'^organisation/(?P<org_id>\d+)/$',
        partner_views.PartnerView.as_view(),
        name='organisation_main'),

    # RSS
    url(r'^rss/project/(?P<project_id>\d+)/updates/$',
        ProjectUpdates(),
        name="rss_project_updates"),

    url(r'^rss/organisation/(?P<org_id>\d+)/updates/$',
        OrganisationUpdates(),
        name="rss_org_updates"),

    # Widgets
    url(r'^project/(?P<project_id>\d+)/widgets/$',
        widget_views.GetWidgetView.as_view(),
        name="get_widget"),

    url(r'^widgets/projects/map/$',
        widget_views.ProjectMapView.as_view(),
        name="widget_org_map"),

    url(r'^widgets/projects/list/$',
        widget_views.ProjectListView.as_view(),
        name="widget_project_list"),

    url(r'^widgets/cobranded-banner/(?P<project_id>\d+)/$',
        widget_views.CobrandedBannerView.as_view(),
        name="widget_cobranded_banner"),

    url(r'^widgets/cobranded-banner/random/$',
        widget_views.RandomCobrandedBannerView.as_view(),
        name="widget_random_cobranded_banner"),

    url(r'^widgets/project-narrow/(?P<project_id>\d+)/$',
        widget_views.ProjectNarrowView.as_view(),
        name="widget_project_narrow"),

    url(r'^widgets/project-narrow/random/$',
        widget_views.RandomProjectNarrowView.as_view(),
        name="widget_random_project_narrow"),

    url(r'^widgets/project-small/(?P<project_id>\d+)/$',
        widget_views.ProjectSmallView.as_view(),
        name="widget_project_small"),

    url(r'^widgets/project-small/random/$',
        widget_views.RandomProjectSmallView.as_view(),
        name="widget_random_project_small"),

    # Auth
    url(r'^rsr/signin/$',
        auth_views.SignInView.as_view(),
        name="sign_in"),

    url(r'^rsr/signout/$',
        auth_views.signout,
        name='sign_out'),

    # Maps JSON
    url(r'^rsr/maps/organisation/(?P<org_id>\d+)/projects/json/$',
        rsr_views.global_organisation_projects_map_json,
        name='global_organisation_projects_map_json'),
)

# Non i18n
urlpatterns += patterns(
    '',
    # Beta API
    url(r'^api/beta/projects_cordinates.json$',
        widget_views.ProjectCordinates.as_view(),
        name="api_projects_cordinates"),
)

urlpatterns += counter_urls

urlpatterns += patterns(
    '',

    (r'^rsr/media/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT}),
)

urlpatterns += staticfiles_urlpatterns()
