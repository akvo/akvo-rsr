# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class DatabaseCredentials(object):

    DATABASE_CREDENTIALS_FILE_NAME = 'database.json'

    def __init__(self, credentials_data):
        self.admin_user     = credentials_data['admin_user']
        self.admin_password = credentials_data['admin_password']
        self.rsr_user       = credentials_data['rsr_user']
        self.rsr_password   = credentials_data['rsr_password']

    @classmethod
    def read_with(cls, credentials_file_reader):
        return DatabaseCredentials(credentials_file_reader.read_deployed_credentials(cls.DATABASE_CREDENTIALS_FILE_NAME))

    def __eq__(self, database_credentials):
        return (self.admin_user     == database_credentials.admin_user and
                self.admin_password == database_credentials.admin_password and
                self.rsr_user       == database_credentials.rsr_user and
                self.rsr_password   == database_credentials.rsr_password)

    def __ne__(self, database_credentials):
        return not self.__eq__(database_credentials)
