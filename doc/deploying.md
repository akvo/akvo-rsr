# Deploying

We use SemaphoreCI to deploy to test and production

# Test

Deploying to https://rsr.akvotest.org is done automatically once a PR is merged to master.


# Production

In order to deploy to [production](https://rsr.akvo.org), the docker image must exist in the docker registry.
At the moment, this is all tied to Akvo's private, docker registry on Google Cloud.

The docker image is created during the deployment to the test environment, so that **must** have been done first.

<!-- Edit with https://mermaid.live/ -->
```mermaid
sequenceDiagram
    actor dev as developer
    participant local as local system
    participant github as Github
    participant semaphore as semaphoreCI
    participant kube as Google Kubernetes
    participant zulip

    dev ->> local:  checkout production branch
    
    dev ->> local: ci/promote-test-to-prod.sh
    activate local
        local ->> kube: get running versions
        activate kube
            kube -->> local: versions of TEST & PROD
        deactivate kube
        local ->> local: print github diff link
        local -->> dev: commands for git tag and zulip notif
    deactivate local

    dev ->> local: git tag

    dev ->> local: git push
    activate local
        local -->> github: tag
        activate github
        github ->> local: 
        local ->> dev: 
    deactivate local

    dev ->> local: notify through zulip
    activate local
        local ->> zulip: notify others
        activate zulip
            zulip ->> local: notified
        deactivate zulip
        local ->> dev: 
    deactivate local

    
    github ->> semaphore: new tag pushed
    activate semaphore
        semaphore -->> github: OK
        deactivate github
        semaphore ->> kube: deploy tagged version
        activate kube
            kube ->> semaphore: applying new config
        deactivate kube
        loop Until containers are ready
            semaphore ->> kube: please provide container status
            activate kube
                kube -->> semaphore: status
            deactivate kube
        end
    deactivate semaphore
```