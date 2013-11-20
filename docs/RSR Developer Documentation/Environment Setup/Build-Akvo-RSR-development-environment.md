### Rebuild your RSR virtualenv:

* Check that you have a local `develop` branch with `git branch -a`
* If necessary create a local copy of the `develop` branch with `git checkout -b develop origin/develop`, otherwise just switch to the `develop` branch with `git checkout develop`
* Run `scripts/deployment/builders/rebuild_osx_dev_env.sh` whenever you need to rebuild your local RSR [virtualenv](http://www.virtualenv.org) or update the required system Python packages
 to install or update the required Python packages to run a local RSR server instance.
* This script will:
  * update your system Python packages
  * create a new RSR virtualenv as necessary -- follow any prompts to setup local configuration files
  * update an existing RSR virtualenv

**Previous:** [2. Setup a local development repository](Akvo-RSR-repository-setup)

**Back to:** [Akvo RSR developer guide](Akvo-RSR-developer-guide)