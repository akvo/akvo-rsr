# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.host import CIDeploymentHostConfig, DeploymentHostConfig
from fab.config.values.host import HostAlias
from fab.helpers.feedback import ExecutionFeedback


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

    def __repr__(self):
        return self.config_type


class DeploymentConfigLoader(object):

    preconfigured_hosts = { HostAlias.TEST:     CIDeploymentHostConfig.for_test(),
                            HostAlias.TEST2:    CIDeploymentHostConfig.for_test2() }

    def __init__(self, feedback=ExecutionFeedback()):
        self.feedback = feedback

    def parse(self, config_specification):
        if self._invalid_host_config_format(config_specification):
            self.feedback.abort('Invalid host configuration specification: %s -- expected config_type:some;config;values' % config_specification)

        config_spec_parts = config_specification.split(':')

        return self._parse_config_spec(ConfigType(config_spec_parts[0]), config_spec_parts[-1].split(';'))

    def _invalid_host_config_format(self, config_specification):
        return config_specification.find(':') < 0

    def _parse_config_spec(self, config_type, config_parameters):
        if config_type.is_preconfigured():
            host_alias = config_parameters[0]
            if host_alias not in self.preconfigured_hosts:
                self.feedback.abort('No preconfigured values for host alias: %s' % host_alias)
            return self.preconfigured_hosts[host_alias]
        elif config_type.is_standard():
            return DeploymentHostConfig.create_with(config_parameters[0], config_parameters[1], config_parameters[2])
        elif config_type.is_custom():
            return self._custom_config_from(config_parameters[0])
        else:
            self.feedback.abort('Cannot parse host configuration from: %s:%s' % (config_type, ''.join(config_parameters)))

    def _custom_config_from(self, custom_config_module_path):
        import imp
        imp.load_source('custom_config', custom_config_module_path)
        from custom_config import CustomDeploymentHostConfig

        return CustomDeploymentHostConfig.create()
