# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.tasks.database.basetask


class ConvertRSRDatabaseForMigrations(fab.tasks.database.basetask.RSRDatabaseTask):
    """Prepares an RSR database for using migrations"""

    name = "convert_rsr_database_for_migrations"

    def run(self, host_controller_mode):
        super(ConvertRSRDatabaseForMigrations, self).run(host_controller_mode)
        self.database_host.convert_database_for_migrations()


instance = ConvertRSRDatabaseForMigrations()
