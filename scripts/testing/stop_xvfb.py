#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, signal, sys


XVFB_PID_FILE_NAME = "xvfb.pid"
XVFB_DISPLAY_NUMBER_FILE_NAME = "xvfb_display.txt"


def display_usage_and_exit():
    print 'Usage: stop_xvfb <xvfb_log_path>'
    sys.exit(1)

def verify_script_parameters():
    if len(sys.argv) <= 1:
        print ">> Missing xvfb_log_path parameter"
        display_usage_and_exit()
    elif len(sys.argv) != 2:
        print ">> Unexpected number of parameters"
        display_usage_and_exit()

    xvfb_log_path = os.path.realpath(sys.argv[1])

    if not os.path.exists(xvfb_log_path):
        print ">> Xvfb log path does not exist: %s" % (xvfb_log_path)
        display_usage_and_exit()
    elif not os.path.isdir(xvfb_log_path):
        print ">> Xvfb log path is not a directory: %s" % (xvfb_log_path)
        display_usage_and_exit()

def stop_xvfb_process():
    if xvfb_process_is_not_running():
        print "Xvfb process does not appear to be running -- process ID file not found at: %s" % xvfb_process_id_file_path()
        sys.exit(0)

    terminate_xvfb_process()

    os.remove(xvfb_process_id_file_path())
    os.remove(xvfb_display_number_file_path())

def xvfb_process_is_not_running():
    return not os.path.exists(xvfb_process_id_file_path())

def terminate_xvfb_process():
    process_id = xvfb_process_id()
    display_number = xvfb_display_number()

    if process_id_exists(process_id):
        print "Terminating Xvfb process ID %i on display %s" % (process_id, display_number)
        os.kill(process_id, signal.SIGTERM) # send terminate signal

def xvfb_process_id():
    process_id_file_path = xvfb_process_id_file_path()
    process_id = open(process_id_file_path, 'r').readline().strip()

    if not process_id.isdigit():
        raise Exception("Unexpected process ID [%s] in: %s" % (process_id, process_id_file_path))

    return int(process_id)

def xvfb_display_number():
    return open(xvfb_display_number_file_path(), 'r').readline().strip()

def process_id_exists(process_id):
    try:
        os.kill(process_id, 0) # attempt to send a harmless signal (0) to the process
        return True
    except OSError, os_error:
        if str(os_error).endswith('No such process'):
            print "Process ID %i no longer exists" % (process_id)
            return False
        else:
            raise os_error

def xvfb_process_id_file_path():
    return os.path.join(os.path.realpath(sys.argv[1]), XVFB_PID_FILE_NAME)

def xvfb_display_number_file_path():
    return os.path.join(os.path.realpath(sys.argv[1]), XVFB_DISPLAY_NUMBER_FILE_NAME)


if __name__ == "__main__":
    verify_script_parameters()
    stop_xvfb_process()
