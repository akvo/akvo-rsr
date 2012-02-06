#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.tasks.database.backup_rsr_database_test import BackupRSRDatabaseTest
from fab.tests.tasks.database.rebuild_rsr_database_test import RebuildRSRDatabaseTest
from fab.tests.tasks.database.rsr_database_task_test import RSRDatabaseTaskTest
from fab.tests.tasks.database.run_database_migrations_test import RunDatabaseMigrationsTest


def database_tasks_suite():
    return TestSuiteLoader().create_suite_from_classes([BackupRSRDatabaseTest, RebuildRSRDatabaseTest,
                                                        RSRDatabaseTaskTest, RunDatabaseMigrationsTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(database_tasks_suite())
