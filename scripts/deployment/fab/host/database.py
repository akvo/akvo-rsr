# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.database.scriptrunner import DatabaseAdminScriptRunner


class DatabaseHost(object):
    """DatabaseHost encapsulates database deployment actions"""

    def __init__(self, admin_script_runner):
        self.admin_script_runner = admin_script_runner

    @staticmethod
    def create_instance(host_controller):
        return DatabaseHost(DatabaseAdminScriptRunner.create_instance(host_controller))

    def rename_existing_database(self):
        self.admin_script_runner.run("rename_existing_rsr_database.py")

    def create_empty_database(self):
        self.admin_script_runner.run("create_empty_rsr_database.py")
