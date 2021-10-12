# PyCharm

This project also works well with [Jetbrains' PyCharm IDE][pycharm].

## Setting up remote Python interpreter

[Following the tutorial][remote interpreter], there are only minor modifications we need to make for this project.

![Remote interpreter setup](images/pycharm/interpreter.png)

 - Add `docker-compose.override.yml` to the files
 - Select the `web` service

![Interpreter path mappings](images/pycharm/interpreter_path_mappings.png)

Once the interpeter is added, map the local path to the path in the docker container.

## PyCharm django support

PyCharm has additional support for [django related features][pycharm django].
Our specific config looks like this

![django support config](images/pycharm/settings_django.png)

## Running docker-compose services

It's possible to control many aspects of docker within PyCharm (and other JetBrains products).
Simple ones include starting, stopping, killing, and scaling up services.
It's also possible to start terminals in services (equivalent of `docker-compose exec $service bash`).

We do however need to make PyCharm aware of the `docker-compose.override.yaml`.

![docker-compose run override](images/pycharm/docker-compose_rsrdbhost.png)

## Running tests

With django support activated, we can run tests right from a file or a folder (module or package).

![Run tests](images/pycharm/test-run.png)

[pycharm]: https://www.jetbrains.com/pycharm/
[pycharm django]: https://www.jetbrains.com/help/pycharm/2021.2/django-support7.html
[remote interpreter]: https://www.jetbrains.com/help/pycharm/2021.2/using-docker-as-a-remote-interpreter.html
