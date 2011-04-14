# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fabric.api import env, run

from helpers.file_helpers import delete_directory_with_sudo, delete_file_with_sudo


def rebuild_virtualenv(pip_requirements_file, pip_install_log_file):
    _clean_virtualenv_directory()
    print "\n>> Rebuilding virtualenv at %s" % env.virtualenv_path
    run("virtualenv --no-site-packages %s" % env.virtualenv_path)
    with_virtualenv("pip install -q -M -U -E %s -r %s --log=%s" % (env.virtualenv_path, pip_requirements_file, pip_install_log_file))
    run("pip -E %s freeze" % env.virtualenv_path)

def _clean_virtualenv_directory():
    delete_directory_with_sudo(env.virtualenv_path, "\n>> Deleting previous virtualenv directory")
    delete_file_with_sudo(env.pip_install_log_file, ">> Deleting previous pip install log file")

def with_virtualenv(command):
    run("source %s/bin/activate && %s" % (env.virtualenv_path, command))
