# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, signal, subprocess

from selenium import selenium

from ci_settings import *
from loggedsubprocess import LoggedSubprocess


class SeleniumRCServer(LoggedSubprocess):

    server_process = None
    log_file_path = None

    def __init__(self):
        self.log_file_path = self.server_log_file_path(SELENIUM_SERVER_LOG_PATH, SELENIUM_SERVER_LOG_FILE_PREFIX, SELENIUM_SERVER_PROCESS_NAME)
        self.log_java_version()

    def log_java_version(self):
        log_file = open(self.log_file_path, 'w')

        java_version_call = subprocess.Popen(["java", "-version"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        log_file.writelines(java_version_call.stdout.readlines())
        log_file.close()

        java_version_call.wait()

    def start(self):
        # The exec call with the shell=True parameter is a hack so that we can use the OS's output
        # redirection process (which runs in its own thread) rather than having to write the necessary
        # threading and redirection plumbing ourselves.  This is because the RC server keeps running
        # until being shut down so we can't use any of the subprocess.Popen methods that wait for the
        # server process to terminate otherwise this method will lock.

        print "Starting %s..." % (SELENIUM_SERVER_PROCESS_NAME)
        self.server_process = subprocess.Popen("exec java -jar %s >> %s" % (SELENIUM_SERVER_JAR_PATH, self.log_file_path),
                                               shell=True)
        print "Server started successfully\n"

    def stop(self):
        selenium_server_host = "localhost"
        selenium_server_port = 4444
        browser_environment = "*firefox"

        try:
            print "\nStopping %s..." % (SELENIUM_SERVER_PROCESS_NAME)
            selenium(selenium_server_host, selenium_server_port, browser_environment, '').shut_down_selenium_server()
        except Exception, exception:
            print "Unable to stop %s with shutdown command: %s" % (SELENIUM_SERVER_PROCESS_NAME, exception)
            print "\nStopping server with interrupt signal instead"
            os.kill(self.server_process.pid, signal.SIGINT) # send interrupt signal

        self.server_process.wait()
        print "Server stopped successfully\n"
