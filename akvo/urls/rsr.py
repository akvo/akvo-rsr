# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.conf.urls.defaults import *
from django.contrib.auth import views as auth_views
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.simple import direct_to_template
from django.conf.urls.i18n import i18n_patterns

from akvo.rsr.feeds import ProjectUpdates, OrganisationUpdates, AllProjectUpdates
from akvo.rsr.forms import RSR_PasswordResetForm, RSR_SetPasswordForm

from paypal.standard.ipn.views import ipn as paypal_ipn

# The next two lines enable the admin and load each admin.py file:
from django.contrib import admin
admin.autodiscover()
# The next two lines enable djangoembed in the admin
import oembed
oembed.autodiscover()

# tastypie (api)
from tastypie.api import Api
from akvo.api.resources import (
    ProjectResource, CategoryResource, LinkResource, OrganisationResource, PartnershipResource
)

v1_api = Api(api_name='v1')
v1_api.register(CategoryResource())
v1_api.register(LinkResource())
v1_api.register(ProjectResource())
v1_api.register(OrganisationResource())
v1_api.register(PartnershipResource())



# Multi-lingual urls
# urlpatterns = i18n_patterns('',
urlpatterns = patterns('',

    # Home page
    url(r'^$',
        'akvo.rsr.views.index', name='index'),

    url(r'^rsr/index-preview/(?P<cms_id>\d+)/$',
        'akvo.rsr.views.index', name='index_preview'),

    # Project list
    url(r'^rsr/projects/$',
        'akvo.rsr.views.old_project_list', name='old_project_list'),

    url(r'^rsr/projects/(?P<slug>[_\-a-zA-Z0-9]+)/$',
        'akvo.rsr.views.project_list', name='project_list'),

    # Project
    url(r'^rsr/project/(?P<project_id>\d+)/$',
        'akvo.rsr.views.projectmain', name='project_main'),

    url(r'^rsr/project/(?P<project_id>\d+)/details/$',
        'akvo.rsr.views.projectdetails', name='project_details'),

    url(r'^rsr/project/(?P<project_id>\d+)/funding/$',
        'akvo.rsr.views.projectfunding', name='project_funding'),

    url(r'^rsr/project/(?P<project_id>\d+)/partners/$',
        'akvo.rsr.views.projectpartners', name='project_partners'),

    url(r'^rsr/project/(?P<project_id>\d+)/comments/$',
        'akvo.rsr.views.projectcomments', name='project_comments'),

    url(r'^rsr/project/(?P<project_id>\d+)/get-a-widget/$',
        'akvo.rsr.views.getwidget', name='project_get_widget'),

    (r'^rsr/project/(?P<project_id>\d+)/comment/$',
        'akvo.rsr.views.commentform', ),

    # Project updates
    url(r'^rsr/project/(?P<project_id>\d+)/updates/$',
        'akvo.rsr.views.projectupdates', name='project_updates'),

    url(r'^rsr/project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/edit/$',
        'akvo.rsr.views.updateform', name='project_edit_update'),

    url(r'^rsr/project/(?P<project_id>\d+)/update/$',
        'akvo.rsr.views.updateform', name='project_add_update'),

    url(r'^rsr/project/(?P<project_id>\d+)/update/(?P<update_id>\d+)/$',
        'akvo.rsr.views.projectupdate', name='update_main'),

    # Payment engines
    url(r'^rsr/mollie/report/$',
        'akvo.rsr.views.mollie_report', name='mollie_report'),

    url(r'^rsr/invoice/(?P<invoice_id>\d+)/(?P<action>\w+)/$',
        'akvo.rsr.views.void_invoice', name='void_invoice'),

    url(r'^rsr/project/(?P<project_id>\d+)/donate/(?P<engine>\w+)/$',
        'akvo.rsr.views.donate', name='complete_donation'),

    url(r'^rsr/project/(?P<project_id>\d+)/donate/$',
        'akvo.rsr.views.setup_donation', name='project_donate'),

    url(r'^rsr/donate/ideal/thanks/$',
        'akvo.rsr.views.mollie_thanks', name='mollie_thanks'),

    url(r'^rsr/donate/paypal/thanks/$',
        'akvo.rsr.views.paypal_thanks', name='paypal_thanks'),

    url(r'^rsr/donate/500/$',
        direct_to_template, {'template': 'rsr/donate_500.html'},
        name='donate_500'),

    url(r'^rsr/donate/paypal/ipn/$',
        csrf_exempt(paypal_ipn), name='paypal_ipn'),

    # Organisations
    url(r'^rsr/organisations/$',
        'akvo.rsr.views.orglist', name='rsr_org_list'),

    url(r'^rsr/organisations/(?P<org_type>[_a-zA-Z]+)/$',
        'akvo.rsr.views.orglist', name='rsr_org_list_filtered'),

    url(r'^rsr/organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.orgdetail', name='organisation_main'),

    # Maps
    url(r'^rsr/maps/projects/all/json/$',
        'akvo.rsr.views.global_project_map_json',
        name='global_project_map_json'),
   
    url(r'^rsr/maps/organisation/(?P<org_id>\d+)/projects/json/$',
        'akvo.rsr.views.global_organisation_projects_map_json',
        name='global_organisation_projects_map_json'),

    url(r'^rsr/maps/organisations/all/json/$',
        'akvo.rsr.views.global_organisation_map_json',
        name='global_organisation_map_json'),

    url(r'^rsr/maps/projects/all/$',
        direct_to_template,
        {'template': 'rsr/project/global_project_map.html'},
        name='global_project_map'),

    url(r'^rsr/maps/organisations/all/$',
        direct_to_template,
        {'template': 'rsr/organisation/global_organisation_map.html'},
        name='global_organisation_map'),

    # MyAkvo
    url(r'^rsr/myakvo/mobile/$',
        'akvo.rsr.views.myakvo_mobile', name='myakvo_mobile'),

    url(r'^rsr/myakvo/mobile/number/$',
        'akvo.rsr.views.myakvo_mobile_number', name='myakvo_mobile_number'),

    url(r'^rsr/myakvo/mobile/cancel-reporter/(?P<reporter_id>\d+)/$',
        'akvo.rsr.views.myakvo_cancel_reporter', name='myakvo_cancel_reporter'),

    url(r'^rsr/myakvo/$', 'akvo.rsr.views.update_user_profile', name='myakvo'),

)

