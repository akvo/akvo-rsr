1)  Install a recent 2.6 or 2.7 Mac OS X Python build from http://python.org/download/releases
    - this will add /Library/Frameworks/Python.framework/Versions/2.6/bin or similar to your env PATH

2)  Add the following exports and aliases to your Mac OS X ~/.profile or other shell profile file:

      export ARCHFLAGS="-arch x86_64 -arch i386"
      export CC=/usr/bin/gcc-4.2
      export MACOSX_DEPLOYMENT_TARGET=10.6

      alias env64="sudo env ARCHFLAGS='-arch x86_64' CC=/usr/bin/gcc-4.2 MACOSX_DEPLOYMENT_TARGET=10.6"
      alias env32="sudo env ARCHFLAGS='-arch i386' CC=/usr/bin/gcc-4.2 MACOSX_DEPLOYMENT_TARGET=10.6"
      alias envintel="sudo env ARCHFLAGS='-arch x86_64 -arch i386' CC=/usr/bin/gcc-4.2 MACOSX_DEPLOYMENT_TARGET=10.6"

      alias sitepack25="cd /Library/Frameworks/Python.framework/Versions/2.5/lib/python2.5/site-packages"
      alias sitepack26="cd /Library/Frameworks/Python.framework/Versions/2.6/lib/python2.6/site-packages"
      alias sitepack27="cd /Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages"

Notes:
------
  a)  The exports above can be used for building Python modules within a virtualenv with the Intel Mac OS X 10.6 compile tools.

  b)  The env aliases can be used for building system Python modules with pip for intel 32-bit, 64-bit or intel/fat builds
      (both 32-bit & 64-bit) with the latest Mac OS X 10.6 SDK, e.g.

          env64 pip install -M -r your-pip-requirements.txt

  c)  The sitepack aliases are useful to verify where packages are installed if you have multiple Python frameworks installed

3)  Install the following modules with your chosen system Python:
    a)  distribute (an improved version of setuptools/easy_install)
        -- installation notes: http://pypi.python.org/pypi/distribute#distribute-setup-py
        i)  e.g. for installing with Python 2.6 use:
              cd ~/some/temp/dir
              curl -O http://python-distribute.org/distribute_setup.py
              env64 python2.6 distribute_setup.py
        ii) hide /usr/bin/easy_install (if it exists) [as long as /usr/local/bin is earlier that /usr/bin in your env PATH]
            by adding links to your easy_install binary in /usr/local/bin, e.g.
              cd /usr/local/bin
              sudo ln -s /Library/Frameworks/Python.framework/Versions/2.6/bin/easy_install-2.6 easy_install-2.6
              sudo ln -s easy_install-2.6 easy_install
    b)  pip
        i)  with easy_install
              env64 easy_install -U pip
        ii) or with the pip installer: (see http://www.pip-installer.org/en/latest/installing.html)
              cd ~/some/temp/dir
              curl -O https://github.com/pypa/pip/raw/master/contrib/get-pip.py
              env64 python2.6 get-pip.py
    c)  virtualenv, virtualenvwrapper and supervisor
              cd akvo-rsr/repo/path
              env64 pip install -M -U -r scripts/deployment/pip/requirements/0_system.txt
    d)  verify the installed modules with:
              pip freeze
        which should produce something similar to this:
              distribute==0.6.15
              meld3==0.6.7
              supervisor==3.0a10
              virtualenv==1.6
              virtualenvwrapper==2.7.1
              wsgiref==0.1.2
