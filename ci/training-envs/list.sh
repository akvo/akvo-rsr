#!/usr/bin/env bash

gcloud container clusters get-credentials test --zone europe-west1-d --project akvo-lumen

helm list --namespace rsr-demo