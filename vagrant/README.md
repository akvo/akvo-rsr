# RSR Vagrant Development Environment 

## System setup

If you have never used Vagrant or the RSR Vagrant development environment, follow these steps first.

1. Ensure you have at least Vagrant version 1.2 installed:
    
       ~$ vagrant --version
	   vagrant version 1.2.2

   If you don't have Vagrant installed or if you have an old version installed, head over to [http://vagrantup.com](http://vagrantup.com) to get it.
   
2. Ensure you have Oracle VirtualBox installed. If not, you can get it here: [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)


## First Start Up

The first time you use the RSR environment:

1. Run `scripts/devhelpers/setup_etc_hosts.sh` - this will add the necessary entries to your `/etc/hosts` file to be able to access the RSR server

2. Go into the vagrant directory and start the Vagrant box: `cd vagrant` then `vagrant up`. The first time will take a long time, as it will install first download the base RSR virtual machine. Once this is done, it will update and install the required python packages if any have changed.

3. Try out [http://rsr.localdev.akvo.org/](http://rsr.localdev.akvo.org/)


## About the VM

The virtual machine is provisioned with the same [Puppet](http://puppetlabs.com/puppet/what-is-puppet) configuration as the produciton machines. This means that developing locally should take place using exactly the same setup as production.


## FAQ

##### Q: How do I connect to mysql?
**A**: From your main machine, you can use the script in `scripts/devhelpers/mysql.sh` which will connect you as root. You can also `ssh` into the machine (using `vagrant ssh`) and connect as root by using `sudo -H mysql`

##### Q: How do I see debug log output?
**A**: By default, the RSR django application is run by [gunicorn](http://gunicorn.org/) to match the production servers. However for development, it's much easier to use the django debug server. To do this, first stop the gunicorn process, then start the debug server:

        scripts/devhelpers/supervisorctl.sh stop rsr
        scripts/devhelpers/manage.sh runserver
         
##### Q: How do I migrate or get a Django shell?
**A**: There is a helper script at `scripts/devhelpers/manage.sh` which behaves exactly like the regular Django `python manage.py…`. It will ssh into the VM and execute the command you give it, eg `manage.sh migrate` or `manage.sh shell`

##### Q: How do I access a partnersite?
**A**: You will need to add an entry to your `/etc/hosts` file (or Windows equivalent), and point either `<partner_name>.localdev.akvo.org` or `<partner_name>.localakvoapp.org` to `192.168.50.101` -  for example, add this line to be able to access the Cordaid partner site:

       192.168.50.101 cordaid.localdev.akvo.org
       192.168.50.101 cordaid.localakvoapp.org
       
##### Q: How do I update the Python package dependencies?
**A**: The virtualenv on the virtual machine will be updated to match the `2_rsr.txt` file in your checkout when it is provisioned. This happens when the machine is booted (`vagrant up`) or you can make it happen manually by running `vagrant provision`. If you change it, for example to add a new dependency or bump a dependency version, `vagrant provision` will bring the virtualenv up to date.

##### Q: I get a 502! Why?
**A**: Ensure that RSR is running. You should either be using gunicorn or the Django development server. To see if gunicorn is running, run `scripts/devhelpers/supervisorctl.sh`. You will see `rsr      RUNNING` or similar if everythig is fine. Chances are, a 502 means that no RSR app is running.



## Helpful notes

* When you are done developing, run `vagrant halt` to shut down the virtual machine, or it'll just sit there consuming system resources.
 
* Run `vagrant ssh` to ssh into the virtual machine. You will then be logged in as the `vagrant` user, who can use sudo without a password.

* The RSR application information is in `/var/akvo/rsr/`

* The `akvo-rsr` repository from your local machine is synced to the virtual machine, and the RSR application will restart when you make code changes.


## Useful scripts

There are a variety of useful scripts in `scripts/devehelpers`:

* `setup_etc_hosts.sh` will add the necessary IP/address combinations to your `/etc/hosts` file. `cleanup_etc_hosts.sh` will remove them again.

* `manage.sh` will connect to the virtual machine and run `python manage.py`. You can use it just like `python manage.py`, eg, `manage.sh shell`

* `mysql.sh` will connect to the mysql server on the virtual machine as `root`

* `supervisorctl.sh` will connect you to the supervisor service, allowing you to manually start and stop RSR if it is running as a service.