# Non muli-lingual urls
urlpatterns += patterns('',
    # Redirect to home page
    (r'^rsr/$',
        'akvo.rsr.views.oldindex', ),

    # Landing pages
    url(r'^rsr/liveearth/$',
        'akvo.rsr.views.liveearth', name='live_earth_landing_page',),

    url(r'^rsr/walking-for-water/$',
        'akvo.rsr.views.walking_for_water', name='wfw_landing_page',),

    url(r'^rsr/rabobank/$',
        'akvo.rsr.views.rabobank', name='rabobank_landing_page',),

    # Data collections
    url(r'^rsr/data/overview/$',
        'akvo.rsr.views.data_overview', name='akvo_at_a_glance'),

    # Account
    url(r'^rsr/signin/$',
        'akvo.rsr.views.login', {'template_name': 'rsr/sign_in.html'},
        name='signin'),

    url(r'^rsr/signout/$',
        'akvo.rsr.views.signout', name='signout'),

    url(r'^rsr/accounts/register1/$',
        'akvo.rsr.views.register1', name='register1'),

    url(r'^rsr/accounts/register2/$',
        'akvo.rsr.views.register2', name='register2'),

    url(r'^rsr/accounts/activate/(?P<activation_key>\w+)/$',
        'akvo.rsr.views.activate', name='registration_activate',),

    # url(r'^rsr/accounts/update/$',
    #     'akvo.rsr.views.update_user_profile', name='registration_update',),

    url(r'^rsr/accounts/password/change/$',
        'akvo.rsr.views.password_change', name='password_change'),

    url(r'^rsr/accounts/password/reset/$',
        auth_views.password_reset,
        {'password_reset_form': RSR_PasswordResetForm,
            'post_reset_redirect': '/rsr/accounts/password/reset/done/'},
        name='rsr_password_reset'),

    url(r'^rsr/accounts/password/reset/confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$',
        auth_views.password_reset_confirm,
        {'set_password_form': RSR_SetPasswordForm},
        name='auth_password_reset_confirm'),

    url(r'^rsr/accounts/update/complete/$',
        direct_to_template, {'template': 'registration/update_complete.html'},
        name='registration_update_complete'),

    (r'^rsr/accounts/', include('registration.urls')),

    url(r'^rsr/error/access_denied/$',
        direct_to_template,
        {'template': 'rsr/error_access_denied.html'},
        name='access_denied'),

    # RSS
    url(r'^rsr/rss/updates/(?P<project_id>\d+)/$',
        ProjectUpdates(), name="rss_project_updates"),

    url(r'^rsr/rss/org-updates/(?P<org_id>\d+)/$',
        OrganisationUpdates(), name="rss_org_updates"),

    url(r'^rsr/rss/all-updates/$',
        AllProjectUpdates(), name="rss_all_updates"),

    # Phone
    #(r'^rsr/mosms/$', 'akvo.rsr.views.sms_update', ),
    #(r'^rsr/momms/$', 'akvo.rsr.views.mms_update', ),

    # Includes
    (r'^rsr/admin/', include(admin.site.urls)),
    (r'^rsr/counter/', include('django_counter.urls')),
    (r'^rsr/notices/', include('notification.urls')),
    (r'^rsr/gateway/', include('akvo.gateway.urls')),
    #(r'^i18n/', include('django.conf.urls.i18n')),
)

# API
urlpatterns += patterns('',
    #django-piston
    (r'^rsr/api/', include('akvo.api.piston_urls')),

    #tastypie
    (r'^api/', include(v1_api.urls)),
)

# Widgets
urlpatterns += patterns('',
    url(r'^rsr/partners-widget/$',
        'akvo.rsr.views.partners_widget', name='rsr_partners_widget'),

    url(r'^rsr/widget/all-organisations/$',
        'akvo.rsr.views.partners_widget', name='rsr_partners_widget'),

    url(r'^rsr/widget/one-from-organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.select_project_widget', name='select_project_widget',),

    url(r'^rsr/widget/(?P<template>[\w-]+)/project/(?P<project_id>\d+)/$',
        'akvo.rsr.views.project_widget', name='project_widget', ),

    url(r'^rsr/widget/(?P<template>[\w-]+)/$',
        'akvo.rsr.views.project_widget', name='project_widget_default',),

    url(r'^rsr/widget/project-list/all/$',
        'akvo.rsr.views.project_list_widget', name='project_list_widget',),

    url(r'^rsr/widget/project-list/organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.project_list_widget',
        name='project_list_widget_for_org',),

    url(r'^rsr/widget/project-map/organisation/(?P<org_id>\d+)/$',
        'akvo.rsr.views.project_map_widget',
        name='project_map_widget_for_org',),
)


handler500 = 'akvo.rsr.views.server_error'
if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^500/$', 'akvo.rsr.views.server_error'),
    )

#if settings.DEBUG:
urlpatterns += patterns('',
    (r'^rsr/media/(?P<path>.*)$',
        'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
)

if 'rosetta' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
        url(r'^rsr/rosetta/', include('rosetta.urls')),
    )
