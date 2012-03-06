#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

VERIFIERS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../verifiers'))
imp.load_source("syspath_verification", os.path.join(VERIFIERS_HOME, 'ensure_syspath_contains_deployment_scripts_home.py'))

import execution.scenarios.runner

from execution.scenarios.rebuild_rsr_database_and_run_new_migrations import rebuild_rsr_database_and_run_new_migrations
from execution.scenarios.update_host_system_and_deploy_rsr import update_host_system_and_deploy_rsr

from fab.config.rsr.host import RepositoryBranch
from fab.config.spec import HostConfigSpecification


def display_usage_and_exit_if_release_number_parameter_is_missing():
    if len(sys.argv) < 2:
        print 'Usage: %s <release_number>' % os.path.basename(__file__)
        print '       where the release number is of the form 2.0.3\n'
        sys.exit(1)

def confirm_deployment_to_live_server(host_alias):
    if host_alias == 'live':
        confirm_live_deployment = raw_input('>> Confirm deployment to live server? (www.akvo.org) [yes/no] ')
        if confirm_live_deployment.lower() != 'yes':
            sys.exit(1)

def deploy_rsr_release(scenario_runner, release_config_spec):
    update_host_system_and_deploy_rsr(scenario_runner, release_config_spec)
    rebuild_rsr_database_and_run_new_migrations(scenario_runner, release_config_spec)


if __name__ == '__main__':
    display_usage_and_exit_if_release_number_parameter_is_missing()

    release_number = sys.argv[1]

    host_alias = 'live'
    release_branch = 'release/%s' % release_number
    rsr_database_name = 'rsrdb_%s' % release_number.replace('.', '')

    confirm_deployment_to_live_server(host_alias)

    release_config_spec = HostConfigSpecification().create_standard_with(host_alias, release_branch, rsr_database_name)

    deploy_rsr_release(execution.scenarios.runner.ScenarioRunner(), release_config_spec)
