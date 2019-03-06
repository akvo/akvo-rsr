# RSR Docker Development Environment

## System setup

1. Install `docker`
2. Install `docker-compose`

## Starting Up

1. Run `docker-compose up --build`

2. Visit [http://localhost/](http://localhost/)

## FAQ

##### Q: How do I migrate or get a Django shell?

You can `exec` commands on the web host. `docker-compose exec web python
manage.py shell` for example.


##### Q: How do I access a partnersite?

You will need to add an entry to your `/etc/hosts` file (or Windows equivalent),
and point `<partner_hostname>.localakvoapp.org` to `127.0.0.1` - for example,
add this line to be able to access the EUTF partner site:

```
127.0.0.1 eutf.localakvoapp.org
```

##### Q: How do I update the Python package dependencies?

To temporarily install additional packages in the docker machine, you can run
`docker-compose exec web pip install <package_name>`. Note that this
installation is temporary, and all changes are lost when `docker-compose down`
is run.

To install add a new dependency, add it to `requirements.txt`.


##### Q: I get a 502! Why?

Ensure that RSR is running. Chances are, a 502 means that no RSR app is running.


##### Q: How do create a copy of the test/live DB for local testing?

See the instructions in the
[restore-elephantsql-dump-to-dev-env.sh](https://github.com/akvo/akvo-rsr/blob/develop/scripts/data/restore-elephantsql-dump-to-dev-env.sh#L3)
file.

## Helpful notes

* When you are done developing, run `docker-compose down` to stop and remove
  containers, networks, images, and volumes.

* Run `docker-compose exec web /bin/bash` to get a shell on the docker web host.

* The `akvo-rsr` repository from your local machine is synced to the virtual
  machine, and the RSR application will restart when you make code changes.

## Useful scripts

There are a variety of useful scripts in `scripts/devhelpers`.
