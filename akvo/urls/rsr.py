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
    url(r'^$', 'akvo.rsr.views.index', name='index'),

    # Registration view
    url(r'^register/$', 'akvo.rsr.views.register', name='register'),

    # Activation view
    url(r'^activate/(?P<activation_key>\w+)/$', 'akvo.rsr.views.activate', name='activate'),

    # Sign in view
    url(r'^sign_in/$', 'akvo.rsr.views.sign_in', name='sign_in'),

    # Sign out view
    url(r'^sign_out/$', 'akvo.rsr.views.sign_out', name='sign_out'),
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

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
