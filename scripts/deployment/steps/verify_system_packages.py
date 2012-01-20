#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

from fab.tasks.environment.linux.systempackages import VerifySystemPackages
from fab.tasks.runner import TaskRunner


def verify_system_packages():
    TaskRunner.create().run_deployment_task(VerifySystemPackages)


if __name__ == '__main__':
    verify_system_packages()
