# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.loader import ConfigType


class TaskParameters(object):

    REMOTE_HOST_CONTROLLER_MODE = 'host_controller_mode=remote'
    NONE = ''

    def __init__(self, config_type_specifier):
        self.config_type = ConfigType(config_type_specifier)

    def compose_parameter_list(self, additional_task_parameters,
                                     host_alias=None,
                                     repository_branch=None,
                                     database_name=None,
                                     custom_config_module_path=None):
        parameter_list = []

        if additional_task_parameters != TaskParameters.NONE:
            parameter_list.append(additional_task_parameters)

        if self.config_type.is_standard():
            self._assign_parameter(parameter_list, 'host_alias', host_alias)
            self._assign_parameter(parameter_list, 'repository_branch', repository_branch)
            self._assign_parameter(parameter_list, 'database_name', database_name)
        elif self.config_type.is_preconfigured():
            self._assign_parameter(parameter_list, 'host_alias', host_alias)
        elif self.config_type.is_custom():
            self._assign_parameter(parameter_list, 'custom_config_module_path', custom_config_module_path)
        else:
            self.feedback.abort('Unknown configuration type: %s' % config_type)

        return ','.join(parameter_list)

    def _assign_parameter(self, parameter_list, parameter_name, parameter_value):
        parameter_list.append('%s=%s' % (parameter_name, parameter_value))
