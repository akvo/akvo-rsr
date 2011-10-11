# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class NeutralHost(object):
    """NeutralHost encapsulates commands that can be performed on either local or remote host types"""

    def __init__(self, file_system, feedback):
        self.file_system = file_system
        self.feedback = feedback

    def cd(self, dir_path):
        return self.file_system.cd(dir_path)

    def file_exists(self, file_path):
        return self.file_system.file_exists(file_path)

    def directory_exists(self, dir_path):
        return self.file_system.directory_exists(dir_path)

    def exit_if_file_does_not_exist(self, file_path):
        self.file_system.exit_if_file_does_not_exist(file_path)

    def exit_if_directory_does_not_exist(self, dir_path):
        self.file_system.exit_if_directory_does_not_exist(dir_path)

    def make_file_writable_for_all_users(self, file_path):
        self.file_system.make_file_writable_for_all_users(file_path)
