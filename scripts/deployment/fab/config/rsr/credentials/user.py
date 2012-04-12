# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess


class User(object):

    CURRENT     = subprocess.check_output('whoami').strip()
    DEPLOYER    = 'deployer'


class SudoPassword(object):

    NONE = ''


class SSHIDPath(object):

    DEFAULT     = '~/.ssh/id_rsa'
    DEPLOYER    = '~/.ssh/deployer'


class UserCredentials(object):

    def __init__(self, deployment_user, sudo_password, ssh_id_file_path):
        self.deployment_user    = deployment_user
        self.sudo_password      = sudo_password
        self.ssh_id_file_path   = os.path.expanduser(ssh_id_file_path)

        self._exit_if_ssh_id_not_found()

    @staticmethod
    def default():
        return UserCredentials(User.CURRENT, SudoPassword.NONE, SSHIDPath.DEFAULT)

    @staticmethod
    def for_deployer_with_ssh_id(ssh_id_for_deployment=SSHIDPath.DEPLOYER):
        return UserCredentials(User.DEPLOYER, SudoPassword.NONE, ssh_id_for_deployment)

    def _exit_if_ssh_id_not_found(self):
        if not os.path.exists(self.ssh_id_file_path):
            raise SystemExit('\n## SSH key not found: %s\n' % self.ssh_id_file_path)

    def __eq__(self, credentials):
        return (self.deployment_user    == credentials.deployment_user and
                self.sudo_password      == credentials.sudo_password and
                self.ssh_id_file_path   == credentials.ssh_id_file_path)

    def __ne__(self, credentials):
        return not self.__eq__(credentials)
