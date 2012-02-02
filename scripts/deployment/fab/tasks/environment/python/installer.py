# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.tasks.environment.hostbase


class InstallPython(fab.tasks.environment.hostbase.LinuxHostBaseTask):
    """Installs a specified Python interpreter"""

    name = 'install_python'

    def run(self, python_version, host_config_specification):
        linux_host = self._configure_linux_host_with(host_config_specification)

        linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        linux_host.ensure_python_is_installed_with_version(python_version)


instance = InstallPython()
