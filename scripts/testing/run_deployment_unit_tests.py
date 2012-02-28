#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, shutil, subprocess, sys


DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../deployment'))


class TestExecutionMode(object):

    CI  = 'ci'
    DEV = 'dev'


class DeploymentTestsRunner(object):

    def __init__(self, execution_mode, virtualenv_path):
        self.execution_mode = execution_mode
        self.virtualenv_path = virtualenv_path

    def run_unit_tests(self):
        print '>> Using virtualenv at: %s\n' % self.virtualenv_path
        self._ensure_config_file_exists('custom.py')
        self._ensure_config_file_exists('database.py')
        self._run_within_virtualenv(os.path.join(DEPLOYMENT_SCRIPTS_HOME, 'fab/tests/all_test_suites.py'))

    def _ensure_config_file_exists(self, config_file_name):
        if not os.path.exists(self._credentials_path_for(config_file_name)):
            if self.execution_mode == TestExecutionMode.CI:
                shutil.copy2(self._credentials_path_for('%s.template' % config_file_name), self._credentials_path_for(config_file_name))
            else:
                raise SystemExit('## Missing credentials configuration file\n' + \
                                 '>> Copy the %s file and edit as necessary' % self._credentials_path_for('%s.template' % config_file_name))

    def _credentials_path_for(self, credentials_file_name):
        return os.path.join(DEPLOYMENT_SCRIPTS_HOME, 'fab/config/rsr/credentials', credentials_file_name)

    def _run_within_virtualenv(self, command):
        exit_code = subprocess.call('source %s/bin/activate && %s' % (self.virtualenv_path, command), shell=True, executable='/bin/bash')

        if exit_code != 0:
            raise SystemExit('Deployment unit tests failed as above')


def verify_execution_parameters():
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        raise SystemExit("Usage: run_deployment_unit_tests <virtualenv_path> [execution_mode]\n" + \
                         "       where execution_mode is either 'dev' (default) or 'ci'\n")

    virtualenv_path = sys.argv[1]

    if not os.path.exists(virtualenv_path):
        raise SystemExit('## Invalid virtualenv path: %s\n' % virtualenv_path)

    if len(sys.argv) == 3:
        execution_mode = sys.argv[2]

        if execution_mode != TestExecutionMode.CI and execution_mode != TestExecutionMode.DEV:
            raise SystemExit('## Unrecognised test execution mode: %s\n' % execution_mode)


if __name__ == '__main__':
    verify_execution_parameters()

    virtualenv_path = sys.argv[1]
    execution_mode = TestExecutionMode.CI

    if len(sys.argv) < 3:
        execution_mode = TestExecutionMode.DEV

    DeploymentTestsRunner(execution_mode, virtualenv_path).run_unit_tests()
