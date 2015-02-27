# Development
For local development Vagrant is used. The development env is loaded with a small fixture data set with [available accounts](docs/RSR%20Developer%20Documentation/Environment%20Setup/Accounts.md). To get from checkout to running server use these steps:

## Setup local settings
```shell
$ cp akvo/settings//66_local.template akvo/settings/66_local.conf
```

## Boot vagrant environment
This will download a vagrant box, provision the box with Puppet, download initial data and load that data. Hence this steps takes a while,
```shell
$ cd vagrant && vagrant up --provider=virtualbox
...
$ cd ..
```
Now open a browser and visist [http://rsr.localdev.akvo.org/](http://rsr.localdev.akvo.org/). We're now using the production Gunicorn webserver. For development the Django development server which gives you code reloading is really handy.

## Run a local devserver
To run the Django devserver with code reloading and getting prints
```shell
$ cd scripts/devhelpers
$ ./supervisorctl.sh stop rsr && ./manage.sh runserver
```

## Make sure assets are rebuilt on change (WIP)
To build assets we're relying on node.js and gulp. So with node and gulp available: 
```shell
$ cd scripts/devhelpers
$ npm install
$ gulp watch
```
