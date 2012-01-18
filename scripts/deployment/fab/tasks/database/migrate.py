# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.config.loaders
import fab.tasks.database.basetask


class RunDatabaseMigrations(fab.tasks.database.basetask.RSRDatabaseTask):
    """Runs all the database migrations"""

    name = "run_database_migrations"

    @staticmethod
    def create_task():
        return RunDatabaseMigrations(fab.config.loaders.DeploymentConfigLoader.load())

    def run(self, host_controller_mode):
        super(RunDatabaseMigrations, self).run(host_controller_mode)
        self.database_host.run_all_migrations()


instance = RunDatabaseMigrations.create_task()
