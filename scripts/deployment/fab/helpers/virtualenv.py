# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.files import FilesHelper
from fab.helpers.runner import FabricRunner


class VirtualEnv(object):

    def __init__(self, virtualenv_path, execution_feedback = ExecutionFeedback(), fabric_runner = FabricRunner(), files_helper = FilesHelper()):
        self.virtualenv_path = virtualenv_path
        self.feedback = execution_feedback
        self.fabric = fabric_runner
        self.files = files_helper

    def create_empty_virtualenv(self, pip_install_log_file):
        self.feedback.comment("\n>> Deleting previous virtualenv directory and pip install log file")
        self.files.delete_directory_with_sudo(self.virtualenv_path)
        self.files.delete_file_with_sudo(pip_install_log_file)

        self.feedback.comment("\n>> Creating new virtualenv at %s" % self.virtualenv_path)
        self.fabric.run("virtualenv --no-site-packages %s" % self.virtualenv_path)
        self.list_installed_virtualenv_packages()

    def install_packages(self, pip_requirements_file, pip_install_log_file):
        self.feedback.comment("\n>> Installing packages in virtualenv at %s" % self.virtualenv_path)
        self.with_virtualenv("pip install -q -M -E %s -r %s --log=%s" % (self.virtualenv_path, pip_requirements_file, pip_install_log_file))
        self.list_installed_virtualenv_packages()

    def list_installed_virtualenv_packages(self):
        self.fabric.run("pip freeze -E %s" % self.virtualenv_path)

    def with_virtualenv(self, command):
        self.fabric.run("source %s/bin/activate && %s" % (self.virtualenv_path, command))
