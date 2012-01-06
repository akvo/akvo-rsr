# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.host.linux


class InstallPython(fabric.tasks.Task):
    """Installs a specified Python interpreter"""

    name = "install_python"

    def __init__(self, deployment_user, linux_host):
        self.deployment_user = deployment_user
        self.linux_host = linux_host

    @staticmethod
    def create_task_instance(deployment_user):
        return InstallPython(deployment_user, fab.host.linux.LinuxHost.create_instance())

    def run(self, python_version):
        self.linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        self.linux_host.ensure_python_is_installed_with_version(python_version)


instance = InstallPython.create_task_instance(fabric.api.env.user)
