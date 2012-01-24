# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.config.loader


class DeploymentTaskBase(fabric.tasks.Task):
    """Base task for RSR deployment actions"""

    def __init__(self, feedback, config_loader):
        self.config_loader = config_loader
        self.feedback = feedback

    def _host_config_for(self, config_type, host_alias=None, repository_branch=None, database_name=None, custom_config_module_path=None):
        self.config_type = fab.config.loader.ConfigType(config_type)

        if self.config_type.is_standard():
            return self.config_loader.load(host_alias, repository_branch, database_name)
        elif self.config_type.is_preconfigured():
            return self.config_loader.load_preconfigured_for(host_alias)
        elif self.config_type.is_custom():
            return self.config_loader.load_custom_from(custom_config_module_path)
        else:
            self.feedback.abort('Unknown configuration type: %s' % config_type)
