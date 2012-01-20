# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.values.host import DeploymentHostPaths, HostAlias, SSHConnection


class RepositoryBranch(object):

    MASTER  = 'master'
    DEVELOP = 'develop'


class DeploymentHostConfig(object):

    def __init__(self, repository_branch, rsr_database_name, ssh_connection, deployment_host_paths):
        self.repository_branch  = repository_branch
        self.rsr_database_name  = rsr_database_name
        self.ssh_connection     = ssh_connection
        self.host_paths         = deployment_host_paths

    @staticmethod
    def create_with(host_alias, repository_branch, rsr_database_name):
        return DeploymentHostConfig(repository_branch,
                                    rsr_database_name,
                                    SSHConnection.for_host(host_alias),
                                    DeploymentHostPaths.for_host(host_alias))

    def __eq__(self, deployment_host_config):
        return (self.repository_branch  == deployment_host_config.repository_branch and
                self.rsr_database_name  == deployment_host_config.rsr_database_name and
                self.ssh_connection     == deployment_host_config.ssh_connection and
                self.host_paths         == deployment_host_config.host_paths)

    def __ne__(self, deployment_host_config):
        return not self.__eq__(deployment_host_config)

    def __repr__(self):
        return repr([self.repository_branch, self.rsr_database_name, self.ssh_connection, repr(self.host_paths)])


class CIDeploymentHostConfig(object):
    """Deployment host configurations for continuous integration"""

    @staticmethod
    def for_test():
        return DeploymentHostConfig.create_with(HostAlias.TEST, RepositoryBranch.DEVELOP, 'rsrdb_develop')

    @staticmethod
    def for_test2():
        return DeploymentHostConfig.create_with(HostAlias.TEST2, RepositoryBranch.DEVELOP, 'test2_rsrdb_develop')

    @staticmethod
    def for_uat(release_branch, rsr_database_name):
        return DeploymentHostConfig.create_with(HostAlias.UAT, release_branch, rsr_database_name)

    @staticmethod
    def for_live(rsr_database_name):
        return DeploymentHostConfig.create_with(HostAlias.LIVE, RepositoryBranch.MASTER, rsr_database_name)
