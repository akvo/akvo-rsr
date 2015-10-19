# Reportserver templates for RSR

These BIRT templates are intended to be installed on a ReportServer.

They were developed using the BIRT Report Designer plugin for Eclipse, version 4.4.

The RSR projects used as models were 2849 and its parent project 2081.

During development I found it convenient to:

## Set up a readonly account for the database
```
sudo -u postgres psql
postgres=#  create role rsr_readonly encrypted password '*************' login;
CREATE ROLE
postgres=# grant connect on database rsr to rsr_readonly;
GRANT
\c rsr
rsr=# grant usage on schema public to rsr_readonly;
GRANT
rsr=# grant select on all tables in schema public to rsr_readonly;
rsr=# grant select on all sequences in schema public to rsr_readonly;
GRANT
```


## Make an ssl tunnel to the DB server

```
ssh -L  1234:psql.test.akvo-ops.org:5432 gabriel@psql.test.akvo-ops.org
```
which allowed me to create a BIRT data source like this:
```
Driver Class: org.postgresql.Driver (v9.4)
Database URL: jdbc:postgresql://localhost:1234/rsr
User Name: rsr_readonly
Password: ***********
```






