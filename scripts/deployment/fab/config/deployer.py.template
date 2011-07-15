# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os


class DeployerConfig(object):

    def __init__(self, deployment_hosts):
        # comma-separated list of hosts for deployment
        self.deployment_hosts = deployment_hosts

        # code repository settings
        self.rsr_branch                 = "develop" # or "v1.0.6", "master", etc.
        self.RSR_ARCHIVE_URL_ROOT       = "http://nodeload.github.com/akvo/akvo-rsr/zipball"
        self.rsr_archive_url            = os.path.join(self.RSR_ARCHIVE_URL_ROOT, self.rsr_branch)

        # code deployment settings
        self.repo_checkout_root         = "/var/git"
        self.repo_archives_dir          = os.path.join(self.repo_checkout_root, "archives")

        self.UNPACKED_RSR_ARCHIVE_MASK  = "akvo-akvo-rsr-*"
        self.unpacked_rsr_archive_match = os.path.join(self.repo_checkout_root, self.UNPACKED_RSR_ARCHIVE_MASK)

        self.rsr_deployment_dir_name    = "akvo-rsr_%s" % self.rsr_branch
        self.rsr_deployment_root        = os.path.join(self.repo_checkout_root, self.rsr_deployment_dir_name)

        self.akvo_permissions_group     = "www-edit"

        # virtualenv settings
        self.virtualenvs_home           = "/var/virtualenvs"
        self.rsr_env_name               = "rsr_%s" % self.rsr_branch
        self.rsr_env_path               = os.path.join(self.virtualenvs_home, self.rsr_env_name)

        self.PIP_REQUIREMENTS_DIR       = "scripts/deployment/pip/requirements"
        self.pip_install_log_file       = os.path.join(self.virtualenvs_home, "pip_install_%s.log" % self.rsr_env_name)
        self.pip_requirements_home      = os.path.join(self.rsr_deployment_root, self.PIP_REQUIREMENTS_DIR)
