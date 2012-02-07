# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.codebase import RSRCodebaseConfig


class DjangoAdminCommand(object):

    DUMP_DATA   = 'dumpdata'
    LOAD_DATA   = 'loaddata'
    SYNC_DB     = 'syncdb'
    MIGRATE     = 'migrate'


class CommandOption(object):

    NONE = ''


class CommandResponse(object):

    NO_SUPER_USERS = 'no'


class FixtureOption(object):

    XML_FORMAT          = '--format=xml'
    WITH_INDENTATION    = '--indent=2'


class Migration(object):

    ZERO = 'zero'


class MigrationOption(object):

    SKIP_TO     = '--fake'
    SKIP_ALL    = SKIP_TO
    LIST_ALL    = '--list'


class DjangoAdmin(object):

    def __init__(self, virtualenv):
        self.virtualenv = virtualenv

    def initialise_database_without_superusers(self):
        self._run_command_in_virtualenv(self._respond_with(CommandResponse.NO_SUPER_USERS, self._admin_command(DjangoAdminCommand.SYNC_DB)))

    def _respond_with(self, response, command):
        return 'echo %s | %s' % (response, command)

    def synchronise_data_models(self):
        self._run_command(DjangoAdminCommand.SYNC_DB)

    def last_applied_migration_for(self, app_name):
        migration_listing = self._migrate(app_name, MigrationOption.LIST_ALL).split('\r\n')
        applied_migrations = filter(lambda listing_line: listing_line.find('(*)') > 0, migration_listing)

        if len(applied_migrations) > 0:
            return applied_migrations[-1].split(' ')[-1].split('_')[0]
        else:
            return Migration.ZERO

    def migrate_app_to(self, migration_number, app_name):
        self._migrate(app_name, migration_number)

    def run_all_migrations_for(self, app_name):
        self._migrate(app_name)

    def skip_all_migrations_for(self, app_name):
        self._migrate(app_name, MigrationOption.SKIP_ALL)

    def skip_migrations_to(self, migration_number, app_name):
        self._migrate(app_name, ' '.join([MigrationOption.SKIP_TO, migration_number]))

    def _migrate(self, app_name, migration_options=CommandOption.NONE):
        return self._run_command(DjangoAdminCommand.MIGRATE, ' '.join([app_name, migration_options]))

    def extract_app_data_to(self, data_fixture_file_path, app_name):
        self._run_command(DjangoAdminCommand.DUMP_DATA, self._dump_data_options(data_fixture_file_path, app_name))

    def _dump_data_options(self, data_fixture_file_path, app_name):
        data_fixture_options = ' '.join([app_name, FixtureOption.XML_FORMAT, FixtureOption.WITH_INDENTATION])

        return '%s > %s' % (data_fixture_options, data_fixture_file_path)

    def load_data_fixture(self, data_fixture_path):
        self._run_command(DjangoAdminCommand.LOAD_DATA, data_fixture_path)

    def _run_command(self, command, options=CommandOption.NONE):
        return self._run_command_in_virtualenv(self._admin_command(command, options))

    def _admin_command(self, command, options=CommandOption.NONE):
        return 'python %s %s %s'.strip() % (RSRCodebaseConfig.MANAGE_SCRIPT_PATH, command, options)

    def _run_command_in_virtualenv(self, command):
        return self.virtualenv.run_within_virtualenv(command)
