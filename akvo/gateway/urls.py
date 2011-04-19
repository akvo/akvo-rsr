# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf.urls.defaults import *

urlpatterns = patterns('akvo.gateway.views',
    (r'^(?P<gw_name>\w+)/$', 'receive_sms'),
)
