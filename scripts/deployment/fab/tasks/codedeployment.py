# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.deployer
import fab.helpers.codebase
import fab.helpers.hosts


class DeployRSRCode(fabric.tasks.Task):
    """Deploys RSR codebase to a specified location"""

    name = "deploy_rsr_code"

    def __init__(self, deployment_config, deployment_host, codebase):
        self.config = deployment_config
        self.deployment_host = deployment_host
        self.codebase = codebase
        self.feedback = deployment_host.feedback

    def run(self):
        self.feedback.comment("Starting RSR codebase deployment")
        self.ensure_required_paths_exist()
        self.codebase.download_and_unpack_rsr_archive()

    def ensure_required_paths_exist(self):
        self.deployment_host.exit_if_user_is_not_member_of_web_group(self.config.user)
        self.deployment_host.ensure_directory_exists_with_web_group_permissions(self.config.repo_checkout_root)
        self.deployment_host.ensure_directory_exists(self.config.repo_archives_dir)
        self.deployment_host.ensure_directory_exists_with_web_group_permissions(self.config.virtualenvs_home)


def create_task_instance():
    deployer_config = fab.config.deployer.DeployerConfig(fabric.api.env.hosts, fabric.api.env.user)
    deployment_host = fab.helpers.hosts.DeploymentHost.create_instance(deployer_config.rsr_env_path)
    codebase = fab.helpers.codebase.Codebase(deployer_config, deployment_host)

    return DeployRSRCode(deployer_config, deployment_host, codebase)


instance = create_task_instance()
