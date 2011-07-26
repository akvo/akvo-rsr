# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

from fab.config.deployer import DeployerConfig
from fab.helpers.codebase import Codebase
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import RemoteHost
from fab.helpers.internet import Internet
from fab.helpers.path import Path
from fab.helpers.permissions import Permissions


class DeployRSRCode(fabric.tasks.Task):
    """Deploys RSR codebase to a specified location"""

    name = "deploy_rsr_code"

    def __init__(self, deployment_config, codebase, permissions, paths_helper, execution_feedback):
        self.config = deployment_config
        self.codebase = codebase
        self.permissions = permissions
        self.paths = paths_helper
        self.feedback = execution_feedback

    def run(self):
        self.feedback.comment("Starting RSR codebase deployment")
        self.ensure_required_paths_exist()
        self.codebase.download_and_unpack_rsr_archive()

    def ensure_required_paths_exist(self):
        self.ensure_user_is_member_of_akvo_permissions_group()
        self.feedback.comment("Ensuring expected paths exist")
        self.paths.ensure_path_exists_with_akvo_group_permissions(self.config.repo_checkout_root)
        self.paths.ensure_path_exists(self.config.repo_archives_dir)
        self.paths.ensure_path_exists_with_akvo_group_permissions(self.config.virtualenvs_home)

    def ensure_user_is_member_of_akvo_permissions_group(self):
        self.feedback.comment("Checking group membership for user [%s]" % self.config.user + " (required for setting directory permissions later on)")
        self.permissions.ensure_user_is_member_of_group(self.config.user, self.config.akvo_permissions_group)


def create_task_instance():
    config = DeployerConfig(fabric.api.env.hosts, fabric.api.env.user)
    deployment_host = RemoteHost()
    feedback = ExecutionFeedback()
    permissions = Permissions(config, deployment_host, feedback)
    path = Path(deployment_host, permissions, feedback)
    codebase = Codebase(config, deployment_host, FileSystem(deployment_host, feedback),
                        Internet(deployment_host), permissions, feedback)

    return DeployRSRCode(config, codebase, permissions, path, feedback)


instance = create_task_instance()
