#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

from fab.tasks.database.migrate import RunDatabaseMigrations
from fab.tasks.runner import TaskRunner

import steps.shared


if __name__ == '__main__':
    steps.shared.display_usage_and_exit_if_parameters_are_missing(os.path.basename(__file__))
    TaskRunner.create().run_remote_deployment_task(RunDatabaseMigrations, sys.argv[1])
