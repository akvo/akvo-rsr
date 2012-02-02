#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.admin import DBDump, DBDumpAction
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.environment.python.virtualenv import VirtualEnv


class DBDumpTest(mox.MoxTestBase):

    def setUp(self):
        super(DBDumpTest, self).setUp()
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        self.db_dump = DBDump(self.mock_virtualenv)

    def test_can_extract_data_to_given_data_archive_dir(self):
        """fab.tests.app.admin.db_dump_test  Can extract data to a given data archive directory"""

        self._run_db_dump_command(DBDumpAction.DUMP_DATA, "/data/archive/dir")
        self.mox.ReplayAll()

        self.db_dump.extract_data_to("/data/archive/dir")

    def test_can_load_data_from_given_data_archive_dir(self):
        """fab.tests.app.admin.db_dump_test  Can load data from a given data archive directory"""

        self._run_db_dump_command(DBDumpAction.LOAD_DATA, "/data/archive/dir")
        self.mox.ReplayAll()

        self.db_dump.load_data_from("/data/archive/dir")

    def _run_db_dump_command(self, action, data_archive_dir):
        self._run_command_in_virtualenv(self._expected_db_dump_command(action, data_archive_dir))

    def _run_command_in_virtualenv(self, command):
        self.mock_virtualenv.run_within_virtualenv(command)

    def _expected_db_dump_command(self, action, data_archive_dir):
        return "python %s -d %s %s" % (RSRCodebaseConfig.DB_DUMP_SCRIPT_PATH, data_archive_dir, action)


def suite():
    return TestSuiteLoader().load_tests_from(DBDumpTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
