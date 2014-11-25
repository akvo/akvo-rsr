## A tour with vagrant:
We need to pull down a new base box with Postgres installed so, on the 
feature/813_postgres_v2 branch:
```shell
$ cd vagrant
$ vagrant destroy
$ git checkout -b feature/813_postgres_v2 origin/feature/813_postgres_v2
$ vagrant up
```

We need to configure the Django database settings to have both the old 
and the new. If on a vagrant box add a file 'akvo/settings/66_local.conf
and make sure it has the following DATABASES setting:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'rsr',
        'USER': 'rsr',
        'PASSWORD': 'password',
        'HOST': '192.168.50.101',
        'PORT': '5432',
    },

    'mysql': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'rsr',
        'USER': 'rsr',
        'PASSWORD': 'password',
        'HOST': 'mysql-localdev.localdev.akvo.org',
        'PORT': '',
    }
}
```

The migration script uses a config file. Since different deployments
will need different configs we use the "pg_migrate_conf.yml.template" template
as a base.

```shell
$ cd ..
$ cp pg_migrate_conf.yml.template pg_migrate_conf.yml
$ vi pg_migrate_conf.yml # edit if not using the vagrant settings
```

Now we created a template. If we are on a vagrant box the db password is 
'password'. We will use the password as an argument to the script. Let's 
run the migration!

```shell
$ cd vagrant
$ vagrant ssh
vagrant@rsr1:~$ cd /var/akvo/rsr/code
vagrant@rsr1:/var/akvo/rsr/code$ ./pg_migrate.sh password
```

The script should end with OK if things were OK! The log can be found in 
pg_tests.log

After this RSR should be runnable and working fine - however we do need
to handle mysql and clean up the settings!








