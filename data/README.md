# Vagrant content dump/load

This directory includes tools for dumping and loading data from the vagrantbox. The data we talk about is the database (postgres dump) & the user uploaded images & documents.

Both of these scripts are supposed to be executed from the vagrant box as the vagrant user. 

## dump.sh
Will generate a rsr_dump file in ./dump/rsr_dump.<timestamp>.tar.gz.
This file consist of
- db (user uploaded images)
- rsr.dump (Postgres dump)
- rsr.json (Django dump)


## load.sh
Expects a file ./dump/rsr_dump.tar.gz. This files requires the db directory and the rsr.dump Postgres dump but not the Django data dump.
These scripts are supposed to be run from the vagrant box. The load.sh script expects a file in dump/rsr_dump.tar.gz. Since load.sh adds date to the file a manual rename is needed!