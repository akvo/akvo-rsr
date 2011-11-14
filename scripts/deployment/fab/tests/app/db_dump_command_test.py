#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.command import DBDumpAction, DBDumpCommand
from fab.config.rsr.codebase import RSRCodebaseConfig


class DBDumpCommandTest(unittest2.TestCase):

    def setUp(self):
        super(DBDumpCommandTest, self).setUp()

    def test_can_dump_data_to_given_data_archive_dir(self):
        """fab.tests.app.db_dump_command_test  Can dump data to a given data archive directory"""

        self.assertEqual(self._db_dump_command_with_action(DBDumpAction.DUMP_DATA, "/data/dir"), DBDumpCommand.dump_to("/data/dir"))

    def test_can_load_data_from_given_data_archive_dir(self):
        """fab.tests.app.db_dump_command_test  Can load data from a given data archive directory"""

        self.assertEqual(self._db_dump_command_with_action(DBDumpAction.LOAD_DATA, "/data/dir"), DBDumpCommand.load_from("/data/dir"))

    def _db_dump_command_with_action(self, action, data_archive_dir):
        return "python %s -d %s %s" % (RSRCodebaseConfig.DB_DUMP_SCRIPT_PATH, data_archive_dir, action)


def suite():
    return TestSuiteLoader().load_tests_from(DBDumpCommandTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
