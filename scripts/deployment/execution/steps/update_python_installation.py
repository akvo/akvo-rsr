#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

from fab.tasks.environment.python.installer import InstallPython
from fab.tasks.runner import TaskRunner

import execution.verification


SCRIPT_NAME = os.path.basename(__file__)


def exit_if_python_version_missing():
    if len(sys.argv) < 3:
        print '## Missing parameter: python_version'
        execution.verification.display_deployment_script_usage_and_exit(SCRIPT_NAME, '<python_version>')


if __name__ == '__main__':
    execution.verification.display_usage_and_exit_if_host_config_spec_is_missing(SCRIPT_NAME, '<python_version>')
    exit_if_python_version_missing()

    TaskRunner.create().run_deployment_task(InstallPython, sys.argv[1], ['python_version=%s' % sys.argv[2]])
