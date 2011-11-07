# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.values import DataHostConfigValues
from fab.format.timestamp import TimeStampFormatter


class RSRDataRetrieverConfig(object):

    def __init__(self, data_host_config_values, time_stamp_formatter):
        self.time_stamp_formatter = time_stamp_formatter

        self.virtualenvs_home   = data_host_config_values.virtualenvs_home
        self.data_dumps_home    = data_host_config_values.data_dumps_home

        self.rsr_env_name   = "rsr_%s" % data_host_config_values.deployed_rsr_version
        self.rsr_env_path   = os.path.join(self.virtualenvs_home, self.rsr_env_name)
        self.rsr_app_path   = os.path.join(data_host_config_values.django_apps_home, data_host_config_values.deployed_rsr_dir_name, 'akvo')

        self.db_dump_script_path    = os.path.join(self.rsr_app_path, 'db_dump.py')
        self.rsr_log_file_path      = os.path.join(data_host_config_values.rsr_logs_home, 'akvo.log')

    @staticmethod
    def create_instance():
        return RSRDataRetrieverConfig(DataHostConfigValues(), TimeStampFormatter())

    def time_stamped_rsr_data_dump_path(self):
        rsr_data_dir_name = self.time_stamp_formatter.append_timestamp(self.rsr_env_name)
        return os.path.join(self.data_dumps_home, rsr_data_dir_name)
