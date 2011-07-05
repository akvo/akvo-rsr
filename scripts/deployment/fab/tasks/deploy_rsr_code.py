# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.deployer_config
import fab.helpers.permissions


class DeployRSRCode(fabric.tasks.Task):
    """Deploys RSR codebase to a specified location"""

    name = "deploy_rsr_code"

    def __init__(self, environment):
        self.env = environment
        fab.config.deployer_config.DeployerConfig(self.env).load_config()
        self.permissions = fab.helpers.permissions.PermissionsHelper(self.env)

    def run(self):
        print "\n>> Deploying RSR codebase"
        self.ensure_required_paths_exist()

    def ensure_required_paths_exist(self):
        self.ensure_user_is_member_of_akvo_permissions_group()

    def ensure_user_is_member_of_akvo_permissions_group(self):
        print "\n>> Checking that user [%s] is a member of group [%s]" % (self.env.user,
            self.env.akvo_permissions_group) + " (required for setting directory permissions later on)"
        self.permissions.ensure_user_is_member_of_group(self.env.akvo_permissions_group)


instance = DeployRSRCode(fabric.api.env)
