# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.values import DeploymentHostConfigValues
from fab.environment.python.packageinstallationpaths import SystemPackageInstallationPaths
from fab.helpers.internet import Internet
from fab.os.filesystem import FileSystem


class PipInstaller(object):

    def __init__(self, installation_paths, file_system, internet_helper, host_controller):
        self.paths = installation_paths
        self.file_system = file_system
        self.internet = internet_helper
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    @staticmethod
    def create_instance(host_controller):
        return PipInstaller(SystemPackageInstallationPaths.create_instance(),
                            FileSystem(host_controller),
                            Internet(host_controller),
                            host_controller)

    def ensure_pip_is_installed(self):
        if self._pip_not_installed() or self._pip_is_outdated():
            self._download_and_install_package("distribute", self.paths.distribute_setup_url)
            self._download_and_install_package("pip", self.paths.pip_setup_url)
        else:
            self.feedback.comment("Found expected pip version: %s" % self._installed_pip_version())

    def _pip_is_installed(self):
        return self._installed_pip_path().find("pip") > 0

    def _pip_not_installed(self):
        return not self._pip_is_installed()

    def _installed_pip_path(self):
        with self.host_controller.hide_command_and_output():
            return self.host_controller.run("which pip")

    def _pip_is_outdated(self):
        return not self._installed_pip_version_matches(SystemPackageInstallationPaths.PIP_VERSION)

    def _installed_pip_version_matches(self, expected_version):
        return self._installed_pip_version().find("pip %s from" % expected_version) >= 0

    def _installed_pip_version(self):
        with self.host_controller.hide_command_and_output():
            return self.host_controller.run("pip --version")

    def _download_and_install_package(self, package_name, setup_script_url):
        self.feedback.comment("Installing %s package from %s" % (package_name, setup_script_url))
        self.internet.download_file_to_directory(self.paths.package_download_dir, setup_script_url)

        with self.host_controller.cd(self.paths.package_download_dir):
            self.host_controller.sudo("python %s" % self._file_from_url(setup_script_url))

    def _file_from_url(self, file_url):
        return file_url.split('/')[-1]
