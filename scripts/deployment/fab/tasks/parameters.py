# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.loader import ConfigType


class TaskParameters(object):

    REMOTE_HOST_CONTROLLER_MODE = 'host_controller_mode=remote'

    def compose_from(self, host_config_specification, additional_task_parameters=[]):
        parameter_list = []
        parameter_list.append('%s=%s' % ('host_config_specification', host_config_specification))
        parameter_list.extend(additional_task_parameters)

        return ','.join(parameter_list)
