### Tools for development on Mac OS X:
1. Install [Xcode](https://developer.apple.com/xcode/) from the Mac App Store
1. Open Xcode and
   * Allow any further system library updates to be completed
   * Go to Preferences > Downloads > Components and ensure the Command Line Tools are installed
      * this will install compilation tools like gcc and development libraries such as libxml2, libxslt, etc. which are needed for compiling various Python packages later on
1. Install [MySQL 5.5](http://mysql.com/downloads/mysql) (select the Mac OS X 10.6, 64-bit, DMG archive)
1. Install [Python 2.7](http://python.org/download/releases) for Mac OS X
1. Setup Git and Github access:
   * Install [Git command-line tools](http://git-scm.com/download)
   * Create a [Github](http://github.com) account for yourself
   * Request access to the relevant [Akvo repositories](http://github.com/akvo) from one of the Akvo Dev team members
   * Setup your SSH keys or password caching and any further [repository configuration](http://help.github.com/mac-set-up-git)
   * Install a Git client app as necessary, e.g. [Github for Mac](http://mac.github.com) or [GitX](http://gitx.laullon.com)
1. Install [Homebrew](https://github.com/mxcl/homebrew/wiki/installation)
1. Install the following packages with Homebrew:
   * `brew install git-flow` (a git [branch management](http://nvie.com/posts/a-successful-git-branching-model) tool)
   * `brew install imagemagick` (installs system packages for building the [Python Image Library](http://pypi.python.org/pypi/PIL))

**Next:** [2. Setup a local development repository](Akvo-RSR-repository-setup)

**Back to:** [Akvo RSR developer guide](Akvo-RSR-developer-guide)