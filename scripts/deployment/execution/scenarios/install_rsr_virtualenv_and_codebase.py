#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

import execution.scenarios.runner
import execution.verification


def install_rsr_virtualenv_and_codebase(scenario_runner, host_config_specification):
    scenario_runner.run_step('rebuild_rsr_virtualenv', host_config_specification)
    scenario_runner.run_step('install_rsr_codebase', host_config_specification)


if __name__ == '__main__':
    execution.verification.display_usage_and_exit_if_host_config_spec_is_missing(os.path.basename(__file__))
    host_config_specification = sys.argv[1]

    install_rsr_virtualenv_and_codebase(execution.scenarios.runner.ScenarioRunner(), host_config_specification)
