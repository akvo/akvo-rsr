# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

from fab.format.timestamp import TimeStampFormatter


class RSRDatabaseConfig(object):

    def __init__(self, db_admin_config_values, db_config_values, time_stamp_formatter):
        self.admin_user = db_admin_config_values.admin_user
        self.admin_password = db_admin_config_values.admin_password
        self.rsr_database_name  = db_config_values.rsr_database_name
        self.rsr_database_user  = db_config_values.rsr_database_user
        self.time_stamp_formatter = time_stamp_formatter

    @staticmethod
    def from_config_values_file(config_values_file_path):
        imp.load_source('config_values', config_values_file_path)
        from config_values import DatabaseAdminConfigValues, RSRDatabaseConfigValues

        return RSRDatabaseConfig(DatabaseAdminConfigValues(), RSRDatabaseConfigValues(), TimeStampFormatter())
