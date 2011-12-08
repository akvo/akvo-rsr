# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.environment.python.pipinstaller import PipInstaller
from fab.environment.python.packageinstallationpaths import SystemPackageInstallationPaths
from fab.helpers.internet import Internet
from fab.os.filesystem import FileSystem


class SystemPythonPackageInstaller(object):

    def __init__(self, codebase_config, package_installation_paths, pip_installer, file_system, internet_helper, host_controller):
        self.system_requirements_file_url = codebase_config.system_requirements_file_url
        self.package_download_dir = package_installation_paths.package_download_dir

        self.pip_installer = pip_installer
        self.file_system = file_system
        self.internet = internet_helper
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    @staticmethod
    def create_instance(host_controller):
        return SystemPythonPackageInstaller(RSRCodebaseConfig.create_instance(),
                                            SystemPackageInstallationPaths.create_instance(),
                                            PipInstaller.create_instance(host_controller),
                                            FileSystem(host_controller),
                                            Internet(host_controller),
                                            host_controller)

    def install_package_tools(self):
        self._clear_package_download_directory()
        self.pip_installer.ensure_pip_is_installed()

    def _clear_package_download_directory(self):
        self.file_system.delete_directory_with_sudo(self.package_download_dir)
        self.file_system.ensure_directory_exists(self.package_download_dir)

    def install_system_packages(self):
        self._install_system_packages(quietly=False)

    def install_system_packages_quietly(self):
        self._install_system_packages(quietly=True)

    def _install_system_packages(self, quietly):
        self._list_installed_python_packages()
        self.feedback.comment("Updating system Python packages:")
        self._install_packages_with_pip(self.system_requirements_file_url, quietly)
        self._list_installed_python_packages()

    def _list_installed_python_packages(self):
        self.feedback.comment("Installed system packages:")
        self.host_controller.run("pip freeze")

    def _install_packages_with_pip(self, requirements_file_url, quietly):
        self.internet.download_file_to_directory(self.package_download_dir, requirements_file_url)

        with self.host_controller.cd(self.package_download_dir):
            quiet_mode_switch = "-q " if quietly else ""
            self.host_controller.sudo("pip install %s-M -r %s --log=pip_install.log" % (quiet_mode_switch,
                                                                                        self._file_from_url(requirements_file_url)))

    def _file_from_url(self, file_url):
        return file_url.split('/')[-1]
