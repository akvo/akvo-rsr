#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys


if not os.path.exists("deploy_rsr_config.py"):
    print ">> Expected configuration file deploy_rsr_config.py not found"
    print ">> Copy the deploy_rsr_config.py.template file and edit as necessary"
    sys.exit(1)


from deploy_rsr_config import LIVE_DATABASE_HOST, DEPLOYMENT_HOST, USERNAME, PASSWORD


FABRIC_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), 'fab'))


def deployment_host_contains(expected_host):
    return DEPLOYMENT_HOST.lower().find(expected_host.lower()) != -1

def attempting_to_deploy_to_live_server():
    return deployment_host_contains("www.akvo.org") or (deployment_host_contains("akvo.org") and not deployment_host_contains(".akvo.org"))

def verify_configuration():
    if LIVE_DATABASE_HOST == DEPLOYMENT_HOST:
        print ">> Cannot deploy to the same host as the database host: %s" % DEPLOYMENT_HOST
        sys.exit(1)
    elif attempting_to_deploy_to_live_server():
        print ">> Deployment to live server not yet supported: %s" % DEPLOYMENT_HOST
        sys.exit(1)
    else:
        print ">> Fetching data from: %s" % LIVE_DATABASE_HOST
        print ">> Deploying RSR to:   %s\n" % DEPLOYMENT_HOST

def run_fab_task(fully_qualified_task, host):
    exit_code = subprocess.call(["fab", "-f", "fabfile.py", fully_qualified_task, "-H", host, "-u", USERNAME, "-p", PASSWORD])

    if exit_code > 0:
        print "\n>> Deployment failed due to errors above.\n"
        sys.exit(1)

def deploy_rsr():
    os.chdir(FABRIC_SCRIPTS_HOME)
    run_fab_task("fab.tasks.dataretriever.fetch_rsr_data", LIVE_DATABASE_HOST)
    run_fab_task("fab.tasks.verify.linux.systempackages.verify_system_packages", DEPLOYMENT_HOST)
    run_fab_task("fab.tasks.environment.python.systempackages.update_system_python_packages", DEPLOYMENT_HOST)
    run_fab_task("fab.tasks.codedeployment.deploy_rsr_code:host_controller_mode=remote", DEPLOYMENT_HOST)
    run_fab_task("fab.tasks.virtualenv.rebuild.rsrenv.rebuild_rsr_virtualenv:host_controller_mode=remote", DEPLOYMENT_HOST)


if __name__ == "__main__":
    verify_configuration()
    deploy_rsr()
