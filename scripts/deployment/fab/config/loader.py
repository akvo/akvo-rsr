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

    def __init__(self, feedback):
        self.feedback = feedback

    def host_config_for(self, config_type, host_alias=None, repository_branch=None, database_name=None, custom_config_module_path=None):
        self.config_type = ConfigType(config_type)

        if self.config_type.is_standard():
            return self._load_standard_from(host_alias, repository_branch, database_name)
        elif self.config_type.is_preconfigured():
            return self._load_preconfigured_for(host_alias)
        elif self.config_type.is_custom():
            return self._load_custom_from(custom_config_module_path)
        else:
            self.feedback.abort('Unknown configuration type: %s' % config_type)

    def _load_preconfigured_for(self, host_alias):
        return self.preconfigured_hosts[host_alias]

    def _load_standard_from(self, host_alias, repository_branch, database_name):
        return DeploymentHostConfig.create_with(host_alias, repository_branch, database_name)

    def _load_custom_from(self, custom_config_module_path):
        import imp
        imp.load_source('custom_config', custom_config_module_path)
        from custom_config import CustomDeploymentHostConfig

        return CustomDeploymentHostConfig.create()
