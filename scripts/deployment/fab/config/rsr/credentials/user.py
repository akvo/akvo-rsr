# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess


class UserCredentials(object):

    CURRENT_USER        = subprocess.check_output('whoami').strip()
    DEFAULT_SSH_ID_PATH = '~/.ssh/id_rsa'

    def __init__(self, deployment_user, ssh_id_file_path):
        self.deployment_user    = subprocess.check_output('whoami').strip()
        self.ssh_id_file_path   = os.path.expanduser(ssh_id_file_path)

    @staticmethod
    def default():
        return UserCredentials(UserCredentials.CURRENT_USER, UserCredentials.DEFAULT_SSH_ID_PATH)

    def __eq__(self, credentials):
        return (self.deployment_user    == credentials.deployment_user and
                self.ssh_id_file_path   == credentials.ssh_id_file_path)

    def __ne__(self, credentials):
        return not self.__eq__(credentials)
