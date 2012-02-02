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
from execution.scenarios.update_host_system_packages import update_host_system_packages

from fab.config.rsr.host import RepositoryBranch
from fab.config.spec import HostConfigSpecification


def confirm_deployment_if_deploying_to_live_server(host_alias):
    if host_alias == 'live':
        confirm_live_deployment = raw_input('>> Confirm deployment to live server? (www.akvo.org) [yes/no] ')
        if confirm_live_deployment.lower() != 'yes':
            sys.exit(1)

def deploy_donation_text_hotfix(scenario_runner, master_config_spec):
    update_host_system_packages(scenario_runner, master_config_spec)
    install_rsr_virtualenv_and_codebase(scenario_runner, master_config_spec)

def fetch_latest_rsr_data(scenario_runner):
    scenario_runner.run_step('fetch_rsr_data')


if __name__ == '__main__':
    host_alias = 'live'
    rsr_database_name = 'rsrdb_201'

    confirm_deployment_if_deploying_to_live_server(host_alias)

    master_config_spec = HostConfigSpecification().create_standard_with(host_alias, RepositoryBranch.MASTER, rsr_database_name)
    scenario_runner = ScenarioRunner()

    deploy_donation_text_hotfix(scenario_runner, master_config_spec)
    fetch_latest_rsr_data(scenario_runner)
