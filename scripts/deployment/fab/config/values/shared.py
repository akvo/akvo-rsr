# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class Hosts(object):

    def __init__(self):
        self.data_host  = 'www.akvo.org:22'
        self.media_host = '89.233.254.43:2268'


class DataHostPaths(object):

    def __init__(self):
        self.django_apps_home   = '/var/lib/django'
        self.virtualenvs_home   = '/var/virtualenvs'
