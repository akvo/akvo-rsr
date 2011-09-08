# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.conf.urls.defaults import patterns
from django.views.generic.simple import direct_to_template


urlpatterns = patterns('',
    (r'^$', direct_to_template, {'template': 'partner_sites/marketing.html'}),
)
