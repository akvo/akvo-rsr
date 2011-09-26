# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.os.filesystem import FileSystem


class VirtualEnv(object):
    """VirtualEnv represents the actions that can be performed on an installed virtualenv"""

    def __init__(self, virtualenv_path, host_controller):
        self.virtualenv_path = virtualenv_path
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    def list_installed_virtualenv_packages(self):
        self.feedback.comment("Installed packages:")
        self.run_within_virtualenv("pip freeze")

    def run_within_virtualenv(self, command):
        self.host_controller.run("source %s/bin/activate && %s" % (self.virtualenv_path, command))


class VirtualEnvInstaller(object):
    """VirtualEnvInstaller encapsulates virtualenv installation and package installation functionality"""

    def __init__(self, virtualenv_installer_config, host_controller, file_system, virtualenv):
        self.virtualenv_installer_config = virtualenv_installer_config
        self.host_controller = host_controller
        self.file_system = file_system
        self.virtualenv = virtualenv
        self.feedback = host_controller.feedback

        self.virtualenv_path = self.virtualenv_installer_config.rsr_env_path

    @staticmethod
    def create_instance(virtualenv_installer_config, host_controller, file_system):
        return VirtualEnvInstaller(virtualenv_installer_config, host_controller, file_system,
                                   VirtualEnv(virtualenv_installer_config.rsr_env_path, host_controller))

    def virtualenv_exists(self):
        return self.file_system.directory_exists(self.virtualenv_path)

    def delete_existing_virtualenv(self):
        if self.virtualenv_exists():
            self.feedback.comment("Deleting existing virtualenv")
            self.file_system.delete_directory_with_sudo(self.virtualenv_path)

    def ensure_virtualenv_exists(self):
        if not self.virtualenv_exists():
            self.create_empty_virtualenv()
        else:
            self.feedback.comment("Found existing virtualenv at %s" % self.virtualenv_path)
            self.virtualenv.list_installed_virtualenv_packages()

    def create_empty_virtualenv(self):
        if self.virtualenv_exists():
            self.delete_existing_virtualenv()

        self.feedback.comment("Creating new virtualenv at %s" % self.virtualenv_path)
        self.host_controller.run("virtualenv --no-site-packages --distribute %s" % self.virtualenv_path)
        self.virtualenv.list_installed_virtualenv_packages()

    def install_packages(self, pip_requirements_file):
        self._install_packages_in_virtualenv(pip_requirements_file, quietly=False)

    def install_packages_quietly(self, pip_requirements_file):
        self._install_packages_in_virtualenv(pip_requirements_file, quietly=True)

    def _install_packages_in_virtualenv(self, pip_requirements_file, quietly):
        self.feedback.comment("Installing packages in virtualenv at %s" % self.virtualenv_path)
        self.virtualenv.run_within_virtualenv(self._pip_install_command(pip_requirements_file, quietly))
        self.virtualenv.list_installed_virtualenv_packages()

    def _pip_install_command(self, pip_requirements_file, quietly):
        quite_mode_switch = "-q " if quietly else ""
        pip_install_command_base = "pip install %s-M -E %s" % (quite_mode_switch, self.virtualenv_path)
        pip_install_log_file = self.virtualenv_installer_config.time_stamped_pip_install_log_file_path()

        return "%s -r %s --log=%s" % (pip_install_command_base, pip_requirements_file, pip_install_log_file)
