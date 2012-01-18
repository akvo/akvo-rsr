# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.loaders
import fab.host.linux


class UpdateSystemPythonPackages(fabric.tasks.Task):
    """Updates the system Python packages for a given remote host"""

    name = "update_system_python_packages"

    def __init__(self, deployment_user, linux_host):
        self.deployment_user = deployment_user
        self.linux_host = linux_host

    @staticmethod
    def create_task():
        return UpdateSystemPythonPackages(fabric.api.env.user, fab.host.linux.LinuxHost.create_with(fab.config.loaders.DeploymentConfigLoader.load()))

    def run(self):
        self.linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        self.linux_host.update_system_python_packages()


instance = UpdateSystemPythonPackages.create_task()
