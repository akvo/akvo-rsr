#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.app.admin import CommandOption, CommandResponse, DjangoAdmin, DjangoAdminCommand
from fab.app.admin import FixtureOption, Migration, MigrationOption, MigrationStatusIndicator
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.environment.python.virtualenv import VirtualEnv
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController


class DjangoAdminTest(mox.MoxTestBase):

    def setUp(self):
        super(DjangoAdminTest, self).setUp()
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.rsr_app_path = '/path/to/rsr'
        self.mock_host_controller.feedback = self.mock_feedback

        self.django_admin = DjangoAdmin(self.rsr_app_path, self.mock_virtualenv, self.mock_host_controller)

    def test_has_expected_admin_commands(self):
        """fab.tests.app.admin.django_admin_test  Has expected Django admin commands"""

        self.assertEqual('diffsettings', DjangoAdminCommand.DIFF_SETTINGS)
        self.assertEqual('dumpdata', DjangoAdminCommand.DUMP_DATA)
        self.assertEqual('loaddata', DjangoAdminCommand.LOAD_DATA)
        self.assertEqual('syncdb', DjangoAdminCommand.SYNC_DB)
        self.assertEqual('migrate', DjangoAdminCommand.MIGRATE)

    def test_has_expected_command_options(self):
        """fab.tests.app.admin.django_admin_test  Has expected command options"""

        self.assertEqual('', CommandOption.NONE)

    def test_has_expected_command_responses(self):
        """fab.tests.app.admin.django_admin_test  Has expected command responses"""

        self.assertEqual('no', CommandResponse.NO_SUPER_USERS)

    def test_has_expected_fixture_options(self):
        """fab.tests.app.admin.django_admin_test  Has expected data fixture options"""

        self.assertEqual('--format=xml', FixtureOption.XML_FORMAT)
        self.assertEqual('--indent=2', FixtureOption.WITH_INDENTATION)

    def test_has_expected_migration_names(self):
        """fab.tests.app.admin.django_admin_test  Has expected migration names"""

        self.assertEqual('zero', Migration.ZERO)

    def test_has_expected_migration_status_indicators(self):
        """fab.tests.app.admin.django_admin_test  Has expected migration status indicators"""

        self.assertEqual('(*)', MigrationStatusIndicator.APPLIED)

    def test_has_expected_migration_options(self):
        """fab.tests.app.admin.django_admin_test  Has expected migration options"""

        self.assertEqual('--fake', MigrationOption.SKIP_ALL)
        self.assertEqual('--fake', MigrationOption.SKIP_TO)
        self.assertEqual('--list', MigrationOption.LIST_ALL)

    def test_can_create_instance_for_local_host(self):
        """fab.tests.app.admin.django_admin_test  Can create a DjangoAdmin instance for a local deployment host"""

        self._verify_instance_creation_for(LocalHostController)

    def test_can_create_instance_for_remote_host(self):
        """fab.tests.app.admin.django_admin_test  Can create a DjangoAdmin instance for a remote deployment host"""

        self._verify_instance_creation_for(RemoteHostController)

    def _verify_instance_creation_for(self, host_controller_class):

        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mock_feedback
        self.mox.ReplayAll()

        self.assertIsInstance(DjangoAdmin.create_with('/path/to/rsr/virtualenv', '/path/to/rsr',  mock_host_controller), DjangoAdmin)

    def test_can_read_specified_django_setting(self):
        """fab.tests.app.admin.django_admin_test  Can read a specified Django setting"""

        expected_find_setting_command = '%s | grep some_setting_name' % self._expected_admin_command(DjangoAdminCommand.DIFF_SETTINGS,
                                                                                                     CommandOption.NONE)
        expected_setting_string = "some_setting_name = ['list', 'of', 'stuff']"

        self._change_dir_rsr_app_home()
        self._hide_command_and_output()
        self.mock_feedback.comment('Reading setting: some_setting_name')
        self._run_command_in_virtualenv(expected_find_setting_command, expected_setting_string)
        self.mox.ReplayAll()

        self.assertEqual(['list', 'of', 'stuff'], self.django_admin.read_setting('some_setting_name'))

    def test_can_extract_app_data_to_specified_fixture_file(self):
        """fab.tests.app.admin.django_admin_test  Can extract app data to a specified data fixture file"""

        data_fixture_options = ' '.join(['rsr_app', FixtureOption.XML_FORMAT, FixtureOption.WITH_INDENTATION])
        dump_data_options = '%s > /some/data/fixture.xml' % data_fixture_options
        self._run_admin_command(DjangoAdminCommand.DUMP_DATA, dump_data_options)
        self.mox.ReplayAll()

        self.django_admin.extract_app_data_to('/some/data/fixture.xml', 'rsr_app')

    def test_can_load_app_data_from_specified_fixture_file(self):
        """fab.tests.app.admin.django_admin_test  Can load app data from a specified data fixture file"""

        self._run_admin_command(DjangoAdminCommand.LOAD_DATA, '/some/data/fixture.xml.zip')
        self.mox.ReplayAll()

        self.django_admin.load_data_fixture('/some/data/fixture.xml.zip')

    def test_can_configure_django_sites(self):
        """fab.tests.app.admin.django_admin_test  Can configure Django sites"""

        self._change_dir_rsr_app_home()
        self._run_command_in_virtualenv('python %s' % RSRCodebaseConfig.CONFIGURE_SITES_SCRIPT_PATH)
        self.mox.ReplayAll()

        self.django_admin.configure_sites()

    def test_can_initialise_database_without_superusers(self):
        """fab.tests.app.admin.django_admin_test  Can initialise a database without adding super users"""

        initialise_database_command = self._respond_with(CommandResponse.NO_SUPER_USERS,
                                                         self._expected_admin_command(DjangoAdminCommand.SYNC_DB, CommandOption.NONE))
        self._run_command_in_virtualenv(initialise_database_command)
        self.mox.ReplayAll()

        self.django_admin.initialise_database_without_superusers()

    def _respond_with(self, response, command):
        return 'echo %s | %s' % (response, command)

    def test_can_synchronise_data_models(self):
        """fab.tests.app.admin.django_admin_test  Can synchronise data models"""

        self._run_admin_command(DjangoAdminCommand.SYNC_DB, CommandOption.NONE)
        self.mox.ReplayAll()

        self.django_admin.synchronise_data_models()

    def test_can_find_last_applied_migration_for_specified_app(self):
        """fab.tests.app.admin.django_admin_test  Can find the last applied migration for a specified app"""

        rsr_migration_listing = ' rsr_app\r\n' + \
                                '  (*) 0001_initial\r\n' + \
                                '  (*) 0002_auto__add_projectpartner\r\n' + \
                                '  (*) 0003_auto__chg_field_projectpartner_funding_amount\r\n' + \
                                '  ( ) 0004_refactor_project_partners\r\n'

        self._migrate('rsr_app', MigrationOption.LIST_ALL, rsr_migration_listing)
        self.mox.ReplayAll()

        self.assertEqual('0003', self.django_admin.last_applied_migration_for('rsr_app'))

    def test_will_return_zero_migration_for_specified_app_when_applied_migrations_search_returns_none(self):
        """fab.tests.app.admin.django_admin_test  Will return the 'zero' migration for a specified app when applied migrations search returns none"""

        migration_listing = ' some_app\r\n' + \
                            '  ( ) 0001_initial\r\n'

        self._migrate('some_app', MigrationOption.LIST_ALL, migration_listing)
        self.mox.ReplayAll()

        self.assertEqual(Migration.ZERO, self.django_admin.last_applied_migration_for('some_app'))

    def test_can_migrate_app_to_specified_migration_number(self):
        """fab.tests.app.admin.django_admin_test  Can migrate an app to the specified migration number"""

        self._migrate('rsr_app', '0048')
        self.mox.ReplayAll()

        self.django_admin.migrate_app_to('0048', 'rsr_app')

    def test_can_run_all_migrations_for_specified_app(self):
        """fab.tests.app.admin.django_admin_test  Can run all migrations for a specified app"""

        self._migrate('rsr_app', CommandOption.NONE)
        self.mox.ReplayAll()

        self.django_admin.run_all_migrations_for('rsr_app')

    def test_can_skip_all_migrations_for_specified_app(self):
        """fab.tests.app.admin.django_admin_test  Can skip all migrations for a specified app"""

        self._migrate('rsr_app', MigrationOption.SKIP_ALL)
        self.mox.ReplayAll()

        self.django_admin.skip_all_migrations_for('rsr_app')

    def test_can_skip_migrations_to_specified_migration_number_for_specified_app(self):
        """fab.tests.app.admin.django_admin_test  Can skip migrations to a specified migration number for a specified app"""

        self._migrate('rsr_app', '%s 0034' % MigrationOption.SKIP_TO)
        self.mox.ReplayAll()

        self.django_admin.skip_migrations_to('0034', 'rsr_app')

    def _migrate(self, app_name, migration_options, migration_response=None):
        self._run_admin_command(DjangoAdminCommand.MIGRATE, ' '.join([app_name, migration_options]), migration_response)

    def _run_admin_command(self, admin_command, options, admin_response=None):
        self._run_command_in_virtualenv(self._expected_admin_command(admin_command, options), admin_response)

    def _run_command_in_virtualenv(self, command, command_response=None):
        self.mock_virtualenv.run_within_virtualenv(command).AndReturn(command_response)

    def _expected_admin_command(self, command, options):
        return 'python %s %s %s'.strip() % (RSRCodebaseConfig.MANAGE_SCRIPT_PATH, command, options)

    def _change_dir_rsr_app_home(self):
        return self.mock_host_controller.cd(self.rsr_app_path).AndReturn(fabric.api.cd(self.rsr_app_path))

    def _hide_command_and_output(self):
        self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('running', 'stdout'))


def suite():
    return TestSuiteLoader().load_tests_from(DjangoAdminTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
