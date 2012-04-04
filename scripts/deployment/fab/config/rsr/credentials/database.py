# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import simplejson as json


class DatabaseCredentials(object):

    def __init__(self, database_credentials):
        self.admin_user     = database_credentials['admin_user']
        self.admin_password = database_credentials['admin_password']
        self.rsr_user       = database_credentials['rsr_user']
        self.rsr_password   = database_credentials['rsr_password']

    @staticmethod
    def load_with(deployment_config, credentials_verifier):
        credentials_verifier.exit_if_database_credentials_not_available()

        return DatabaseCredentials(json.load(open(deployment_config.deployed_database_credentials_file)))
