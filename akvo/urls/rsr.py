# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.conf.urls import (include, patterns, url)
from django.contrib.auth import views as auth_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.simple import direct_to_template
from paypal.standard.ipn.views import ipn as paypal_ipn

from akvo.rsr.feeds import (ProjectUpdates, OrganisationUpdates,
                            AllProjectUpdates)
from akvo.rsr.forms import RSR_PasswordResetForm, RSR_SetPasswordForm
from akvo.api.urls import named_api

# The next two lines enable the admin and load each admin.py file:
from django.contrib import admin
admin.autodiscover()

# The next two lines enable djangoembed in the admin
import oembed
oembed.autodiscover()

# Multi-lingual urls
# urlpatterns = i18n_patterns('',
urlpatterns = patterns(
    '',

    # Home page
    url(r'^$',
        'akvo.rsr.views.index',
        name='index'),

    # IATI lists
    url(r'^iati/projects/(?P<iati_activity_id>[_\-a-zA-Z0-9]+)/$',
        'akvo.rsr.views.iati_project_list',
        name='iati_project_list'),

    url(r'^iati/organisations/(?P<iati_activity_id>[_\-a-zA-Z0-9]+)/$',
        'akvo.rsr.views.iati_organisation_list',
        name='iati_organisation_list'),

    # Project list
    url(r'^projects/$',
        'akvo.rsr.views.old_project_list',
        name='old_project_list'),

    url(r'^projects/(?P<slug>[_\-a-zA-Z0-9]+)/$',
        'akvo.rsr.views.project_list',
        name='project_list'),

    # Project
    url(r'^project/(?P<project_id>\d+)/$',
        'akvo.rsr.views.projectmain',
        name='project_main'),

    url(r'^project/(?P<project_id>\d+)/details/$',
        'akvo.rsr.views.projectdetails',
        name='project_details'),

    url(r'^project/(?P<project_id>\d+)/funding/$',
        'akvo.rsr.views.projectfunding',
        name='project_funding'),

    url(r'^project/(?P<project_id>\d+)/partners/$',
        'akvo.rsr.views.projectpartners',
        name='project_partners'),

    url(r'^project/(?P<project_id>\d+)/comments/$',
        'akvo.rsr.views.projectcomments',
        name='project_comments'),

    url(r'^project/(?P<project_id>\d+)/get-a-widget/$',
        'akvo.rsr.views.getwidget',
        name='project_get_widget'),

    (r'^project/(?P<project_id>\d+)/comment/$',
        'akvo.rsr.views.commentform', ),

    # Project updates
    url(r'^project/(?P<project_id>\d+)/updates/$',
        'akvo.rsr.views.projectupdates',
        name='project_updates'),

    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/edit/$',
        'akvo.rsr.views.updateform',
        name='project_edit_update'),

    url(r'^project/(?P<project_id>\d+)/update/$',
        'akvo.rsr.views.updateform',
        name='project_add_update'),

    url(r'^project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/$',
        'akvo.rsr.views.projectupdate',
        name='update_main'),

    # Payment engines
    url(r'^mollie/report/$',
        'akvo.rsr.views.mollie_report',
        name='mollie_report'),

    url(r'^invoice/(?P<invoice_id>\d+)/(?P<action>\w+)/$',
        'akvo.rsr.views.void_invoice',
        name='void_invoice'),

    url(r'^project/(?P<project_id>\d+)/donate/(?P<engine>\w+)/$',
        'akvo.rsr.views.donate',
        name='complete_donation'),

    url(r'^project/(?P<project_id>\d+)/donate/$',
        'akvo.rsr.views.setup_donation',
        name='project_donate'),

    url(r'^donate/thanks/$',
        'akvo.rsr.views.donate_thanks',
        name='donate_thanks'),

    url(r'^donate/500/$',
        direct_to_template, {'template': 'rsr/donate_500.html'},
        name='donate_500'),

    url(r'^donate/paypal/ipn/$',
        csrf_exempt(paypal_ipn),
        name='paypal_ipn'),

    # Organisations
    url(r'^organisations/$',
        'akvo.rsr.views.orglist',
        name='rsr_org_list'),

    url(r'^organisations/(?P<org_type>[_a-zA-Z]+)/$',
        'akvo.rsr.views.orglist',
        name='rsr_org_list_filtered'),

    url(r'^organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.orgdetail',
        name='organisation_main'),

    # Maps
    url(r'^maps/projects/all/json/$',
        'akvo.rsr.views.global_project_map_json',
        name='global_project_map_json'),

    url(r'^maps/organisation/(?P<org_id>\d+)/projects/json/$',
        'akvo.rsr.views.global_organisation_projects_map_json',
        name='global_organisation_projects_map_json'),

    url(r'^maps/organisations/all/json/$',
        'akvo.rsr.views.global_organisation_map_json',
        name='global_organisation_map_json'),

    url(r'^maps/projects/all/$',
        direct_to_template,
        {'template': 'rsr/project/global_project_map.html'},
        name='global_project_map'),

    url(r'^maps/organisations/all/$',
        direct_to_template,
        {'template': 'rsr/organisation/global_organisation_map.html'},
        name='global_organisation_map'),

    # MyAkvo
    url(r'^myakvo/mobile/$',
        'akvo.rsr.views.myakvo_mobile',
        name='myakvo_mobile'),

    url(r'^myakvo/mobile/number/$',
        'akvo.rsr.views.myakvo_mobile_number',
        name='myakvo_mobile_number'),

    url(r'^myakvo/mobile/cancel-reporter/(?P<reporter_id>\d+)/$',
        'akvo.rsr.views.myakvo_cancel_reporter',
        name='myakvo_cancel_reporter'),

    url(r'^myakvo/$',
        'akvo.rsr.views.update_user_profile',
        name='myakvo'),

)

