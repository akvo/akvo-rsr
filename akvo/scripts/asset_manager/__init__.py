
# This will setup the githooks on first request.
import os, subprocess, sys
from django.conf import settings

if settings.DEBUG:
    cwd = os.path.abspath(os.path.dirname(__file__))
    try:
        ln_string = 'ln -s %s/../../../git_hooks/pre-commit %s/../../../.git/hooks/pre-commit' % (cwd, cwd)
        retcode = subprocess.call(ln_string, shell=True)
        if retcode < 0:
            print >>sys.stderr, "Symlinking the githook was terminated by signal", -retcode
    except OSError, e:
        print 'Could not setup git hooks. Got error: %s' %s