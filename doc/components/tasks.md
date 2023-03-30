# Task management

Tasks are handled by [django-q].

For that, we need a django-q "cluster".
Right now we use one node.
These are the related files

| File                                                 | Purpose                     | Environment | 
|------------------------------------------------------|-----------------------------|-------------|
| [start-django.sh][start-test]                        | Starts RSR in the container | Local       |
| [start-django.sh][start-prod]                        | Starts RSR in the container | Prod / Test |
| [docker-compose.override.yaml][dc-override]          | Local worker service        | Local       |
| [deployment.yaml]                                    | K8s container               | Prod / Test |
| [41-django-q.conf]                                   | Configuration file          | All         |
| [`worker.sh`][worker probe]                          | Health probe                | All         |


## Starting up 

The worker container is started with the same script as the web container.
The only difference is the `IS_WORKER` env variable.

That starts

 - [probe server](#probe-server)
 - [django-q cluster]

## Probe server

This is a simple HTTP server to quickly query the status of the cluster.
It was written for two reasons:

 - the django-q cluster provides no script to query its status
 - django-admin commands are excruciatingly slow (5-10) seconds startup time).
   Too slow for a probe

It's started with [`akvo.rsr.management.commands.django_q_probettp`](#django_q_probettp).

The server is probed by docker and k8s using the [`worker.sh` probe][worker probe]

[41-django-q.conf]: https://github.com/akvo/akvo-rsr/blob/master/akvo/settings/41-django-q.conf
[deployment.yaml]: https://github.com/akvo/akvo-rsr/blob/66eaa83ccd769a576c5d167547ae21fe8f85a006/ci/k8s/deployment.yml#L206-L226
[dc-override]: https://github.com/akvo/akvo-rsr/blob/master/docker-compose.override.yml
[django-q]: https://django-q.readthedocs.io/en/latest/
[django-q cluster]: https://django-q.readthedocs.io/en/latest/cluster.html
[start-test]: https://github.com/akvo/akvo-rsr/blob/66eaa83ccd769a576c5d167547ae21fe8f85a006/scripts/docker/dev/start-django.sh#L31 
[start-prod]: https://github.com/akvo/akvo-rsr/blob/66eaa83ccd769a576c5d167547ae21fe8f85a006/scripts/docker/prod/start-django.sh#L42 
[worker probe]: https://github.com/akvo/akvo-rsr/blob/master/scripts/probes/worker.sh
