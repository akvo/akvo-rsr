#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, subprocess, sys

DEPLOYMENT_SCRIPTS_PATH = os.path.realpath(os.path.dirname(__file__))


def display_usage_and_exit():
    print "Usage: deploy_rsr <deployment_hosts> <host_username> <host_password>"
    print "Specify a comma-separated list of deployment hosts and a username and password for the hosts"
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

def deploy_rsr(hosts, username, password):
    subprocess.call(["fab","-f", "integration_fabfile.py", "-H", hosts, "-u", username, "-p", password, "deploy_rsr"])


if __name__ == "__main__":
    os.chdir(DEPLOYMENT_SCRIPTS_PATH)
    deploy_rsr(DEPLOYMENT_HOSTS, USERNAME, PASSWORD)
