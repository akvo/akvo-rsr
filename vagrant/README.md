# RSR Vagrant Development Environment 

## System setup

If you have never used Vagrant or the RSR Vagrant development environment, follow these steps first.

1. Ensure you have at least Vagrant version 1.2 installed:
    
       ~$ vagrant --version
	   vagrant version 1.2.2

   If you don't have Vagrant installed or if you have an old version installed, head over to http://vagrantup.com to get it.
   
2. Ensure you have Oracle VirtualBox installed. If not, you can get it here: https://www.virtualbox.org/wiki/Downloads

## First Start Up

The first time you use the RSR environment:

1. Run `scripts/devhelpers/setup_etc_hosts.sh` - this will add the necessary entries to your `/etc/hosts` file to be able to access the RSR server
2. Pull down the repository containing the puppet manifests by running `git submodule init` then `git submodule update`. You will now have a copy of the `akvo-provisioning` repository in a subfolder of `akvo-rsr` called 'provisioning'.
2. Go into the vagrant directory and start the Vagrant box: `cd vagrant` then `vagrant up`. The first time will take a long time, as it will install all of the required system packages and configure them (eg, nginx) and then install all of the required python packages into an RSR virtualenv.
3. Try out https://rsr.localdev.akvo.org/

## Using the environment

* When you are done developing, run `vagrant halt` to shut down the virtual machine, or it'll just sit there consuming system resources.
* Run `vagrant ssh` to ssh into the virtual machine. You will then be logged in as the `vagrant` user, who can use sudo without a password.
* The RSR application information is in `/var/akvo/rsr/`
* The `akvo-rsr` repository from your local machine is synced to the virtual machine, and the RSR application will restart when you make code changes.

## Useful scripts

There are a variety of useful scripts in `scripts/devehelpers`:

* `setup_etc_hosts.sh` will add the necessary IP/address combinations to your `/etc/hosts` file. `cleanup_etc_hosts.sh` will remove them again.
* `manage.sh` will connect to the virtual machine and run `python manage.py`. You can use it just like `python manage.py`, eg, `manage.sh shell`


