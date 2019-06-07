# Training environments

This directory contains the scripts required to manage the RSR training environments.

There can be any number of training environments, which can either start with a preconfigured training set or with a copy of production data.

To prepare a training set, a new empty environment will be created and, using the RSR UI, the required organizations, projects, indicators, ... will be created. Once they are created, the database and media files will be packaged and available to create new environments.

## Usage

**Make sure that you are using the latest version of these scripts.** Should always run from the HEAD of `develop` branch.

From the directory containing this README.md file run:

    docker run --rm -it -w /data -v `pwd`:/data kiwigrid/gcloud-kubectl-helm:2.12.3-234.0.0-88 bash

Once the container has started, login to GCE with: 

    gcloud auth login

After that you can run:

1. `./list.sh` to see the running environments
1. `./delete-env.sh $environment` to delete an existing environment
1. `./new-env.sh $environment $db_to_use [$rsr_version]` to create a new environment. The parameters must be:
   1. environment: one of rsr1, rsr2, rsr3 or rsr4. 
   1. db_to_use: one of:
       1. empty: start with a completely empty DB, to prepare a training dataset.
       1. prod: start with a copy of the production DB and media.
       1. XXXX: start with training DB with this name.
   1. rsr_version: RSR version to run. If not provided, it will the current production version. 
   Note that the containers for this version must already exists (right now this means that it must be at least deployed to test).

### Login all the time is boring

You can mount your ~/.config at /home/gkh/.config to reuse your existing credentials. So add to the `docker run` command: 

    -v ~/.config:/home/gkh/.config

**Note that the scripts will modify the cluster that `gcloud/kubectl` points to**. Make sure that you switch your environment before running any command outside this container.
     
### Technical details

The architecture:

![setup](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/akvo/akvo-rsr/develop/ci/rsrchart/architecture.puml)

1. We use Helm to manage the different environments.
1. We do not update environments. We expect them to be deleted/recreated.
1. Training environments are in their own namespace so that we can limit the number of environments, by limiting the resources assigned to that namespace.
1. Right now the environment names and number are fixed due to some DNS/TLS/Ingress issue. This restriction will go away once we have LetsEncrypt in the Kubernetes cluster.
1. The production DB is restored using the latest backup, usually done at midnight every day. We use ElephantSQL API to fetch that backup.
1. The production media disk is snapshoted and copied to a new disk during the environment creation. This is done using gcloud cli. We create a new snapshot (instead of using the existing daily snapshot) so that we are sure that the media disk is "older" than the DB, so that there are no missing files.  
1. The media disk name of the production environment is hardcoded, as it is very unlikely that it will change.
1. The create/delete script have some logic to manage these disks.
1. There are less gunicorn threads in the training environments to save some memory.
1. Not implemented yet the training DB/media datasets, so we are missing something here.

### TODO

1. Maybe we should be reusing the Helm Charts to release to test and production
1. Maybe we do not need the test environment
1. The init DB scripts are modified versions of the scripts/data scripts. Maybe we should reuse them.