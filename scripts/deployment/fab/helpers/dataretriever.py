# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import fabric.context_managers


class DataRetriever(object):

    def __init__(self, data_retriever_config, remote_host, virtualenv, path_helper, file_system, execution_feedback):
        self.config = data_retriever_config
        self.data_server = remote_host
        self.virtualenv = virtualenv
        self.path = path_helper
        self.file_system = file_system
        self.feedback = execution_feedback

    def fetch_data_from_database(self):
        self.ensure_required_paths_exist()
        self.feedback.comment("Fetching data from database")
        rsr_data_dump_path = self.config.rsr_data_dump_path
        with fabric.context_managers.cd(self.config.akvo_rsr_app_path):
            self.data_server.run("pwd")
            self.virtualenv.run_within_virtualenv("python db_dump.py -d %s dump" % rsr_data_dump_path)
        self.file_system.compress_directory(rsr_data_dump_path)
        self.file_system.delete_directory(rsr_data_dump_path)

    def ensure_required_paths_exist(self):
        self.path.ensure_path_exists_with_sudo(self.config.data_dumps_home)
        self.path.exit_if_path_does_not_exist(self.config.rsr_virtualenv_path)
        self.path.exit_if_file_does_not_exist(self.config.db_dump_script_path)
