# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.api.urls import named_api
from akvo.utils import check_auth_groups
from .rsr.views import widgets as widget_views

from akvo.rsr.feeds import ProjectUpdates, OrganisationUpdates, AllProjectUpdates

from django.conf import settings
from django.conf.urls import (include, patterns, url)
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from paypal.standard.ipn.views import ipn as paypal_ipn

admin.autodiscover()

urlpatterns = patterns(
    '',

    # Home page
    url(r'^$',
        'akvo.rsr.views.index', name='index'),

    # Projects
    url(r'^projects/$',
        'akvo.rsr.views.project.directory', name='project-directory'),

    url(r'^project/(?P<project_id>\d+)/$',
        'akvo.rsr.views.project.main', name='project-main'),

    url(r'^project/(?P<project_id>\d+)/hierarchy/$',
        'akvo.rsr.views.project.hierarchy', name='project-hierarchy'),

    url(r'^project/(?P<project_id>\d+)/report/$',
        'akvo.rsr.views.project.report', name='project-report'),

    url(r'^project/(?P<project_id>\d+)/widgets/$',
        'akvo.rsr.views.project.widgets', name='project-widgets'),

    url(r'^project/(?P<project_id>\d+)/updates/$',
        'akvo.rsr.views.project_update.project_updates', name='project-updates'),

    url(r'^project/(?P<project_id>\d+)/finance/$',
        'akvo.rsr.views.project.finance', name='project-finance'),

    # Organisations
    url(r'^organisations/$',
        'akvo.rsr.views.organisation.directory',
        name='organisation-directory'),

    url(r'^organisation/(?P<organisation_id>\d+)/$',
        'akvo.rsr.views.organisation.main', name='organisation-main'),

    # Updates
    url(r'^updates/$',
        'akvo.rsr.views.project_update.directory', name='update-directory'),

    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/$',
        'akvo.rsr.views.project_update.main', name='update-main'),

    # Add an update
    url(r'^project/(?P<project_id>\d+)/add_update/$',
        'akvo.rsr.views.project.set_update', name='add-update'),

    # Edit an update
    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/edit/$',
        'akvo.rsr.views.project.set_update', name='edit-update'),

    # Account
    url(r'^register/$',
        'akvo.rsr.views.account.register', name='register'),

    url(r'^activate/(?P<activation_key>\w+)/$',
        'akvo.rsr.views.account.activate', name='activate'),

    url(r'^sign_in/$',
        'akvo.rsr.views.account.sign_in', name='sign_in'),

    url(r'^sign_out/$',
        'akvo.rsr.views.account.sign_out', name='sign_out'),

    url(r'^reset_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        'django.contrib.auth.views.password_reset_confirm', name='password_reset_confirm'),

    url(r'^reset_password/complete/$',
        'django.contrib.auth.views.password_reset_complete', name='password_reset_complete'),

    # MyRSR
    url(r'^myrsr/$',
        'akvo.rsr.views.my_rsr.my_details', name='my_details'),

    url(r'^myrsr/updates/$',
        'akvo.rsr.views.my_rsr.my_updates', name='my_updates'),

    url(r'^myrsr/projects/$',
        'akvo.rsr.views.my_rsr.my_projects', name='my_projects'),

    url(r'^myrsr/user_management/$',
        'akvo.rsr.views.my_rsr.user_management', name='user_management'),

    url(r'^myrsr/password_change/$',
        'akvo.rsr.views.my_rsr.password_change', name='password_change'),

    # Donations
    url(r'^mollie/report/$',
        'akvo.rsr.views.donate.mollie_report',
        name='mollie_report'),

    url(r'^invoice/(?P<invoice_id>\d+)/(?P<action>\w+)/$',
        'akvo.rsr.views.donate.void_invoice',
        name='void_invoice'),

    url(r'^project/(?P<project_id>\d+)/donate/(?P<engine>\w+)/$',
        'akvo.rsr.views.donate.donate',
        name='complete_donation'),

    url(r'^project/(?P<project_id>\d+)/donate/$',
        'akvo.rsr.views.donate.setup_donation',
        name='project-donate'),

    url(r'^donate/thanks/$',
        'akvo.rsr.views.donate.donate_thanks',
        name='donate_thanks'),

    url(r'^donate/500/$',
        TemplateView.as_view(template_name="donate/donate_500.html"),
        name='donate_500'),

    url(r'^donate/paypal/ipn/$',
        csrf_exempt(paypal_ipn),
        name='paypal_ipn'),

    # Admin
    (r'^admin/', include(admin.site.urls)),

    # Django Rest Framework urls
    (r'^rest/v1/', include('akvo.rest.urls')),
    url(r'^rest/docs/', include('rest_framework_swagger.urls')),

    # Widgets
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

    # RSS
    url(r'^rss/updates/(?P<project_id>\d+)/$',
        ProjectUpdates(),
        name="rss_project_updates"),

    url(r'^rss/org-updates/(?P<org_id>\d+)/$',
        OrganisationUpdates(),
        name="rss_org_updates"),

    url(r'^rss/all-updates/$',
        AllProjectUpdates(),
        name="rss_all_updates"),

    # Auth token for mobile apps
    url(r'^auth/token/$',
        'akvo.rsr.views.account.api_key',
        name="auth_token"),

)

# TastyPie API
urlpatterns += patterns(
    '',
    (r'^api/', include(named_api('v1').urls)),
)


# handler403 = 'akvo.rsr.views.forbidden'
handler500 = 'akvo.rsr.views.error.server_error'
# if settings.DEBUG:
#     urlpatterns += patterns(
#         '',

#         (r'^500/$', 'akvo.rsr.views.server_error'),
#     )

# if settings.DEBUG:
urlpatterns += patterns(
    '',

    (r'^media/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT}),
)

if 'rosetta' in settings.INSTALLED_APPS:
    urlpatterns += patterns(
        '',
        url(r'^rosetta/', include('rosetta.urls')),
    )

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()

if settings.REQUIRED_AUTH_GROUPS:
    check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
