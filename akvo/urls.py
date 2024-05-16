# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from .rsr.feeds import ProjectUpdates, OrganisationUpdates, AllProjectUpdates
from .utils import check_auth_groups
from .rsr.views import widgets as widget_views

from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.i18n import i18n_patterns
from django.views.static import serve
from django.views.generic import RedirectView
from rest_framework_swagger.views import get_swagger_view
from two_factor.urls import urlpatterns as two_factor_urls

from akvo.rsr.decorators import two_factor_required
from akvo.rsr import views
from akvo.rsr.views import account
from akvo.rsr.views import my_rsr
from akvo.rsr.views import organisation
from akvo.rsr.views import project
from akvo.rsr.views import project_update
from akvo.rsr.views import translations
from akvo.rsr.views import py_reports

admin.autodiscover()

docs_view = get_swagger_view("Akvo RSR API Docs")

####################################################################################
# Internationalisation URLs                                                    #
################################################################################

urlpatterns = i18n_patterns(
    # Admin
    re_path(r"^admin/", admin.site.urls),
    # Home page
    path("", views.index, name="index"),
    # Hack to prompt password on password-protected partner sites
    path("lockpass/", views.lockpass, name="lockpass"),
    # Projects
    path("projects/", project.directory, name="project-directory"),
    path("project/<int:project_id>/", project.main, name="project-main"),
    # Organisations
    path("organisations/", organisation.directory, name="organisation-directory"),
    path(
        "organisation/<int:organisation_id>/",
        organisation.main,
        name="organisation-main",
    ),
    # Updates
    path("updates/", project_update.directory, name="update-directory"),
    path(
        "project/<int:project_id>/update/<int:update_id>/",
        project_update.main,
        name="update-main",
    ),
    # Account
    path("register/", account.register, name="register"),
    re_path(
        r"^activate/(?P<activation_key>[-:\w]+)/$", account.activate, name="activate"
    ),
    re_path(
        r"^activate_invite/(?P<inviting_pk>\d+)/(?P<user_pk>\d+)/(?P<employment_pk>\d+)/(?P<token_date>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z_\-]+)/$",
        account.invite_activate,
        name="invite_activate",
    ),
    path("sign_in/", account.SignInView.as_view(), name="sign_in"),
    path(
        "account/two_factor/setup/",
        account.SetupTwoFactorView.as_view(),
        name="two_factor_setup",
    ),
    path(
        "account/two_factor/disable/",
        account.DisableTwoFactorView.as_view(),
        name="two_factor_disable",
    ),
    path(
        "account/two_factor/backup/tokens",
        account.TwoFactorBackupTokensView.as_view(),
        name="two_factor_backup_token"
    ),
    path("", include(two_factor_urls)),
    path("sign_out/", account.sign_out, name="sign_out"),
    re_path(
        r"^reset_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset_password/complete/",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    # Partner site logo & CSS
    path("logo/", my_rsr.logo, name="logo"),
    path("css/", my_rsr.css, name="css"),
    # MyRSR
    path("myrsr/", my_rsr.my_rsr, name="my_rsr"),
    path("myrsr/my_project/<int:project_id>/", my_rsr.my_project, name="project-edit"),
    path("myrsr/details/", my_rsr.my_details, name="my_details"),
    path(
        "myrsr/projects/",
        two_factor_required(RedirectView.as_view(url="/my-rsr/")),
        name="my_projects",
    ),
    path(
        "myrsr/project_editor/<int:project_id>/",
        two_factor_required(
            RedirectView.as_view(url="/my-rsr/projects/%(project_id)s/")
        ),
        name="project_editor",
    ),
    re_path(r"^translations.json$", translations.myrsr, name="myrsr-translations"),
    re_path(
        r"^project-dir-translations.json$",
        translations.project_directory,
        name="project-dir-translations",
    ),
)

################################################################################
# Non-internationalisation URLs                                                #
################################################################################

urlpatterns += [
    path("account/totp_qrcode/", account.totp_qrcode, name="totp_qrcode"),
    # Python generated reports
    path("py-reports/checkz/", py_reports.check, name="py-reports-check"),
    path(
        "py-reports/project/<int:project_id>/results-indicators-map-overview/",
        py_reports.render_project_results_indicators_map_overview,
        name="py-reports-project-results-indicators-map-overview",
    ),
    path(
        "py-reports/program/<int:program_id>/projects-results-indicators-map-overview/",
        py_reports.add_org_projects_email_report_job,
        name="py-reports-organisation-projects-results-indicators-map-overview",
    ),
    path(
        "py-reports/project/<int:project_id>/results-indicators-table/",
        py_reports.render_project_results_indicators_excel_report,
        name="py-reports-project-results-indicators-table",
    ),
    path(
        "py-reports/project/<int:project_id>/updates-table/",
        py_reports.render_project_updates_excel_report,
        name="py-reports-project-updates-table",
    ),
    path(
        "py-reports/project/<int:project_id>/results-indicators-overview/",
        py_reports.render_project_results_indicators_overview,
        name="py-reports-project-results-indicators-overview",
    ),
    path(
        "py-reports/project/<int:project_id>/eutf-results-indicators-table/",
        py_reports.render_eutf_project_results_table_excel_report,
        name="py-reports-project-eutf-results-indicators-table",
    ),
    path(
        "py-reports/project/<int:project_id>/kickstart-report/",
        py_reports.render_kickstart_report,
        name="py-reports-project-kickstart-report",
    ),
    path(
        "py-reports/project/<int:project_id>/eutf-narrative-report/",
        py_reports.render_eutf_narrative_word_report,
        name="py-reports-project-eutf-narrative-word-report",
    ),
    path(
        "py-reports/project/<int:project_id>/overview-report/",
        py_reports.render_project_overview_pdf_report,
        name="py-reports-project-overview-pdf-report",
    ),
    path(
        "py-reports/organisation/<int:org_id>/data-quality-overview/",
        py_reports.render_organisation_data_quality_overview,
        name="py-reports-organisation-data-quality-overview",
    ),
    path(
        "py-reports/program/<int:program_id>/eutf-results-indicators-table/",
        py_reports.render_eutf_org_results_table_excel_report,
        name="py-reports-organisation-eutf-results-indicators-table",
    ),
    path(
        "py-reports/program/<int:program_id>/eutf-common-output-indicators-table/<int:result_id>/",
        py_reports.render_eutf_org_results_table_excel_report,
        name="py-reports-organisation-eutf-common-output-indicators-table",
    ),
    path(
        "py-reports/organisation/<int:org_id>/results-indicators-table/",
        py_reports.render_results_indicators_excel_report,
        name="py-reports-organisation-results-indicators-table",
    ),
    path(
        "py-reports/organisation/<int:org_id>/org-projects-overview/",
        py_reports.render_org_projects_overview_report,
        name="py-reports-organisation-projects-overview",
    ),
    path(
        "py-reports/program/<int:program_id>/program-overview-table/",
        py_reports.add_program_overview_excel_report_email_job,
        name="py-reports-program-overview-table",
    ),
    path(
        "py-reports/program/<int:program_id>/program-overview/",
        py_reports.add_program_overview_pdf_report_email_job,
        name="py-reports-program-overview",
    ),
    path(
        "py-reports/program/<int:program_id>/program-labeled-periods-overview/",
        py_reports.add_program_period_labels_overview,
        name="py-reports-program-period-labels-overview",
    ),
    path(
        "py-reports/program/<int:program_id>/nuffic-country-level-report/",
        py_reports.add_nuffic_country_level_report_job,
        name="py-reports-nuffic-country-level-report",
    ),
    # IATI file
    path("project/<int:project_id>/iati/", project.iati, name="project-iati"),
    re_path(
        r"^organisation/(?P<organisation_id>\d+)/iati(/|(/?\.xml)?)$",
        organisation.iati,
        name="projects-iati",
    ),
    # IATI organisation file
    re_path(
        r"^organisation/(?P<organisation_id>\d+)/iati-org(/|(/?\.xml)?)$",
        organisation.iati_org,
        name="org-iati",
    ),
    # Legacy TastyPie API emulation
    path("api/", include("akvo.rest.urls")),
    # Django Rest Framework urls
    path("rest/", include("akvo.rest.urls")),
    re_path(r"^rest/docs/", docs_view),
    # RSS
    path("rss/updates/<int:project_id>/", ProjectUpdates(), name="rss_project_updates"),
    path(
        "rss/org-updates/<int:org_id>/", OrganisationUpdates(), name="rss_org_updates"
    ),
    path("rss/all-updates/", AllProjectUpdates(), name="rss_all_updates"),
    # Auth token for mobile apps
    path("auth/token/", account.api_key, name="auth_token"),
    # Set csrf token cookie for SPA
    path("auth/csrf-token/", account.get_csrf_token, name="auth_csrf_token"),
    path("auth/login/", account.json_login, name="auth_json_login"),
    path(
        "auth/reset-password/",
        account.json_reset_password,
        name="auth_json_reset_password",
    ),
    path("auth/register/", account.json_register, name="auth_json_register"),
    # Widgets
    path(
        "widgets/projects/map/",
        widget_views.ProjectMapView.as_view(),
        name="widget_org_map",
    ),
    path(
        "widgets/projects/list/",
        widget_views.ProjectListView.as_view(),
        name="widget_project_list",
    ),
    path(
        "widgets/cobranded-banner/<int:project_id>/",
        widget_views.CobrandedBannerView.as_view(),
        name="widget_cobranded_banner",
    ),
    path(
        "widgets/cobranded-banner/random/",
        widget_views.RandomCobrandedBannerView.as_view(),
        name="widget_random_cobranded_banner",
    ),
    path(
        "widgets/project-narrow/<int:project_id>/",
        widget_views.ProjectNarrowView.as_view(),
        name="widget_project_narrow",
    ),
    path(
        "widgets/project-narrow/random/",
        widget_views.RandomProjectNarrowView.as_view(),
        name="widget_random_project_narrow",
    ),
    path(
        "widgets/project-small/<int:project_id>/",
        widget_views.ProjectSmallView.as_view(),
        name="widget_project_small",
    ),
    path(
        "widgets/project-small/random/",
        widget_views.RandomProjectSmallView.as_view(),
        name="widget_random_project_small",
    ),
    path("maintenance", views.maintenance, name="maintenance")
]

handler500 = "akvo.rsr.views.error.server_error"

urlpatterns += [
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
    try:
        import debug_toolbar
    except ImportError:
        pass
    else:
        urlpatterns = [
            # For django versions before 2.0:
            path("__debug__/", include(debug_toolbar.urls)),
        ] + urlpatterns

if settings.REQUIRED_AUTH_GROUPS:
    check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
