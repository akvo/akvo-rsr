# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.format.timestamp import TimeStampFormatter


class RSRDatabaseConfig(object):

    CONFIG_VALUES_FILE_NAME     = "values.py"
    LOCAL_CONFIG_VALUES_FILE    = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', CONFIG_VALUES_FILE_NAME))
    DATABASE_ADMIN_SCRIPTS_HOME = "scripts/deployment/database"

    def __init__(self, db_admin_config_values, db_config_values, deployment_config, time_stamp_formatter):
        self.admin_user = db_admin_config_values.admin_user
        self.admin_password = db_admin_config_values.admin_password
        self.rsr_database_name  = db_config_values.rsr_database_name
        self.rsr_database_user  = db_config_values.rsr_database_user

        self.local_config_values_file   = self.LOCAL_CONFIG_VALUES_FILE
        self.remote_config_values_home  = db_admin_config_values.remote_config_values_home
        self.remote_config_values_file  = os.path.join(self.remote_config_values_home, self.CONFIG_VALUES_FILE_NAME)
        self.admin_scripts_path         = os.path.join(deployment_config.rsr_deployment_home, self.DATABASE_ADMIN_SCRIPTS_HOME)

        self.time_stamp_formatter = time_stamp_formatter

    @staticmethod
    def create_instance():
        return RSRDatabaseConfig.from_config_values_file(RSRDatabaseConfig.LOCAL_CONFIG_VALUES_FILE)

    @staticmethod
    def from_config_values_file(config_values_file_path):
        imp.load_source('config_values', config_values_file_path)
        from config_values import DatabaseAdminConfigValues, DeploymentHostConfigValues, RSRDatabaseConfigValues

        deployment_config = RSRDeploymentConfig(None, DeploymentHostConfigValues(), RSRCodebaseConfig.create_instance())

        return RSRDatabaseConfig(DatabaseAdminConfigValues(), RSRDatabaseConfigValues(), deployment_config,
                                 TimeStampFormatter())

    def time_stamped_database_name(self):
        return self.time_stamp_formatter.append_timestamp(self.rsr_database_name)
