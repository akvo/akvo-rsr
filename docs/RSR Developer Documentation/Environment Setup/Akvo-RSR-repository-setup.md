### Setup for local development repositories:
1. Clone the [Akvo RSR repository](http://github.com/akvo/akvo-rsr) to a local folder, e.g. ~/Dropbox/dev/akvo/repos:

        cd ~/Dropbox/dev/akvo/repos
        git clone https://github.com/akvo/akvo-rsr.git

   If you get any permissions errors, ensure you've followed the [Akvo RSR development tools guide](Akvo-RSR-development-tools)
1. Once you've cloned the repository, initialise it with [git flow](http://nvie.com/posts/a-successful-git-branching-model/):

        cd akvo-rsr
        git flow init

1. When prompted, use the default values, **except** for the **Version** tag prefix, which is **"v"**:

        Branch name for production releases: [master]
        Branch name for "next release" development: [develop]

        How to name your supporting branch prefixes?
        Feature branches? [feature/] 
        Release branches? [release/] 
        Hotfix branches? [hotfix/] 
        Support branches? [support/] 
        Version tag prefix? [] v

1. After git flow initialisation, you'll be in the **develop** branch.  To start development on a new feature use:

        git flow feature start shiny_new_feature

   This will create a new branch off the develop branch called: **feature/shiny_new_feature**
1. When you're done coding your new feature, push the finished work to the develop branch with:

        git flow feature finish shiny_new_feature

1. Examples of more git flow commands are [here](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow).
1. To use this repository with [Github for Mac](http://mac.github.com):
   * If you're using Github for Mac for the first time, follow the prompts to set your Github details and to locate any existing git repositories on your file system.
   * If you've already been using the Github app, add the repository you've just cloned from:

            Preferences >> Repositories >> Scan for repositories

**Next:** [3. Build your local development environment](Build-Akvo-RSR-development-environment)

**Previous:** [1. Tools for Akvo RSR development on Mac OS X](Akvo-RSR-development-tools)

**Back to:** [Akvo RSR developer guide](Akvo-RSR-developer-guide)