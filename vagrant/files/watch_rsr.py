#!/usr/bin/env python
import subprocess
from watchdog.events import PatternMatchingEventHandler
from watchdog.observers.polling import PollingObserver
import time

needs_restart = False

class DjangoChangeHandler(PatternMatchingEventHandler):

    def __init__(self):
        patterns = ('*.py', '*.conf',)
        PatternMatchingEventHandler.__init__(self, patterns=patterns, ignore_directories=['checkout', '.git'])

    def on_any_event(self, event):
        global needs_restart
        needs_restart = True


def setup():

    handler = DjangoChangeHandler()
    observer = PollingObserver()

    observer.schedule(handler, '/var/akvo/rsr/git/current/akvo/', recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
            if needs_restart:
                cmd = 'supervisorctl restart rsr'
                print subprocess.check_output(cmd, shell=True)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == '__main__':
    print 'Starting RSR observer'
    setup()