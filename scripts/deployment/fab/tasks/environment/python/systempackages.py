# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.host.linux


class UpdateSystemPythonPackages(fabric.tasks.Task):
    """Updates the system Python packages for a given remote host"""

    name = "update_system_python_packages"

    def __init__(self, linux_host):
        self.linux_host = linux_host

    @staticmethod
    def create_task_instance():
        return UpdateSystemPythonPackages(fab.host.linux.LinuxHost.create_instance())

    def run(self):
        self.linux_host.update_system_python_packages()


instance = UpdateSystemPythonPackages.create_task_instance()
