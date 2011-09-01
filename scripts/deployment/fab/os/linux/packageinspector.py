# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class UbuntuPackageInspector(object):

    def __init__(self, host_controller):
        self.host_controller = host_controller

    def info_for(self, package_name):
        with self.host_controller.hide('stdout'):
            return self.host_controller.run("aptitude show %s" % package_name)
