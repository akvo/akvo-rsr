Scripts to load test RSR, that just probably work on my machine.

Not making them production ready yet as we are using the CloudVPS logs, so we will wait until we have moved to k8s.

Files:

1. run-load-test.sh: to replay the production load against a server
1. compare-one-page.sh: compares output and performance of two servers for a given url
1. compare-all-pages.sh: compares a bunch of urls, using the previous script
1. debug-performance/90-finish.conf: Log configuration that spits the DB requests made by Django.
1. debug-performance/request.sh: Makes a request against a local docker-compose env and stores the DB calls in a file
1. debug-performance/stats-db-calls.sh: basic stats for the previous DB calls file
1. debug-performance/diff-stats.sh: basic diff DB stats from two DB calls file
1. debug-performance/advanced-stats.clj: A more advance Clojure script that shows where the time is spent, not just the number of queries

