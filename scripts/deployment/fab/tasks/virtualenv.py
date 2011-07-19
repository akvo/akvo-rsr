# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

import fabric.api
import fabric.tasks

from fab.config.deployer import DeployerConfig
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import RemoteHost
from fab.helpers.virtualenv import VirtualEnv


class RebuildRSRVirtualEnv(fabric.tasks.Task):
    """Rebuilds an RSR virtualenv with the specified pip requirements"""

    name = "rebuild_rsr_virtualenv"

    RSR_REQUIREMENTS_FILE = "2_rsr.txt"

    def __init__(self, deployer_config, virtualenv):
        self.config = deployer_config
        self.virtualenv = virtualenv

    def run(self):
        install_log_file = self.config.pip_install_log_file
        self.virtualenv.create_empty_virtualenv(install_log_file)
        rsr_requirements_path = os.path.join(self.config.pip_requirements_home, RebuildRSRVirtualEnv.RSR_REQUIREMENTS_FILE)
        self.virtualenv.install_packages(rsr_requirements_path, install_log_file)


config = DeployerConfig(fabric.api.env.hosts)
feedback = ExecutionFeedback()
remote_host = RemoteHost()
virtualenv = VirtualEnv(config.rsr_env_path, feedback, remote_host, FileSystem(remote_host, feedback))

instance = RebuildRSRVirtualEnv(config, virtualenv)
