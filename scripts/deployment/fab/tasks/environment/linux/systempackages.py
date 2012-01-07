# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.environment.linux.systempackages
import fab.host.linux


class VerifySystemPackages(fabric.tasks.Task):
    """Verifies that the expected Linux system packages exist"""

    name = "verify_system_packages"

    def __init__(self, deployment_user, linux_host):
        self.deployment_user = deployment_user
        self.linux_host = linux_host

    @staticmethod
    def create_task_instance(deployment_user):
        return VerifySystemPackages(deployment_user, fab.host.linux.LinuxHost.create_instance())

    def run(self):
        self.linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        self.linux_host.update_system_package_sources()

        for package_specifications in fab.config.environment.linux.systempackages.SystemPackageSpecifications.ALL_PACKAGES:
            self.linux_host.exit_if_system_package_dependencies_not_met(package_specifications)


instance = VerifySystemPackages.create_task_instance(fabric.api.env.user)
