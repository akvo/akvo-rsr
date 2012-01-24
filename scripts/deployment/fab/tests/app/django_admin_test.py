#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.admin import CommandOption, CommandResponse, DjangoAdmin, DjangoAdminCommand
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.environment.python.virtualenv import VirtualEnv


class DjangoAdminTest(mox.MoxTestBase):

    def setUp(self):
        super(DjangoAdminTest, self).setUp()
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        self.django_admin = DjangoAdmin(self.mock_virtualenv)

    def test_has_expected_admin_commands(self):
        """fab.tests.app.admin.django_admin_test  Has expected Django admin commands"""

        self.assertEqual("dumpdata", DjangoAdminCommand.DUMP_DATA)
        self.assertEqual("loaddata", DjangoAdminCommand.LOAD_DATA)
        self.assertEqual("syncdb", DjangoAdminCommand.SYNC_DB)
        self.assertEqual("migrate", DjangoAdminCommand.MIGRATE)

    def test_has_expected_command_options(self):
        """fab.tests.app.admin.django_admin_test  Has expected command options"""

        self.assertEqual("--indent=4", CommandOption.DATA_FIXTURE_INDENTATION)
        self.assertEqual("--fake", CommandOption.SKIP_MIGRATION)
        self.assertEqual("", CommandOption.NONE)

    def test_has_expected_command_responses(self):
        """fab.tests.app.admin.django_admin_test  Has expected command responses"""

        self.assertEqual("no", CommandResponse.NO_SUPER_USERS)

    def test_can_extract_app_data_to_specified_fixture_file(self):
        """fab.tests.app.admin.django_admin_test  Can extract app data to a specified data fixture file"""

        dump_data_options = "rsr_app %s > /some/data/fixture.json" % CommandOption.DATA_FIXTURE_INDENTATION
        self._run_admin_command(DjangoAdminCommand.DUMP_DATA, dump_data_options)
        self.mox.ReplayAll()

        self.django_admin.extract_app_data_to("/some/data/fixture.json", "rsr_app")

    def test_can_load_app_data_from_specified_fixture_file(self):
        """fab.tests.app.admin.django_admin_test  Can load app data from a specified data fixture file"""

        self._run_admin_command(DjangoAdminCommand.LOAD_DATA, "/some/data/fixture.json")
        self.mox.ReplayAll()

        self.django_admin.load_data_fixture("/some/data/fixture.json")

    def test_can_initialise_database_without_superusers(self):
        """fab.tests.app.admin.django_admin_test  Can initialise a database without adding super users"""

        initialise_database_command = self._respond_with(CommandResponse.NO_SUPER_USERS,
                                                         self._expected_admin_command(DjangoAdminCommand.SYNC_DB, CommandOption.NONE))
        self._run_command_in_virtualenv(initialise_database_command)
        self.mox.ReplayAll()

        self.django_admin.initialise_database_without_superusers()

    def _respond_with(self, response, command):
        return "echo %s | %s" % (response, command)

    def test_can_synchronise_data_models(self):
        """fab.tests.app.admin.django_admin_test  Can synchronise data models"""

        self._run_admin_command(DjangoAdminCommand.SYNC_DB, CommandOption.NONE)
        self.mox.ReplayAll()

        self.django_admin.synchronise_data_models()

    def test_can_run_all_migrations_for_specified_app(self):
        """fab.tests.app.admin.django_admin_test  Can run all migrations for a specified app"""

        self._migrate("rsr_app", CommandOption.NONE)
        self.mox.ReplayAll()

        self.django_admin.run_all_migrations_for("rsr_app")

    def test_can_skip_all_migrations_for_specified_app(self):
        """fab.tests.app.admin.django_admin_test  Can skip all migrations for a specified app"""

        self._migrate("rsr_app", CommandOption.SKIP_MIGRATION)
        self.mox.ReplayAll()

        self.django_admin.skip_all_migrations_for("rsr_app")

    def test_can_skip_migrations_to_specified_migration_number_for_specified_app(self):
        """fab.tests.app.admin.django_admin_test  Can skip migrations to a specified migration number for a specified app"""

        self._migrate("rsr_app", "%s 0034" % CommandOption.SKIP_MIGRATION)
        self.mox.ReplayAll()

        self.django_admin.skip_migrations_to("0034", "rsr_app")

    def _migrate(self, app_name, migration_options):
        self._run_admin_command(DjangoAdminCommand.MIGRATE, "%s %s" % (app_name, migration_options))

    def _run_admin_command(self, admin_command, options):
        self._run_command_in_virtualenv(self._expected_admin_command(admin_command, options))

    def _run_command_in_virtualenv(self, command):
        self.mock_virtualenv.run_within_virtualenv(command)

    def _expected_admin_command(self, command, options):
        return "python %s %s %s".strip() % (RSRCodebaseConfig.MANAGE_SCRIPT_PATH, command, options)


def suite():
    return TestSuiteLoader().load_tests_from(DjangoAdminTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
