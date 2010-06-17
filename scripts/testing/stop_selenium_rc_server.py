#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, signal, sys

from selenium import selenium

DEFAULT_SELENIUM_RC_HOST = "localhost"
DEFAULT_SELENIUM_RC_PORT = 4444
DEFAULT_BROWSER_ENVIRONMENT = "*firefox"

RC_SERVER_PID_FILE_NAME = "rc_server.pid"


def display_usage_and_exit():
    default_values = "%s %i %s" % (DEFAULT_SELENIUM_RC_HOST, DEFAULT_SELENIUM_RC_PORT, DEFAULT_BROWSER_ENVIRONMENT)
    print 'Usage: stop_selenium_rc_server <rc_server_log_path> [rc_host] [rc_port] [browser_environment]'
    print "If no server parameters are specified, the following default values will be used: %s" % (default_values)
    sys.exit(1)

def verify_script_parameters():
    if len(sys.argv) <= 1:
        print ">> Missing rc_server_log_path parameter"
        display_usage_and_exit()
    elif len(sys.argv) != 2 and len(sys.argv) != 5:
        display_usage_and_exit()
    elif len(sys.argv) == 5 and not sys.argv[3].isdigit():
        print ">> The rc_port parameter [%s] must be an integer" % sys.argv[3]
        display_usage_and_exit()

    rc_server_log_path = os.path.realpath(sys.argv[1])

    if not os.path.exists(rc_server_log_path):
        print ">> Selenium RC server log path does not exist: %s" % (rc_server_log_path)
        display_usage_and_exit()
    elif not os.path.isdir(rc_server_log_path):
        print ">> Selenium RC server log path is not a directory: %s" % (rc_server_log_path)
        display_usage_and_exit()

def stop_rc_server():
    if rc_server_process_is_not_running():
        print "Selenium RC server does not appear to be running -- process ID file not found: %s" % rc_server_log_file_path()
        sys.exit(0)

    try:
        stop_rc_server_with_shutdown_command()
        print "Server stopped successfully\n"
        os.remove(rc_server_process_id_file_path())
    except Exception, exception:
        print "Unable to stop Selenium RC server with shutdown command: %s" % (exception)
        kill_unresponsive_rc_server_process()

def rc_server_process_is_not_running():
    return not os.path.exists(rc_server_process_id_file_path())

def stop_rc_server_with_shutdown_command():
    selenium_rc_host = DEFAULT_SELENIUM_RC_HOST
    selenium_rc_port = DEFAULT_SELENIUM_RC_PORT
    browser_environment = DEFAULT_BROWSER_ENVIRONMENT

    if len(sys.argv) == 5:
        selenium_rc_host = sys.argv[2]
        selenium_rc_port = int(sys.argv[3])
        browser_environment = sys.argv[4]

    try:
        print "\nStopping Selenium RC server [%s, %i, %s]..." % (selenium_rc_host, selenium_rc_port, browser_environment)
        selenium(selenium_rc_host, selenium_rc_port, browser_environment, '').shut_down_selenium_server()
    except Exception, exception:
        if str(exception).endswith('Connection refused'):
            print "Server already appears to have been stopped: %s" % (exception)
            sys.exit(0)
        else:
            raise exception

def kill_unresponsive_rc_server_process():
    process_id = rc_server_process_id()

    if process_id_exists(process_id):
        print process_id
        print "Killing unresponsive Selenium RC server process"
        os.kill(process_id, signal.SIGTERM) # send terminate signal
    else:
        raise Exception("Server process ID %i no longer exists: %s" % (process_id, os_error))

def rc_server_process_id():
    process_id_file_path = rc_server_process_id_file_path()
    process_id = open(process_id_file_path, 'r').readline().strip()

    if not process_id.isdigit():
        raise Exception("Unexpected Selenium RC server process ID [%s] in: %s" % (process_id, process_id_file_path))

    return int(process_id)

def process_id_exists(process_id):
    try:
        os.kill(process_id, 0) # attempt to send a harmless signal (0) to the process
        return True
    except OSError, os_error:
        if os_error.endswith('No such process'):
            return False
        else:
            raise os_error

def rc_server_process_id_file_path():
    return os.path.join(os.path.realpath(sys.argv[1]), RC_SERVER_PID_FILE_NAME)


if __name__ == "__main__":
    verify_script_parameters()
    stop_rc_server()
