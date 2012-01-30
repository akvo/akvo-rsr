# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.host.linux
import fab.tasks.base


class LinuxHostBaseTask(fab.tasks.base.BaseDeploymentTask):
    """Base deployment task for actions that required a configured Linux host"""

    def _configure_linux_host_with(self, host_config_specification):
        return fab.host.linux.LinuxHost.create_with(self.config_loader.parse(host_config_specification))
