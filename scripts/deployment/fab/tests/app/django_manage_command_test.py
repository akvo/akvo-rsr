#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.command import DjangoManageCommand
from fab.config.rsr.codebase import RSRCodebaseConfig


class DjangoManageCommandTest(unittest2.TestCase):

    def setUp(self):
        super(DjangoManageCommandTest, self).setUp()

        self.expected_syncdb_command = "python %s syncdb" % RSRCodebaseConfig.MANAGE_SCRIPT_PATH

    def test_disable_creation_of_superusers(self):
        """fab.tests.app.django_manage_command_test  Disable creation of superusers"""

        self.assertEqual("no", DjangoManageCommand.CREATE_SUPERUSERS)

    def test_enable_deletion_of_stale_content_types(self):
        """fab.tests.app.django_manage_command_test  Enable deletion of stale content types"""

        self.assertEqual("yes", DjangoManageCommand.DELETE_STALE_CONTENT_TYPES)

    def test_has_plain_syncdb_command(self):
        """fab.tests.app.django_manage_command_test  Has plain syncdb command"""

        self.assertEqual(self.expected_syncdb_command, DjangoManageCommand.SYNCDB)

    def test_has_syncdb_command_without_creating_superusers(self):
        """fab.tests.app.django_manage_command_test  Has syncdb command without creating superusers"""

        self.assertEqual(self._syncdb_command_with_response(DjangoManageCommand.CREATE_SUPERUSERS),
                         DjangoManageCommand.SYNCDB_WITHOUT_CREATING_SUPERUSERS)

    def test_has_syncdb_command_with_stale_content_type_deletion(self):
        """fab.tests.app.django_manage_command_test  Has syncdb command with stale content type deletion"""

        self.assertEqual(self._syncdb_command_with_response(DjangoManageCommand.DELETE_STALE_CONTENT_TYPES),
                         DjangoManageCommand.SYNCDB_WITH_STALE_CONTENT_TYPE_DELETION)

    def _syncdb_command_with_response(self, response):
        return "echo %s | %s" % (response, self.expected_syncdb_command)


def suite():
    return TestSuiteLoader().load_tests_from(DjangoManageCommandTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
