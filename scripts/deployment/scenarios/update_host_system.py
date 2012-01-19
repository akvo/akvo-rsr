#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

from scenarios.runner import ScenarioRunner


def update_host_system(scenario_runner):
    scenario_runner.run_step('verify_system_packages')
    scenario_runner.run_step('update_system_python_packages')


if __name__ == '__main__':
    update_host_system(ScenarioRunner())
