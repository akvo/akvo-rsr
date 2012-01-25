# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.tasks.environment.hostbase


class UpdateSystemPythonPackages(fab.tasks.environment.hostbase.LinuxHostBaseTask):
    """Updates the system Python packages for a given remote host"""

    name = 'update_system_python_packages'

    def run(self, config_type, host_alias=None, repository_branch=None, database_name=None, custom_config_module_path=None):
        linux_host = self._configure_linux_host_with(config_type, host_alias, repository_branch, database_name, custom_config_module_path)

        linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        linux_host.update_system_python_packages()


instance = UpdateSystemPythonPackages()
