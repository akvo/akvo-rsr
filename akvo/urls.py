# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from .rsr.feeds import ProjectUpdates, OrganisationUpdates, AllProjectUpdates
from .rsr.forms import RSRSetPasswordForm
from .utils import check_auth_groups
from .rsr.views import widgets as widget_views

from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.i18n import i18n_patterns
from django.views.static import serve
from django.views.generic import RedirectView

from akvo.rsr import views
from akvo.rsr.views import account
from akvo.rsr.views import my_rsr
from akvo.rsr.views import organisation
from akvo.rsr.views import project
from akvo.rsr.views import project_update
from akvo.rsr.views import translations
from akvo.rsr.views import py_reports

admin.autodiscover()

####################################################################################
# Internationalisation URLs                                                    #
################################################################################

urlpatterns = i18n_patterns(

    # Admin
    url(r'^admin/', admin.site.urls),

    # Home page
    url(r'^$',
        views.index, name='index'),

    # Projects
    url(r'^projects/$',
        project.directory, name='project-directory'),

    url(r'^project/(?P<project_id>\d+)/$',
        project.main, name='project-main'),

    url(r'^project/(?P<project_id>\d+)/hierarchy/$',
        project.hierarchy, name='project-hierarchy'),

    url(r'^project/(?P<project_id>\d+)/hierarchy_embed/$',
        project.hierarchy,
        kwargs={
            'template': 'project_hierarchy_iframe.html',
            'public': False,
        },
        name='project-hierarchy-iframe'),

    url(r'^project/(?P<project_id>\d+)/report/$',
        project.report, name='project-report'),

    url(r'^project/(?P<project_id>\d+)/widgets/$',
        project.widgets, name='project-widgets'),

    url(r'^project/(?P<project_id>\d+)/updates/$',
        project_update.project_updates, name='project-updates'),

    url(r'^project/(?P<project_id>\d+)/partners/$',
        project.partners, name='project-partners'),

    url(r'^project/(?P<project_id>\d+)/finance/$',
        project.finance, name='project-finance'),

    # Organisations
    url(r'^organisations/$',
        organisation.directory,
        name='organisation-directory'),

    url(r'^organisation/(?P<organisation_id>\d+)/$',
        organisation.main, name='organisation-main'),

    # Updates
    url(r'^updates/$',
        project_update.directory, name='update-directory'),

    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/$',
        project_update.main, name='update-main'),

    # Add an update
    url(r'^project/(?P<project_id>\d+)/add_update/$',
        project.set_update, name='add-update'),

    # Edit an update
    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/edit/$',
        project.set_update, name='edit-update'),

    # Account
    url(r'^register/$',
        account.register, name='register'),

    url(r'^activate/(?P<activation_key>\w+)/$',
        account.activate, name='activate'),

    url(r'^activate_invite/(?P<inviting_pk>\d+)/(?P<user_pk>\d+)/(?P<employment_pk>\d+)/(?P<token_date>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z_\-]+)/$',
        account.invite_activate, name='invite_activate'),

    url(r'^sign_in/$',
        account.sign_in, name='sign_in'),

    url(r'^sign_out/$',
        account.sign_out, name='sign_out'),

    url(r'^reset_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.password_reset_confirm, name='password_reset_confirm',
        kwargs={'set_password_form': RSRSetPasswordForm}),

    url(r'^reset_password/complete/$',
        auth_views.password_reset_complete, name='password_reset_complete'),

    # Partner site logo & CSS
    url(r'^logo/$',
        my_rsr.logo, name='logo'),
    url(r'^css/$',
        my_rsr.css, name='css'),

    # MyRSR
    url(r'^myrsr/$',
        my_rsr.my_rsr, name='my_rsr'),

    url(r'^myrsr/my_project/(?P<project_id>\d+)/$',
        my_rsr.my_project, name='project-edit'),

    url(r'^myrsr/details/$',
        my_rsr.my_details, name='my_details'),

    url(r'^myrsr/updates/$',
        my_rsr.my_updates, name='my_updates'),

    url(r'^myrsr/projects/$',
        RedirectView.as_view(url='/my-rsr/projects/'),
        name='my_projects'),

    url(r'^myrsr/project_editor_old/(?P<project_id>\d+)/$',
        my_rsr.project_editor, name='project_editor_old'),

    url(r'^myrsr/project_editor/(?P<project_id>\d+)/$',
        RedirectView.as_view(url='/my-rsr/projects/%(project_id)s/'),
        name='project_editor'),

    url(r'^myrsr/iati/$',
        my_rsr.my_iati, name='my_iati'),

    url(r'^myrsr/reports/$',
        my_rsr.my_reports, name='my_reports'),

    url(r'^myrsr/user_management/$',
        my_rsr.user_management, name='user_management'),

    url(r'^myrsr/user_projects/(?P<user_id>\d+)/$',
        my_rsr.user_projects, name='user_projects'),

    url(r'^translations.json$', translations.index, name='translations'),
)

