#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

import execution.verification

from execution.scenarios.runner import ScenarioRunner
from execution.scenarios.install_rsr_virtualenv_and_codebase import install_rsr_virtualenv_and_codebase
from execution.scenarios.prepare_database_for_migrations import prepare_database_for_migrations
from execution.scenarios.update_host_system_packages import update_host_system_packages

from fab.config.rsr.host import RepositoryBranch
from fab.config.spec import HostConfigSpecification


def confirm_deployment_if_deploying_to_live_server(host_alias):
    if host_alias == 'live':
        confirm_live_deployment = raw_input('>> Confirm deployment to live server? (www.akvo.org) [yes/no] ')
        if confirm_live_deployment.lower() != 'yes':
            sys.exit(1)

def deploy_rsr(scenario_runner, release_config_spec, master_config_spec):
    update_host_system_packages(scenario_runner, release_config_spec)
    install_rsr_virtualenv_and_codebase(scenario_runner, master_config_spec)
    prepare_database_for_migrations(scenario_runner, master_config_spec)
    install_rsr_virtualenv_and_codebase(scenario_runner, release_config_spec)
    scenario_runner.run_step('convert_rsr_database_for_migrations', release_config_spec)
    scenario_runner.run_step('run_all_database_migrations', release_config_spec)


if __name__ == '__main__':
    execution.verification.display_usage_and_exit_if_release_parameters_are_missing(os.path.basename(__file__))
    host_alias = sys.argv[1]
    rsr_database_name = sys.argv[2]

    confirm_deployment_if_deploying_to_live_server(host_alias)

    release_config_spec = HostConfigSpecification().create_standard_with(host_alias, 'release/2.0.2', rsr_database_name)
    master_config_spec = HostConfigSpecification().create_standard_with(host_alias, RepositoryBranch.MASTER, rsr_database_name)

    scenario_runner = ScenarioRunner()
    deploy_rsr(ScenarioRunner(), release_config_spec, master_config_spec)
