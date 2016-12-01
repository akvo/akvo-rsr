# Behavioral Testing

This directory explains how to run the behavioral tests that have already been
written, and also how to write new tests.

This directory contains all the behavioral tests that have already been
written.  The tests are written using `behave` -- a behavioral testing
framework for Python.  `django-behave` provides a Django TestRunner for behave
BDD tests.  We use `splinter` to drive the browser and perform user actions.

## How to run the features

The tests can be run like all the other tests in the vagrant VM using the
`manage.sh` script.

```bash

cd scripts/devhelpers
./manage.sh test --testrunner=django_behave.runner.DjangoBehaveOnlyTestSuiteRunner akvo.rsr

```

## How to write tests

To write new tests you can either add new `Scenario`s to existing `Feature`s or
write new `Feature`s.

Look at the documentation of
(behave)[https://pythonhosted.org/behave/tutorial.html] to learn more about how
to write BDD tests.

### Running tests on local machine

To be able to write new tests, though, you would want to be able to see the
browser actions being performed.  To do this, you can run the tests on your
local machine instead of running it on the vagrant VM.  The following sections
describe how to use the tests using the `google-chrome` browser.

#### Setup local environment

First setup the local environment to be able to run the tests

```bash

# Create a virtualenv
virtualenv venv

# Activate the virtualenv
source venv/bin/activate

# Install dependencies
pip install -r scripts/deployment/pip/requirements/2_rsr.txt
pip install -r scripts/deployment/pip/requirements/3_testing.txt

```

#### Run tests

First, ensure that the local virtual environment has been activated.

```bash
# Activate the virtualenv
source venv/bin/activate
```

You will need to have the `chromedriver` executable on your `$PATH`.  You can
download the `chromedriver` executable compatible with your browser from
[here](https://sites.google.com/a/chromium.org/chromedriver/downloads).

```bash
export PATH=/dir/containing/chromedriver/executable:$PATH
```

Now, the tests can be run as below.  You should see a browser pop-up and the
tests running inside it.

```bash
python manage.py test -v3 --testrunner=django_behave.runner.DjangoBehaveOnlyTestSuiteRunner  --behave_verbose --behave_no-capture --behave_no-capture-stderr --behave_browser chrome akvo.rsr
```
