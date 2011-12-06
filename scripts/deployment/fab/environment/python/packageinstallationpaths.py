# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.values import DeploymentHostConfigValues


class SystemPackageInstallationPaths(object):

    PIP_VERSION = "1.0.2"

    def __init__(self, deployment_host_config_values):
        self.package_download_dir   = os.path.join(deployment_host_config_values.deployment_processing_home, 'python_packages')
        self.distribute_setup_url   = "http://python-distribute.org/distribute_setup.py"
        self.pip_setup_url          = os.path.join("https://raw.github.com/pypa/pip", self.PIP_VERSION, "contrib/get-pip.py")

    @staticmethod
    def create_instance():
        return SystemPackageInstallationPaths(DeploymentHostConfigValues())
