WORK IN PROGRESS (in the feature/dev-env branch)

## We want to 
* be able to develop in a production-like environment (Ubuntu, Mysql, ...)
* be able to protoype/test ideas and the ability to go back to a prior state
* make it easier to get up and started with RSR development

## Virtual machines to the rescue 
We will use [Virtualbox](https://www.virtualbox.org/) (free) and the help application [Vagrant](http://vagrantup.com)

# Get started 
<pre>
> # on the host computer (only tested with Mac OS 10.8)
$ # on the Virtualbox Ubuntu VM
</pre>
With a [configured](Development host setup) host computer:
<pre>
> cd (where you want to have your RSR project)
> git clone git@github.com:akvo/akvo-rsr.git
> git checkout -b feature/dev-env origin/feature/dev-env
> vagrant up # Will download a base box (500MB+)
</pre>
There is four scripts that will setup your environment. Each script only do one thing so if you already have all image assets on your computer you can skip to download them again. The first two scripts should be executed on the host (Mac) - and will use ssh privileges and requires an account at test.akvo.org.
<pre>
> ./dev-env/1-on-host-download-assets.sh # Will download all user images(3.6GB+)
> ./dev-env/2-on-host-load-db.sh # Needs to be created from the template, will use the database on test
> vagrant ssh
</pre>
This will leave in a ssh session on the ubuntu VM as user "vagrant".<br>
We can continue on the vagrant VM:
<pre>
$ cd /var/akvo # Mount point for the shared directory
$ ./dev-env/3-on-client-copy-assets.sh # Copy from host owned to vagrant box owned directory
$ ./dev-env/4-on-client-build-venv.sh # Build a virtualenv
$ ./venv/bin/activate # Activate the new virtualenv
$ ./start-dev-server.sh
</pre>
RSR should now be reachable on http://akvo.dev and http://akvo.akvoapp.dev. If you skipped to configure DNS on the host computer then http://33.33.33.15 will also work for non partner sites. On the VM Nginx is setup to handle port 80 and the Django dev server is running on port 1337<br>
<br>
To end session - kill the dev server and:
<pre>
$ deactivate # Optional - but will drop out from the virtualenv, 
$ exit
> vagrant suspend
</pre>
To resume the VM
<pre>
> vagrant resume
</pre>

## More
[Sahara](https://github.com/jedi4ever/sahara) makes it super simple to make use of the snapshot/rollback nature of working with VMs with Vagrant.

## Links
[Vagrant](http://vagrantup.com)
[Virtualbox](https://www.virtualbox.org)
[Sahara](https://github.com/jedi4ever/sahara)
[Puppet](http://puppetlabs.com)

## Base boxes
[How to create a new base box](Development-VM-base-box)