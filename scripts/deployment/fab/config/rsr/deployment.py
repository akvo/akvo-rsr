# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig


class RSRDeploymentConfig(object):

    DJANGO_LIB_PATH = "lib/python2.5/site-packages/django"

    def __init__(self, deployment_host_paths, deployment_user, codebase_config):
        self.deployment_user = deployment_user

        self.repo_checkout_home = deployment_host_paths.repo_checkout_home
        self.repo_archives_dir  = os.path.join(self.repo_checkout_home, "archives")

        self.rsr_archive_url            = codebase_config.rsr_archive_url
        self.unpacked_archive_dir_mask  = RSRCodebaseConfig.UNPACKED_RSR_ARCHIVE_DIR_MASK

        self.rsr_deployment_dir_name    = "rsr_%s" % codebase_config.repo_branch_without_type
        self.rsr_deployment_home        = os.path.join(self.repo_checkout_home, self.rsr_deployment_dir_name)
        self.rsr_settings_home          = os.path.join(self.rsr_deployment_home, RSRCodebaseConfig.RSR_SETTINGS_HOME)
        self.rsr_media_root             = os.path.join(self.rsr_deployment_home, RSRCodebaseConfig.RSR_MEDIA_ROOT)
        self.current_rsr_media_root     = os.path.join(self.repo_checkout_home, "current", RSRCodebaseConfig.RSR_MEDIA_ROOT)

        self.current_virtualenv_path    = os.path.join(deployment_host_paths.virtualenvs_home, "current")
        self.django_media_admin_path    = os.path.join(self.current_virtualenv_path, self.DJANGO_LIB_PATH, "contrib/admin/media")
        self.rsr_static_media_home      = os.path.join(deployment_host_paths.static_media_home, "akvo")
        self.static_media_db_path       = os.path.join(self.rsr_static_media_home, "db")

        self.host_config_home               = deployment_host_paths.config_home
        self.local_rsr_settings_file_name   = RSRCodebaseConfig.LOCAL_SETTINGS_FILE
        self.deployed_rsr_settings_file     = os.path.join(self.host_config_home, self.local_rsr_settings_file_name)
        self.mod_python_file_name           = RSRCodebaseConfig.MOD_PYTHON_FILE
        self.deployed_mod_python_file       = os.path.join(self.host_config_home, self.mod_python_file_name)

    @staticmethod
    def create_instance(deployment_host_config, deployment_user=None):
        return RSRDeploymentConfig(deployment_host_config.host_paths, deployment_user, 
                                   RSRCodebaseConfig(deployment_host_config.repository_branch))