################################################################################
# Non-internationalisation URLs                                                #
################################################################################

urlpatterns += (
    # Python generated reports
    url(r'^py-reports/checkz/$',
        py_reports.check, name='py-reports-check'),

    url(r'^py-reports/project/(?P<project_id>\d+)/results-indicators-map-overview/$',
        py_reports.render_project_results_indicators_map_overview,
        name='py-reports-project-results-indicators-map-overview'),

    url(r'^py-reports/organisation/(?P<org_id>\d+)/projects-results-indicators-map-overview/$',
        py_reports.render_organisation_projects_results_indicators_map_overview,
        name='py-reports-organisation-projects-results-indicators-map-overview'),

    url(r'^py-reports/project/(?P<project_id>\d+)/results-indicators-table/$',
        py_reports.render_project_results_indicators_excel_report,
        name='py-reports-project-excel'),

    url(r'^py-reports/project/(?P<project_id>\d+)/results-indicators-overview/$',
        py_reports.render_project_results_indicators_overview,
        name='py-reports-project-results-indicators-overview'),

    url(r'^py-reports/organisation/(?P<org_id>\d+)/data-quality-overview/$',
        py_reports.render_organisation_data_quality_overview,
        name='py-reports-organisation-data-quality-overview'),

    url(r'^py-reports/organisation/(?P<org_id>\d+)/eutf-results-indcators-table/$',
        py_reports.render_eutf_org_results_table_excel_report,
        name='py-reports-organisation-eutf-results-indicators-table'),

    url(r'^py-reports/organisation/(?P<org_id>\d+)/results-indicators-table/$',
        py_reports.render_results_indicators_excel_report,
        name='py-reports-organisation-results-indicators-table'),

    # IATI file
    url(r'^project/(?P<project_id>\d+)/iati/$',
        project.iati, name='project-iati'),

    url(r'^organisation/(?P<organisation_id>\d+)/iati/$',
        organisation.iati, name='projects-iati'),

    # IATI organisation file
    url(r'^organisation/(?P<organisation_id>\d+)/iati-org/$',
        organisation.iati_org, name='org-iati'),

    # Legacy TastyPie API emulation
    url(r'^api/', include('akvo.rest.urls')),

    # Django Rest Framework urls
    url(r'^rest/', include('akvo.rest.urls')),
    url(r'^rest/docs/', include('rest_framework_swagger.urls')),

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
    url(r'^auth/token/$', account.api_key, name="auth_token"),

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
)

handler500 = 'akvo.rsr.views.error.server_error'

urlpatterns += (
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
)

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
    try:
        import debug_toolbar
    except ImportError:
        pass
    else:
        urlpatterns = [
            # For django versions before 2.0:
            url(r'^__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns

if settings.REQUIRED_AUTH_GROUPS:
    check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
