#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys


FABRIC_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'fab'))


def display_usage_and_exit():
    print "Usage: fetch_live_data <database_host> <username> <password>"
    print "Specify a database host (e.g. database_host1:port1) and your username and password for the host"
    sys.exit(1)

if len(sys.argv) > 4:
    print ">> Unexpected list of parameters: %s" % (sys.argv[1:])
    display_usage_and_exit()
elif len(sys.argv) >= 1 and len(sys.argv) < 4:
    print ">> Required parameters: <database_host> <username> <password>"
    display_usage_and_exit()
elif len(sys.argv) == 4:
    DATABASE_HOST = sys.argv[1]
    USERNAME = sys.argv[2]
    PASSWORD = sys.argv[3]

def run_fab_task(fully_qualified_task):
    subprocess.call(["fab", "-f", "fabfile.py", fully_qualified_task,
                     "-H", DATABASE_HOST, "-u", USERNAME, "-p", PASSWORD])

def fetch_rsr_data():
    run_fab_task("fab.tasks.dataretriever.fetch_rsr_data")


if __name__ == "__main__":
    os.chdir(FABRIC_SCRIPTS_HOME)
    fetch_rsr_data()
