
# This will setup the githooks on first request.
import os

#/code/webdev/akvo/akvo-rsr/akvo/scripts/media_packer
cwd = os.path.abspath(os.path.dirname(__file__))

ln_string = 'ln -s %s/../../../git_hooks/pre-commit %s/../../../.git/hooks/pre-commit' % (cwd, cwd)

try:
    os.system(ln_string)
except Exception, e:
    print 'Could not setup git hooks'
    pass




