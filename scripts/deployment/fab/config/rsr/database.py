# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class RSRDatabaseConfig(object):

    def __init__(self, database_credentials, deployment_host_config):
        self.admin_user     = database_credentials.admin_user
        self.admin_password = database_credentials.admin_password
        self.rsr_database   = deployment_host_config.rsr_database_name
        self.rsr_user       = database_credentials.rsr_user
        self.rsr_password   = database_credentials.rsr_password
