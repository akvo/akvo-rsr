Scripts to load test RSR, that just probably work on my machine.


Files:

1. run-load-test.sh: to replay the production load against a server
1. compare-one-page.sh: compares output and performance of two servers for a given url
1. compare-all-pages.sh: compares a bunch of urls between two rsr servers, using the previous script
    1. Right now it compares rsr prod against rsr1 training environment
    1. Get the last prod logs: `gcloud logging read "logName=projects/akvo-lumen/logs/stdout AND resource.labels.cluster_name="production" AND resource.labels.container_name="rsr-nginx" AND NOT "Prometheus" AND NOT "robots" AND \" 200 \" AND NOT \"/my-rsr/main\" AND NOT \"/my-rsr/styles\"" --limit 2000 --format="list" | grep textPayload | cut -f2- -d: | cut -b2- > prod.logs.txt`
    1. Start the rsr1 training env (or modify the compara-one-page.sh script)
    1. Run the script
    1. Urls with different content will be written to `different.txt`
        1. You can manually check what is the difference by using the `compare-one-page.sh $url diff`
    1. Check rsr1 logs to see if there are new errors
    1. Script does not compare HTTP error codes, which it should
1. debug-performance/90-finish.conf: Log configuration that spits the DB requests made by Django.
1. debug-performance/request.sh: Makes a request against a local docker-compose env and stores the DB calls in a file
1. debug-performance/stats-db-calls.sh: basic stats for the previous DB calls file
1. debug-performance/diff-stats.sh: basic diff DB stats from two DB calls file
1. debug-performance/advanced-stats.clj: A more advance Clojure script that shows where the time is spent, not just the number of queries
