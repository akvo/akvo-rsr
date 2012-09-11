# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os


class SystemPackageInstallationPaths(object):

    PIP_VERSION = "1.2.1"

    def __init__(self, deployment_host_paths):
        self.package_download_dir   = os.path.join(deployment_host_paths.deployment_processing_home, 'python_packages')
        self.distribute_setup_url   = "http://python-distribute.org/distribute_setup.py"
        self.pip_setup_url          = os.path.join("https://raw.github.com/pypa/pip", self.PIP_VERSION, "contrib/get-pip.py")
