# Reportserver templates for RSR

These BIRT templates are intended to be installed on a ReportServer.

They were developed using the BIRT Report Designer plugin for Eclipse, version 4.4.

The RSR projects used as test cases were #2849 and its parent project #2081.


## Deployment to reportserver
The reports have one parameter, ID, which is created on the RS as a Dataset parameter, key=ID, BIRT, query="select id from rsr_project order by id desc"



## Access by URL

https://reporting.test.akvo-ops.org/reportserver/reportserver/httpauthexport?key=project_results&user=user1&password=unicorns&format=pdf&download=false&p_TheProjectId=2081

Since this exposes a password, even if just a dummy one, it should be hidden behind the rsr nginx proxy which can append the key/username/password query parameters. A proxy rule like this should do it, as the original query parameters will be copied over:
```
location /report/project {
        proxy_pass https://reporting.test.akvo-ops.org;
        rewrite ^/en/reports/(.*)/(.*)$ /reportserver/reportserver/httpauthexport?key=$1&user=user1&password=unicorns&p_ID=$2 break;
}
```
The URL will then be rewritten to something like
``` https://rsr.akvo.org/en/reports/project_results/2849?format=pdf ```
where format can be one of [WORD, PDF, HTML, PNG, EXCEL].


During development I found it convenient to:

### Set up a readonly account for the database
```
sudo -u postgres psql
postgres=#  create role rsr_readonly encrypted password '*************' login;
postgres=# grant connect on database rsr to rsr_readonly;
\c rsr
rsr=# grant usage on schema public to rsr_readonly;
rsr=# grant select on all tables in schema public to rsr_readonly;
rsr=# grant select on all sequences in schema public to rsr_readonly;
```


### Make an ssl tunnel to the DB server

```
ssh -L  1234:psql.test.akvo-ops.org:5432 stellan@psql.test.akvo-ops.org
```
which allowed me to create a BIRT data source like this:
```
Driver Class: org.postgresql.Driver (v9.4)
Database URL: jdbc:postgresql://localhost:1234/rsr
User Name: rsr_readonly
Password: ***********
```






