# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig


class RSRDataRetrieverConfig(object):

    def __init__(self, data_host_paths):
        self.rsr_app_name       = RSRCodebaseConfig.RSR_APP_NAME
        self.data_archives_home = os.path.join(data_host_paths.deployment_processing_home, 'data_archives')
        self.rsr_env_path       = os.path.join(data_host_paths.virtualenvs_home, 'current')
        self.rsr_app_path       = os.path.join(data_host_paths.django_apps_home, 'current')
        self.rsr_log_file_path  = os.path.join(data_host_paths.logging_home, 'akvo.log')
