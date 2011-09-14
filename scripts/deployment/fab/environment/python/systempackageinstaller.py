# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.environment.python.packagetools import PackageInstallationToolsConfig
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.values import SharedConfigValues, PythonConfigValues
from fab.helpers.filesystem import FileSystem
from fab.helpers.internet import Internet


class PackageInstallationPaths(object):

    def __init__(self, python_config_values, package_tools_config, codebase_config):
        self.package_download_dir = python_config_values.python_package_download_dir
        self.distribute_setup_url = package_tools_config.distribute_setup_url
        self.pip_setup_url = package_tools_config.pip_setup_url
        self.system_requirements_url = codebase_config.system_requirements_file_url


class SystemPythonPackageInstaller(object):

    def __init__(self, installation_paths, file_system, internet_helper, host_controller):
        self.paths = installation_paths
        self.file_system = file_system
        self.internet = internet_helper
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    @staticmethod
    def create_instance(host_controller):
        python_config_values = PythonConfigValues()
        installation_paths = PackageInstallationPaths(python_config_values,
                                                      PackageInstallationToolsConfig(python_config_values.pip_version),
                                                      RSRCodebaseConfig(SharedConfigValues().repository_branch))

        return SystemPythonPackageInstaller(installation_paths, FileSystem(host_controller), Internet(host_controller), host_controller)

    def install_package_tools(self):
        self._clear_package_download_directory()
        self._download_and_install_package("distribute", self.paths.distribute_setup_url)
        self._download_and_install_package("pip", self.paths.pip_setup_url)

    def _clear_package_download_directory(self):
        self.file_system.delete_directory_with_sudo(self.paths.package_download_dir)
        self.file_system.ensure_directory_exists(self.paths.package_download_dir)

    def _download_and_install_package(self, package_name, setup_script_url):
        self.feedback.comment("Installing %s package from %s" % (package_name, setup_script_url))
        self.internet.download_file_to_directory(self.paths.package_download_dir, setup_script_url)

        with self.host_controller.cd(self.paths.package_download_dir):
            self.host_controller.sudo("python %s" % self._file_from_url(setup_script_url))

    def install_system_packages(self):
        self._list_installed_python_packages()
        self.feedback.comment("Updating system Python packages:")
        self._install_packages_with_pip(self.paths.system_requirements_file_url)
        self._list_installed_python_packages()

    def _list_installed_python_packages(self):
        self.feedback.comment("Installed system packages:")
        self.host_controller.run("pip freeze")

    def _install_packages_with_pip(self, requirements_file_url):
        self.internet.download_file_to_directory(self.paths.package_download_dir, requirements_file_url)

        with self.host_controller.cd(self.paths.package_download_dir):
            self.host_controller.run("pip install -M -r %s --log=pip_install.log" % self._file_from_url(requirements_file_url))

    def _file_from_url(self, file_url):
        return file_url.split('/')[-1]
