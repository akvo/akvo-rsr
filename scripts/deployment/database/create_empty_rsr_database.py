#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, sys

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.admin import DatabaseAdmin
from fab.database.mysql.connection import DatabaseConnection


def display_usage_and_exit():
    print "Usage: create_empty_rsr_database <database_config_file_path>"
    sys.exit(1)

def verify_expected_parameters():
    if len(sys.argv) > 0 and len(sys.argv) < 2:
        print "Missing script parameter: <database_config_file_path>"
        display_usage_and_exit()

def exit_if_config_file_not_found(config_file_path):
    if not os.path.exists(config_file_path):
        print "Configuration file not found: %s" % config_file_path
        display_usage_and_exit()
    else:
        print "Using database configuration values from: %s" % config_file_path

def create_empty_rsr_database(db_config_values_file):
    db_config = RSRDatabaseConfig.from_config_values_file(db_config_values_file)
    db_admin = DatabaseAdmin(DatabaseConnection(db_config.admin_user, db_config.admin_password))

    print "Creating RSR database: %s" % db_config.rsr_database_name
    db_admin.create_empty_database(db_config.rsr_database_name)

    print "Granting all database permissions for RSR user: %s" % db_config.rsr_database_user
    db_admin.grant_all_database_permissions_for_user(db_config.rsr_database_user, db_config.rsr_database_name)


if __name__ == "__main__":
    verify_expected_parameters()
    db_config_values_file = sys.argv[1]

    exit_if_config_file_not_found(db_config_values_file)
    create_empty_rsr_database(db_config_values_file)
