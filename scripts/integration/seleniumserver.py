# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, signal, subprocess, time

from ci_paths import *


class SeleniumRCServer:

    server_process = None
    log_file_path = None

    def __init__(self):
        self.log_file_path = self.server_log_file_path()
        log_file = open(self.log_file_path, 'w')

        java_version_call = subprocess.Popen(["java", "-version"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        log_file.writelines(java_version_call.stdout.readlines())
        log_file.write("\n")
        log_file.close()

        java_version_call.wait()

    def server_log_file_path(self):
        self.ensure_server_logging_path_exists()

        log_file_time = time.strftime("%Y%m%d_%H%M%S", time.gmtime())
        log_file_path = os.path.realpath(os.path.join(SELENIUM_SERVER_LOG_PATH, "rc_server_%s.log" % (log_file_time)))

        print "Selenium RC server log: %s\n" % log_file_path
        return log_file_path

    def ensure_server_logging_path_exists(self):
        logging_path = os.path.realpath(SELENIUM_SERVER_LOG_PATH)

        if not os.path.exists(logging_path):
            print "Creating logging directory: %s" % (logging_path)
            os.mkdir(logging_path, 0775)

    def start(self):
        self.server_process = subprocess.Popen("exec java -jar %s >> %s" % (SELENIUM_SERVER_JAR_PATH, self.log_file_path),
                                               shell=True)

    def stop(self):
        os.kill(self.server_process.pid, signal.SIGINT) # send interrupt signal
        self.server_process.wait()
