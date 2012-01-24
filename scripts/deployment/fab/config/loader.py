# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.host import CIDeploymentHostConfig, DeploymentHostConfig
from fab.config.values.host import HostAlias


class ConfigType(object):

    CUSTOM          = 'custom'
    PRECONFIGURED   = 'preconfigured'
    STANDARD        = 'standard'

    def __init__(self, config_type):
        self.config_type = config_type

    def is_custom(self):
        return self.config_type == self.CUSTOM

    def is_preconfigured(self):
        return self.config_type == self.PRECONFIGURED

    def is_standard(self):
        return self.config_type == self.STANDARD


class DeploymentConfigLoader(object):

    preconfigured_hosts = { HostAlias.TEST:     CIDeploymentHostConfig.for_test(),
                            HostAlias.TEST2:    CIDeploymentHostConfig.for_test2() }

    def load_preconfigured_for(self, host_alias):
        return self.preconfigured_hosts[host_alias]

    def load(self, host_alias, repository_branch, database_name):
        return DeploymentHostConfig.create_with(host_alias, repository_branch, database_name)

    def load_custom_from(self, custom_config_module_path):
        import imp
        imp.load_source('custom_config', custom_config_module_path)
        from custom_config import CustomDeploymentHostConfig

        return CustomDeploymentHostConfig.create()
