# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os


class PackageInstallationToolsConfig(object):

    # See the installation notes at http://www.pip-installer.org/en/latest/installing.html

    def __init__(self, pip_version):
        self.distribute_setup_url = "http://python-distribute.org/distribute_setup.py"
        self.pip_setup_url = os.path.join("https://raw.github.com/pypa/pip", pip_version, "contrib/get-pip.py")
