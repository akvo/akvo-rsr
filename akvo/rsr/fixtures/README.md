The `test_data.json` dump was created from a freshly provisioned database

Once, that has been done, the server needs to be run once because setup of some
groups happens on first-run (in urls.py?)

The data can be dumped using the following command.

    cd scripts/devhelpers
    ./manage.sh dumpdata --natural --exclude auth.permission --exclude contenttypes --indent 4 > ../../akvo/rsr/fixtures/test_data.json
