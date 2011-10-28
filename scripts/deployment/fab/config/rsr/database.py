# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.values import DatabaseAdminConfigValues
from fab.format.timestamp import TimeStampFormatter


class RSRDatabaseConfig(object):

    def __init__(self, database_admin_config_values, time_stamp_formatter):
        self.admin_user = database_admin_config_values.admin_user
        self.admin_password = database_admin_config_values.admin_password

    @staticmethod
    def create_instance():
        return RSRDatabaseConfig(DatabaseAdminConfigValues(), TimeStampFormatter())
