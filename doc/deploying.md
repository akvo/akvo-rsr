# Deploying

We use SemaphoreCI to deploy to test and production

## Test

Deploying to https://rsr.akvotest.org is done automatically once a PR is merged to master.


## Production

Currently, we use the `master` branch to promote changes to production.
This a **manual** operation.

In order to deploy to [production](https://rsr.akvo.org), the docker image must exist in the docker registry.
At the moment, this is all tied to Akvo's private, docker registry on Google Cloud.

The docker image is created during the deployment to the test environment or simply by merging into `production`.

### Commands

**Requirements**

 - A [token from zulip](https://akvo.zulipchat.com/#settings/account-and-privacy) to send messages to the channel.
 - Access to Google Cloud (ask somebody from the DevOps team)

```shell
export ZULIP_TOKEN="YOURTOKENHERE"
ci/promote-test-to-prod.sh
```

### Sequence diagram

<!-- Edit with https://mermaid.live/ -->
```{uml} diagrams/deploying_sequence.puml```
