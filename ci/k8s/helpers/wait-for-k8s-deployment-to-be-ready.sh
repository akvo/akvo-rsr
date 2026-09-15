#!/usr/bin/env bash
set -euo pipefail

# Wait for the rolling update to finish.
#
# `kubectl rollout status` returns only once the new ReplicaSet is fully
# available and the old one has scaled down — which is exactly the condition
# the previous hand-rolled poll loop was approximating, one `kubectl get pods`
# call at a time.
#
# That loop gave up after a fixed five minutes and then printed a pod dump. On
# the first GitHub Actions deploy the dump showed every container ready=true:
# the rollout had succeeded, but the nodes were cold-pulling an image tag they
# had never seen, and the loop simply ran out of clock. Ten minutes covers a
# cold pull. A rollout that genuinely fails still fails here, reported in
# kubectl's own words instead of as a list of pod names to interpret.
kubectl rollout status deployment/rsr --timeout=10m
