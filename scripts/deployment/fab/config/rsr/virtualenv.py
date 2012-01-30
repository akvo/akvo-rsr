# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig


class RSRVirtualEnvInstallerConfig(object):

    def __init__(self, deployment_host_paths, codebase_config, deployment_user):
        self.deployment_user = deployment_user

        self.virtualenvs_home   = deployment_host_paths.virtualenvs_home
        self.rsr_env_name       = "rsr_%s" % codebase_config.repo_branch_without_type
        self.rsr_env_path       = os.path.join(self.virtualenvs_home, self.rsr_env_name)

        self.rsr_requirements_url       = codebase_config.rsr_requirements_file_url
        self.testing_requirements_url   = codebase_config.testing_requirements_file_url

    @staticmethod
    def create_with(deployment_host_config, deployment_user):
        return RSRVirtualEnvInstallerConfig(deployment_host_config.host_paths,
                                            RSRCodebaseConfig(deployment_host_config.repository_branch),
                                            deployment_user)
