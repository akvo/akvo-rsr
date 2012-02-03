# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.codebase import RSRCodebaseConfig


class AdminCommandBase(object):

    def __init__(self, virtualenv):
        self.virtualenv = virtualenv

    def _run_command_in_virtualenv(self, command):
        self.virtualenv.run_within_virtualenv(command)


class DjangoAdminCommand(object):

    DUMP_DATA   = "dumpdata"
    LOAD_DATA   = "loaddata"
    SYNC_DB     = "syncdb"
    MIGRATE     = "migrate"


class CommandOption(object):

    DATA_FIXTURE_INDENTATION = "--indent=4"
    SKIP_MIGRATION = "--fake"
    NONE = ""


class CommandResponse(object):

    NO_SUPER_USERS = "no"


class DjangoAdmin(AdminCommandBase):

    def initialise_database_without_superusers(self):
        self._run_command_in_virtualenv(self._respond_with(CommandResponse.NO_SUPER_USERS, self._admin_command(DjangoAdminCommand.SYNC_DB)))

    def _respond_with(self, response, command):
        return "echo %s | %s" % (response, command)

    def synchronise_data_models(self):
        self._run_command(DjangoAdminCommand.SYNC_DB)

    def run_all_migrations_for(self, app_name):
        self._migrate(app_name)

    def skip_all_migrations_for(self, app_name):
        self._migrate(app_name, CommandOption.SKIP_MIGRATION)

    def skip_migrations_to(self, migration_number, app_name):
        self._migrate(app_name, "%s %s" % (CommandOption.SKIP_MIGRATION, migration_number))

    def _migrate(self, app_name, migration_options=CommandOption.NONE):
        self._run_command(DjangoAdminCommand.MIGRATE, "%s %s" % (app_name, migration_options))

    def extract_app_data_to(self, data_fixture_file_path, app_name):
        self._run_command(DjangoAdminCommand.DUMP_DATA, self._dump_data_options(data_fixture_file_path, app_name))

    def _dump_data_options(self, data_fixture_file_path, app_name):
        return "%s %s > %s" % (app_name, CommandOption.DATA_FIXTURE_INDENTATION, data_fixture_file_path)

    def load_data_fixture(self, data_fixture_path):
        self._run_command(DjangoAdminCommand.LOAD_DATA, data_fixture_path)

    def _run_command(self, command, options=CommandOption.NONE):
        self._run_command_in_virtualenv(self._admin_command(command, options))

    def _admin_command(self, command, options=CommandOption.NONE):
        return "python %s %s %s".strip() % (RSRCodebaseConfig.MANAGE_SCRIPT_PATH, command, options)
