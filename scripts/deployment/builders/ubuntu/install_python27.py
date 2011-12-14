#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

INSTALLATION_SCRIPT_HOME = os.path.realpath(os.path.dirname(__file__))
DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(INSTALLATION_SCRIPT_HOME, '../..'))

imp.load_source("syspath_verification", os.path.join(DEPLOYMENT_SCRIPTS_HOME, 'verifiers/ensure_syspath_contains_deployment_scripts_home.py'))

from verifiers.configuration import ConfigVerifier

ConfigVerifier.exit_if_config_files_are_missing([os.path.join(INSTALLATION_SCRIPT_HOME, "install_python27_config.py"),
                                                 os.path.join(DEPLOYMENT_SCRIPTS_HOME, "fab/config/values.py")])
print "\r"


import subprocess, sys

from install_python27_config import INSTALLATION_HOST, INSTALLATION_HOST_USERNAME, INSTALLATION_HOST_PASSWORD

FABFILE_PATH = os.path.realpath(os.path.join(DEPLOYMENT_SCRIPTS_HOME, 'fab/fabfile.py'))


def run_fab_task(fully_qualified_task, host, username, password):
    exit_code = subprocess.call(["fab", "-f", FABFILE_PATH, fully_qualified_task, "-H", host, "-u", username, "-p", password])

    if exit_code > 0:
        print "\n>> Installation failed due to errors above.\n"
        sys.exit(1)

def run_deployment_task(fully_qualified_task):
    run_fab_task(fully_qualified_task, INSTALLATION_HOST, INSTALLATION_HOST_USERNAME, INSTALLATION_HOST_PASSWORD)

def install_python27():
    print ">> Installing Python 2.7 on: %s" % INSTALLATION_HOST
    run_deployment_task("fab.tasks.environment.linux.systempackages.verify_system_packages")
    run_deployment_task("fab.tasks.environment.python.installer.install_python:python_version=2.7.2")


if __name__ == "__main__":
    install_python27()
