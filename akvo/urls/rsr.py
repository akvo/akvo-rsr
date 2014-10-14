# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.conf.urls import (include, patterns, url)
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from django.contrib import admin
admin.autodiscover()

import oembed
oembed.autodiscover()

urlpatterns = patterns(
    '',

    # Home page
    url(r'^$',
        'akvo.rsr.views.index', name='index'),

    # Projects
    url(r'^projects/$',
        'akvo.rsr.views.project.directory', name='project-directory'),

    url(r'^projects/(?P<project_id>\d+)/$',
        'akvo.rsr.views.project.main', name='project-main'),

    # Organisations
    url(r'^organisations/$',
        'akvo.rsr.views.organisation.directory',
        name='organisation-directory'),

    url(r'^organisations/(?P<organisation_id>\d+)/$',
        'akvo.rsr.views.organisation.main', name='organisation-main'),

    # Updates
    url(r'^updates/$',
        'akvo.rsr.views.project_update.directory', name='update-directory'),

    url(r'^updates/(?P<update_id>\d+)/$',
        'akvo.rsr.views.project_update.main', name='update-main'),

    # Account
    url(r'^register/$',
        'akvo.rsr.views.account.register', name='register'),

    url(r'^activate/(?P<activation_key>\w+)/$',
        'akvo.rsr.views.account.activate', name='activate'),

    url(r'^sign_in/$',
        'akvo.rsr.views.account.sign_in', name='sign_in'),

    url(r'^sign_out/$',
        'akvo.rsr.views.account.sign_out', name='sign_out'),

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

    # Admin
    (r'^admin/', include(admin.site.urls)),

    # Django Rest Framework urls
    (r'^rest/v1/', include('akvo.rest.urls')),
    url(r'^rest/docs/', include('rest_framework_swagger.urls')),
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
