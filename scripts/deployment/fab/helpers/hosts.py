# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.contrib.files


class RemoteHost(object):
    """RemoteDeploymentHost encapsulates any calls made to a remote host"""

    def run(self, command):
        return fabric.api.run(command)

    def sudo(self, command):
        return fabric.api.sudo(command)

    def path_exists(self, path):
        return fabric.contrib.files.exists(path)
