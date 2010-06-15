# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, time


class LoggedSubprocess:

    def server_log_file_path(self, log_path, log_file_prefix, subprocess_name):
        self.ensure_server_logging_path_exists(log_path)

        log_file_time = time.strftime("%Y%m%d_%H%M%S", time.gmtime())
        log_file_name = "%s_%s.log" % (log_file_prefix, log_file_time)
        log_file_path = os.path.realpath(os.path.join(log_path, log_file_name))

        print "%s log: %s\n" % (subprocess_name, log_file_path)
        return log_file_path

    def ensure_server_logging_path_exists(self, log_path):
        logging_path = os.path.realpath(log_path)

        if not os.path.exists(logging_path):
            print "Creating logging directory: %s" % (logging_path)
            os.makedirs(logging_path)
            os.chmod(logging_path, 0777)
