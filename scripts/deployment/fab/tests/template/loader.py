#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os
import json

from fab.config.rsr.credentials.database import DatabaseCredentials


class TemplateLoader(object):

    FAB_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../..'))
    CREDENTIALS_TEMPLATE_PATH = os.path.join(FAB_SCRIPTS_HOME, 'config/rsr/credentials/database.json.template')

    @classmethod
    def load_database_credentials_data(cls):
        return json.load(open(cls.CREDENTIALS_TEMPLATE_PATH))

    @classmethod
    def load_database_credentials(cls):
        return DatabaseCredentials(cls.load_database_credentials_data())
