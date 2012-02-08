#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

from execution.scenarios.runner import ScenarioRunner
from execution.scenarios.install_rsr_virtualenv_and_codebase import install_rsr_virtualenv_and_codebase
from execution.scenarios.update_host_system_packages import update_host_system_packages

from fab.config.rsr.host import RepositoryBranch
from fab.config.spec import HostConfigSpecification


def display_usage_and_exit_if_release_parameters_are_missing():
    if len(sys.argv) < 4:
        print '>> Some missing parameters'
        print 'Usage: %s <host_alias> <repository_branch> <rsr_database_name>' % os.path.basename(__file__)
        print '       where the host alias is either: test, test2 or uat\n'
        sys.exit(1)

def exit_if_attempting_deployment_to_live_server(host_alias):
    if host_alias == 'live':
        print '>> Deployment of release candidate to live server (www.akvo.org) is not permitted\n'
        sys.exit(1)

def deploy_last_release(scenario_runner, master_config_spec):
    update_host_system_packages(scenario_runner, master_config_spec)
    install_rsr_virtualenv_and_codebase(scenario_runner, master_config_spec)

def rebuild_database_with_last_applied_migrations(scenario_runner, master_config_spec):
    scenario_runner.run_step('fetch_rsr_data')
    scenario_runner.run_step('rebuild_rsr_database', master_config_spec)

def deploy_release_candidate(scenario_runner, release_config_spec):
    update_host_system_packages(scenario_runner, release_config_spec)
    install_rsr_virtualenv_and_codebase(scenario_runner, release_config_spec)

def run_new_database_migrations(scenario_runner, release_config_spec):
    scenario_runner.run_step('run_new_database_migrations', release_config_spec)

def deploy_rsr_release_candidate(scenario_runner, master_config_spec, release_config_spec):
    deploy_last_release(scenario_runner, master_config_spec)
    rebuild_database_with_last_applied_migrations(scenario_runner, master_config_spec)
    deploy_release_candidate(scenario_runner, release_config_spec)
    run_new_database_migrations(scenario_runner, release_config_spec)


if __name__ == '__main__':
    display_usage_and_exit_if_release_parameters_are_missing()
    host_alias = sys.argv[1]
    repository_branch = sys.argv[2]
    rsr_database_name = sys.argv[3]

    exit_if_attempting_deployment_to_live_server(host_alias)

    master_config_spec = HostConfigSpecification().create_standard_with(host_alias, RepositoryBranch.MASTER, rsr_database_name)
    release_config_spec = HostConfigSpecification().create_standard_with(host_alias, repository_branch, rsr_database_name)
    scenario_runner = ScenarioRunner()

    deploy_rsr_release_candidate(scenario_runner, master_config_spec, release_config_spec)
