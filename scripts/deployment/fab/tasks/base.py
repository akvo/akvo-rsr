# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.loader


class BaseDeploymentTask(fabric.tasks.Task):
    """Base task for RSR deployment actions"""

    def __init__(self, config_loader=fab.config.loader.DeploymentConfigLoader()):
        self.deployment_user = fabric.api.env.user
        self.config_loader = config_loader
