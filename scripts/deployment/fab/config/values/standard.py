# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import subprocess

from fab.config.values.host import DeploymentHostPaths, HostAlias, SSHConnection


class UserCredentials(object):

    CURRENT_USER        = subprocess.check_output('whoami').strip()
    DEFAULT_SSH_ID_PATH = '~/.ssh/id_rsa'

    def __init__(self, deployment_user, ssh_id_file_path):
        self.deployment_user    = subprocess.check_output('whoami').strip()
        self.ssh_id_file_path   = ssh_id_file_path

    @staticmethod
    def default():
        return UserCredentials(UserCredentials.CURRENT_USER, UserCredentials.DEFAULT_SSH_ID_PATH)

    def __eq__(self, credentials):
        return (self.deployment_user    == credentials.deployment_user and
                self.ssh_id_file_path   == credentials.ssh_id_file_path)

    def __ne__(self, credentials):
        return not self.__eq__(credentials)


class RepositoryBranch(object):

    MASTER  = 'master'
    DEVELOP = 'develop'


class DeploymentConfig(object):

    def __init__(self, repository_branch, rsr_database_name, ssh_connection, deployment_host_paths):
        self.repository_branch  = repository_branch
        self.rsr_database_name  = rsr_database_name
        self.ssh_connection     = ssh_connection
        self.host_paths         = deployment_host_paths

    def __eq__(self, deployment_config):
        return (self.repository_branch  == deployment_config.repository_branch and
                self.rsr_database_name  == deployment_config.rsr_database_name and
                self.ssh_connection     == deployment_config.ssh_connection and
                self.host_paths         == deployment_config.host_paths)

    def __ne__(self, deployment_config):
        return not self.__eq__(deployment_config)


class CIDeploymentConfig(DeploymentConfig):
    """Continuous integration deployment configurations"""

    @staticmethod
    def for_host(host_alias, repository_branch, rsr_database_name):
        return CIDeploymentConfig(repository_branch, rsr_database_name, SSHConnection.for_host(host_alias), DeploymentHostPaths.for_host(host_alias))

    @staticmethod
    def for_test():
        return CIDeploymentConfig.for_host(HostAlias.TEST, RepositoryBranch.DEVELOP, 'rsrdb_develop')

    @staticmethod
    def for_test2():
        return CIDeploymentConfig.for_host(HostAlias.TEST2, RepositoryBranch.DEVELOP, 'test2_rsrdb_develop')

    @staticmethod
    def for_uat(release_branch, rsr_database_name):
        return CIDeploymentConfig.for_host(HostAlias.UAT, release_branch, rsr_database_name)

    @staticmethod
    def for_live(rsr_database_name):
        return CIDeploymentConfig.for_host(HostAlias.LIVE, RepositoryBranch.MASTER, rsr_database_name)
