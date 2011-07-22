# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class VirtualEnv(object):

    def __init__(self, virtualenv_path, deployment_host, file_system, execution_feedback):
        self.virtualenv_path = virtualenv_path
        self.deployment_host = deployment_host
        self.file_system = file_system
        self.feedback = execution_feedback

    def create_empty_virtualenv(self, pip_install_log_file):
        self.feedback.comment("Deleting previous virtualenv directory and pip install log file")
        self.file_system.delete_directory_with_sudo(self.virtualenv_path)
        self.file_system.delete_file_with_sudo(pip_install_log_file)

        self.feedback.comment("Creating new virtualenv at %s" % self.virtualenv_path)
        self.deployment_host.run("virtualenv --no-site-packages --distribute %s" % self.virtualenv_path)
        self.list_installed_virtualenv_packages()

    def install_packages(self, pip_requirements_file, pip_install_log_file):
        self.feedback.comment("Installing packages in virtualenv at %s" % self.virtualenv_path)
        self.with_virtualenv("pip install -M -E %s -r %s --log=%s" % (self.virtualenv_path, pip_requirements_file, pip_install_log_file))
        self.list_installed_virtualenv_packages()

    def list_installed_virtualenv_packages(self):
        self.deployment_host.run("pip freeze -E %s" % self.virtualenv_path)

    def with_virtualenv(self, command):
        self.deployment_host.run("source %s/bin/activate && %s" % (self.virtualenv_path, command))
