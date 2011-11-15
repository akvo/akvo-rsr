# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.codebase import RSRCodebaseConfig


class DjangoManageCommand(object):

    CREATE_SUPERUSERS           = "no"
    DELETE_STALE_CONTENT_TYPES  = "yes"

    SYNCDB = "python %s syncdb" % RSRCodebaseConfig.MANAGE_SCRIPT_PATH
    SYNCDB_WITHOUT_CREATING_SUPERUSERS = "echo %s | %s" % (CREATE_SUPERUSERS, SYNCDB)
    SYNCDB_WITH_STALE_CONTENT_TYPE_DELETION = "echo %s | %s" % (DELETE_STALE_CONTENT_TYPES, SYNCDB)


class DBDumpAction(object):

    DUMP_DATA   = "dump"
    LOAD_DATA   = "load"


class DBDumpCommand(object):

    @staticmethod
    def dump_to(data_archive_dir):
        return DBDumpCommand.with_action(DBDumpAction.DUMP_DATA, data_archive_dir)

    @staticmethod
    def load_from(data_archive_dir):
        return DBDumpCommand.with_action(DBDumpAction.LOAD_DATA, data_archive_dir)

    @staticmethod
    def with_action(action, data_archive_dir):
        return "python %s -d %s %s" % (RSRCodebaseConfig.DB_DUMP_SCRIPT_PATH, data_archive_dir, action)
