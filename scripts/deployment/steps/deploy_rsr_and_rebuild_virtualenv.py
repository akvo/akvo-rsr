#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys


FABRIC_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'fab'))


def display_usage_and_exit():
    print "Usage: deploy_rsr_and_rebuild_virtualenv <deployment_hosts> <host_username> <host_password>"
    print "Specify a comma-separated list of deployment hosts (e.g. host1:port1,host2:port2) and a username and password for the hosts"
    sys.exit(1)

if len(sys.argv) > 4:
    print ">> Unexpected list of parameters: %s" % (sys.argv[1:])
    display_usage_and_exit()
elif len(sys.argv) >= 1 and len(sys.argv) < 4:
    print ">> Required parameters: <deployment_hosts> <host_username> <host_password>"
    display_usage_and_exit()
elif len(sys.argv) == 4:
    DEPLOYMENT_HOSTS = sys.argv[1]
    USERNAME = sys.argv[2]
    PASSWORD = sys.argv[3]

def run_fab_task(fully_qualified_task):
    subprocess.call(["fab", "-f", "fabfile.py", fully_qualified_task,
                     "-H", DEPLOYMENT_HOSTS, "-u", USERNAME, "-p", PASSWORD])

def deploy_rsr():
    run_fab_task("fab.tasks.codedeployment.deploy_rsr_code")
    run_fab_task("fab.tasks.virtualenv.rebuild_rsr_virtualenv")

if __name__ == "__main__":
    os.chdir(FABRIC_SCRIPTS_HOME)
    deploy_rsr()
