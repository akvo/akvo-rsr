# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.environment.python.virtualenv import VirtualEnv
from fab.host.neutral import NeutralHost
from fab.os.filesystem import FileSystem


class VirtualEnvHost(NeutralHost):
    """VirtualEnvHost encapsulates virtualenv related actions on a given host"""

    def __init__(self, file_system, virtualenv, feedback):
        super(VirtualEnvHost, self).__init__(file_system, feedback)
        self.virtualenv = virtualenv

    @staticmethod
    def create_instance(virtualenv_path, host_controller):
        file_system = FileSystem(host_controller)

        return VirtualEnvHost(file_system,
                              VirtualEnv(virtualenv_path, host_controller, file_system),
                              host_controller.feedback)

    def create_empty_virtualenv(self, pip_install_log_file):
        self.virtualenv.create_empty_virtualenv(pip_install_log_file)

    def ensure_virtualenv_exists(self, pip_install_log_file):
        self.virtualenv.ensure_virtualenv_exists(pip_install_log_file)

    def install_virtualenv_packages(self, pip_requirements_file, pip_install_log_file):
        self.virtualenv.install_packages(pip_requirements_file, pip_install_log_file)

    def list_installed_virtualenv_packages(self):
        self.virtualenv.list_installed_virtualenv_packages()

    def run_within_virtualenv(self, command):
        self.virtualenv.run_within_virtualenv(command)
