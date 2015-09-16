# Akvo Really Simple Reporting (Akvo RSR)

![Build status](http://ci.akvo.org/app/rest/builds/buildType:(id:SanitationCompass_Test)/statusIcon)

[Akvo RSR](http://akvo.org/products/rsr/) (Really Simple Reporting) is an online communication, collaboration and reporting hub for development aid projects with a strong focus on [IATI](http://iatistandard.org). Akvo RSR is a web and Android-based system, this repo is the web based Django backend. The Android app can be found in [Akvo Up](https://github.com/akvo/akvo-rsr-up).

## Quickstart
Do we need to setup .scripts/devhelpers/setup_etc_hosts.sh?

```bash
$ cp akvo/settings/66_local.template akvo/settings/66_local.conf
$ cd vagrant
$ vagrant up
```
Now open a browser & hit [http://rsr.locadev.akvo.org](http://rsr.locadev.akvo.org). For the test data set loaded by default use [accounts](accounts.md). In the contributing section bellow there are more examples on running Akvo RSR with development server and how to generate front end assets.

## REST API
A REST API is available at (http://localdev.akvo.org/rest/v1/)[http://localdev.akvo.org/rest/v1/] built using [Django REST Framework](http://www.django-rest-framework.org). An API key can be generated in the Django admin.


## Contributing
In the large Akvo RSR has a roadmap defined by the Akvo Foundation, product designs are made in the Akvo product design repo. More focused work are managed via Github and Waffle. Github issues are clustered into Github Milestones which imply a release of Akvo RSR. Issues in the current milestone gets a ready label which makes the issues located in the ready column in Waffle. On the Waffle board issues then are moved from left to right from ready to done.

- In progress - work are performed in a feature branch
- Needs review - there is pull request from the feature branch to develop to be reviewed
- Done - issue merged into develop (not deployed or accepted tested)

### Tools
- [Akvo product design repo](http://github.com/akvo/akvo-product-design)
- [Github Milestones](https://github.com/akvo/akvo-rsr/milestones)
- [Github Issues](http://github.com/akvo/akvo-rsr/issues/)
- [Waffle board](http://waffle.io/akvo/akvo-rsr)

### Code collaboration
To start work on a feature branch develop, do your work then issue a PR to develop. Before a release we create a release candidate. Once that is tested it get's merged into master and deployed to production.
The flow looks like this:
develop -> feature branch -> develop -> release candidate -> master

'develop' works as integration branch. Work is then performed in feature branches named '#123-small-fix' where 123 is the Github issue number. The convention with a leading '#' was adopted since Waffle is happier that way.

```bash
$ git pull origin develop
$ git checkout -b \#<issue number>-<short-description> origin/develop
$ git commit -m "[Fixes #<issue number>] Commit message"
$ git push origin \#<issue number>-<short-description>
```
Now create a PR and assign an eagle eyed Akvo developer.

### Django development server
We'll pick up where the quick example ended. Let's stop the rsr service and start the Django development web server, this will enable console output for things like logs & email. in scripts/devhelpers there are two scripts manage.sh & supervisord.sh that proxy to the vagrant box versions of the Django manage.py and supervisord via the SSH.

```bash
$ cd ../scripts/devhelpers
$ ./supervisord.sh stop rsr
$ ./manage.sh runserver
```
[http://rsr.locadev.akvo.org](http://rsr.locadev.akvo.org) will now be served by the Django development server.

### Front end assets

If we want to make changes to JavaScript files or CSS we need to setup the front end pipeline. The asset pipeline consistes of two modules, Gulp & [Django pipeline](https://django-pipeline.readthedocs.org/en/latest/). Gulp handles watching, transpiling & linting. Django Pipeline takes the transpiled files and depending on the configuration serves them in development mode or bundles them for production usage. For development using the Django config setup in the quick start section we don't need to care about the Django Pipeline part. Pipeline modules is however configured in [40-pipeline.conf](akvo/settings/40-pipeline.conf) & one can utilise it via ./manage.sh collectstatic.

We're using [Gulp](http://gulpjs.com) and the Gulpfile is located in scripts/devhelpers. To be able to run the gulp script Node.js & Gulp needs to be installed. There is a lot of ways to do this, depending on platform and preference. Since OS X is the most common Akvo dev platform here is an example on how to enable the asset pipeline on OS X via [homebrew](http://brew.sh).

```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" # Do realise that this exetues a remote script
$ brew install node
$ npm install --global gulp
$ npm install # installs node modules defined ./package.json (Gulpfile dependencies)
$ gulp watch # watch akvo/rsr/static/scripts-src/ & akvo/rsr/static/styles-src/
```
The Gulp watch task will:

1. compile sass files to css
2. compile jsx files to js
3. run lint on js files

### Tests
```bash
$ ./manage.sh test akvo.rsr
```

### Vagrant data dump/load
data/ includes tools for dumping and loading data from the vagrantbox. The data we talk about is the database (postgres dump) & the user uploaded images & documents.

Both of these scripts are supposed to be executed from the vagrant box as the vagrant user!

#### dump.sh
Will generate a rsr_dump file in ./dump/rsr_dump.<timestamp>.tar.gz.
This file consist of
- db (user uploaded images)
- rsr.dump (Postgres dump)
- rsr.json (Django dump)

##### load.sh
Expects a file ./dump/rsr_dump.tar.gz. This files requires the db directory and the rsr.dump Postgres dump but not the Django data dump.
These scripts are supposed to be run from the vagrant box. The load.sh script expects a file in dump/rsr_dump.tar.gz. Since load.sh adds date to the file a manual rename is needed!

#### simple-load.sh
Only loads new postgres data. Expects a postgres dump in data/dump/rsr.dump

### Django debug toolbar
In the 66_local.conf the Django debug toolbar can be enabled by uncomment relevant lines. Do
notice that provisioning will not work if the debug toolbar is enabled & it's very easy to forget
that it's enabled!

### Python style guide
Try and follow PEP8 & keep within 100 chars!

### Translations


## Links
* [RELEASE_NOTES](RELEASE_NOTES.md)
* [AUTHORS](AUTHORS.txt)
* [LICENSE](LICENSE.md)




------------------------------------------------------------------------------

README.md v1.3, 9 April 2014 [ogl, adriancollier]

# Akvo Really Simple Reporting (Akvo RSR)

![Build status](http://ci.akvo.org/app/rest/builds/buildType:(id:SanitationCompass_Test)/statusIcon)

Akvo Foundation is a non-profit foundation that builds open source internet and mobile phone software which is used to make international development cooperation and governance more effective and transparent.

Akvo RSR is part of the Akvo platform. Akvo RSR is a web and Android-based system that makes it easy for international development teams to bring complex networks of projects online and instantly share progress with everyone involved and interested.

We believe that Akvo RSR can be used in many other scenarios, including environmental programs and monitoring.

Read more about [Akvo Products](http://akvo.org/products/).

More information in these files:

* [RELEASE_NOTES](RELEASE_NOTES.md)
* [AUTHORS](AUTHORS.txt)
* [LICENSE](LICENSE.md)
* [DEVELOPMENT](DEVELOPMENT.md)
* [INSTALL](INSTALL.md)