# Non muli-lingual urls
urlpatterns += patterns(
    '',

    # Landing pages
    url(r'^liveearth/$',
        'akvo.rsr.views.liveearth',
        name='live_earth_landing_page',),

    url(r'^walking-for-water/$',
        'akvo.rsr.views.walking_for_water',
        name='wfw_landing_page',),

    url(r'^rabobank/$',
        'akvo.rsr.views.rabobank',
        name='rabobank_landing_page',),

    # Data collections
    url(r'^data/overview/$',
        'akvo.rsr.views.data_overview',
        name='akvo_at_a_glance'),

    # Account
    url(r'^signin/$',
        'akvo.rsr.views.login', {'template_name': 'rsr/sign_in.html'},
        name='signin'),

    url(r'^signout/$',
        'akvo.rsr.views.signout',
        name='signout'),

    url(r'^accounts/register1/$',
        'akvo.rsr.views.register1',
        name='register1'),

    url(r'^accounts/register2/$',
        'akvo.rsr.views.register2',
        name='register2'),

    url(r'^accounts/activate/(?P<activation_key>\w+)/$',
        'akvo.rsr.views.activate',
        name='registration_activate',),

    # url(r'^rsr/accounts/update/$',
    #     'akvo.rsr.views.update_user_profile', name='registration_update',),

    url(r'^accounts/password/change/$',
        'akvo.rsr.views.password_change',
        name='password_change'),

    url(r'^accounts/password/reset/$',
        auth_views.password_reset,
        {'password_reset_form': RSR_PasswordResetForm,
            'post_reset_redirect': '/accounts/password/reset/done/'},
        name='rsr_password_reset'),

    url(r'^accounts/password/reset/confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$',
        auth_views.password_reset_confirm,
        {'set_password_form': RSR_SetPasswordForm},
        name='auth_password_reset_confirm'),

    url(r'^accounts/update/complete/$',
        direct_to_template, {'template': 'registration/update_complete.html'},
        name='registration_update_complete'),

    (r'^accounts/', include('registration.urls')),

    url(r'^error/access_denied/$',
        direct_to_template,
        {'template': 'rsr/error_access_denied.html'},
        name='access_denied'),

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

    # Phone
    #(r'^rsr/mosms/$', 'akvo.rsr.views.sms_update', ),
    #(r'^rsr/momms/$', 'akvo.rsr.views.mms_update', ),

    # Auth token for mobile apps
    url(r'^auth/token/$',
        'akvo.rsr.views.get_api_key',
        name="auth_token"),

    # Includes
    (r'^admin/', include(admin.site.urls)),
    (r'^counter/', include('django_counter.urls')),
    (r'^notices/', include('notification.urls')),
    (r'^gateway/', include('akvo.gateway.urls')),
    # TODO: proper versioning, appending v1/ for now to future-proof
    (r'^rest/v1/', include('akvo.rest.urls')),
    #(r'^i18n/', include('django.conf.urls.i18n')),
)

# API
urlpatterns += patterns(
    '',

    #tastypie
    # generate all resource urls for version one of the api,
    # e.g. /api/v1/project/
    (r'^api/', include(named_api('v1').urls)),
)

# Widgets
urlpatterns += patterns(
    '',

    url(r'^partners-widget/$',
        'akvo.rsr.views.partners_widget',
        name='rsr_partners_widget'),

    url(r'^widget/all-organisations/$',
        'akvo.rsr.views.partners_widget',
        name='rsr_partners_widget'),

    url(r'^widget/one-from-organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.select_project_widget',
        name='select_project_widget',),

    url(r'^widget/(?P<template>[\w-]+)/project/(?P<project_id>\d+)/$',
        'akvo.rsr.views.project_widget',
        name='project_widget', ),

    url(r'^widget/(?P<template>[\w-]+)/$',
        'akvo.rsr.views.project_widget',
        name='project_widget_default',),

    url(r'^widget/project-list/all/$',
        'akvo.rsr.views.project_list_widget',
        name='project_list_widget',),

    url(r'^widget/project-list/organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.project_list_widget',
        name='project_list_widget_for_org',),

    url(r'^widget/project-map/organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.project_map_widget',
        name='project_map_widget_for_org',),
)

handler403 = 'akvo.rsr.views.forbidden'
handler500 = 'akvo.rsr.views.server_error'
if settings.DEBUG:
    urlpatterns += patterns(
        '',

        (r'^500/$', 'akvo.rsr.views.server_error'),
    )

#if settings.DEBUG:
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

urlpatterns += staticfiles_urlpatterns()
