# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.host.linux


class InstallPython(fabric.tasks.Task):
    """Installs a specified Python interpreter"""

    name = "install_python"

    def __init__(self, linux_host):
        self.linux_host = linux_host

    @staticmethod
    def create_task_instance():
        return InstallPython(fab.host.linux.LinuxHost.create_instance())

    def run(self, python_version):
        self.linux_host.install_python(python_version)


instance = InstallPython.create_task_instance()
