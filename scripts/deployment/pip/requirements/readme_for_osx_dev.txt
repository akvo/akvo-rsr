Add the following exports and aliases to your Mac OS X ~/.profile or other shell profile file:

export ARCHFLAGS="-arch x86_64 -arch i386"
export CC=/usr/bin/gcc-4.2
export MACOSX_DEPLOYMENT_TARGET=10.6

alias env64="sudo env ARCHFLAGS='-arch x86_64' CC=/usr/bin/gcc-4.2 MACOSX_DEPLOYMENT_TARGET=10.6"
alias env32="sudo env ARCHFLAGS='-arch i386' CC=/usr/bin/gcc-4.2 MACOSX_DEPLOYMENT_TARGET=10.6"
alias envintel="sudo env ARCHFLAGS='-arch x86_64 -arch i386' CC=/usr/bin/gcc-4.2 MACOSX_DEPLOYMENT_TARGET=10.6"


Notes:
------
The exports above can be used for building Python modules within a virtualenv with the Intel Mac OS X 10.6 compile tools.

The aliases can be used for building system Python modules with pip for intel 32-bit, 64-bit or intel/fat builds (both 32-bit & 64-bit) with the latest Mac OS X 10.6 SDK, e.g.

    env64 pip install -M -r your-pip-requirements.txt
