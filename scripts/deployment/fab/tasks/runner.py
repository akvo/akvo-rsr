# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys


class TaskParameters(object):

    REMOTE_HOST_CONTROLLER_MODE = ':host_controller_mode=remote'
    NONE = ''


class TaskRunner(object):

    FABFILE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../fabfile.py'))

    def __init__(self, host_with_ssh_port, ssh_id_file_path):
        self.host_with_ssh_port = host_with_ssh_port
        self.ssh_id_file_path = ssh_id_file_path

    def run_remote_task(self, fully_qualified_task):
        self.run_task(fully_qualified_task, TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

    def run_task(self, fully_qualified_task_name, parameters=TaskParameters.NONE):
        exit_code = self._execute(['fab', '-f', self.FABFILE_PATH,
                                   fully_qualified_task_name + parameters,
                                   '-H', self.host_with_ssh_port,
                                   '-i', self.ssh_id_file_path])

        if exit_code != 0:
            raise SystemExit('\n>> Deployment failed due to errors above.\n')

    def _execute(self, command_with_parameters):
        return subprocess.call(command_with_parameters)
