#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys


def exit_if_config_file_is_missing(config_file_path):
    if not os.path.exists(config_file_path):
        config_file_name = config_file_path.split('/')[-1]
        print ">> Configuration file missing: %s" % config_file_path
        print ">> Copy the %s.template file and edit as necessary" % config_file_name
        sys.exit(1)
    else:
        print ">> Found expected configuration file: %s" % config_file_path

exit_if_config_file_is_missing("update_ci_server_config.py")
exit_if_config_file_is_missing("fab/config/values.py")
print "\r"


from update_ci_server_config import CI_SERVER, CI_SERVER_USERNAME, CI_SERVER_PASSWORD


FABRIC_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), 'fab'))


def ci_server_contains(expected_host):
    return CI_SERVER.lower().find(expected_host.lower()) != -1

def attempting_to_update_live_server():
    return ci_server_contains("www.akvo.org") or (ci_server_contains("akvo.org") and not ci_server_contains(".akvo.org"))

def verify_configuration():
    if attempting_to_update_live_server():
        print ">> Invalid continuous integration server: %s" % CI_SERVER
        sys.exit(1)

def run_fab_task(fully_qualified_task, host, username, password):
    exit_code = subprocess.call(["fab", "-f", "fabfile.py", fully_qualified_task, "-H", host, "-u", username, "-p", password])

    if exit_code > 0:
        print "\n>> CI server rebuild failed due to errors above.\n"
        sys.exit(1)

def run_deployment_task(fully_qualified_task):
    run_fab_task(fully_qualified_task, CI_SERVER, CI_SERVER_USERNAME, CI_SERVER_PASSWORD)

def rebuild_ci_server():
    print ">> Rebuilding continuous integration server: %s" % CI_SERVER
    os.chdir(FABRIC_SCRIPTS_HOME)
    run_deployment_task("fab.tasks.environment.linux.systempackages.verify_system_packages")
    run_deployment_task("fab.tasks.environment.python.systempackages.update_system_python_packages")
    run_deployment_task("fab.tasks.app.deployment.deploy_rsr_app:host_controller_mode=remote")
    run_deployment_task("fab.tasks.environment.python.virtualenv.rsr.rebuild_rsr_env:host_controller_mode=remote")


if __name__ == "__main__":
    verify_configuration()
    rebuild_ci_server()
