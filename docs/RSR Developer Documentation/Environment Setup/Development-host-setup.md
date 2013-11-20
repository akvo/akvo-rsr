WORK IN PROGRESS

# Mac configuration
There is two things we need to make sure. The first is that Vagrant is installed and ready for use. Secondly is to make sure dev urls such as akvo.dev and akvo.akvoapp.dev resolves to the dev VM. This to be able to work with partner sites.<br>
<br>
We will use the Mac de facto package manager Homebrew. There is installation instructions on https://github.com/mxcl/homebrew/wiki/installation. Homebrew needs Xcode and the Command Line Tools, you’ll need to enable them under Preferences > Downloads in Xcode.

## Vagrant
Vagrant provides an easy way to handle Virtualbox VM's from your host machine. To run Vagrant on your Mac we need to install Virtualbox & Vagrant.

### Virtualbox
Download and install Virtualbox for Mac from https://www.virtualbox.org/wiki/Downloads.

### Vagrant
Download the Vagrant installer from http://downloads.vagrantup.com/ and run it. By default Vagrant stores it's data in ~/vagrant.d/boxes and the Virtualbox VMs in ~/VirtualBox VMs/.

## Nginx
We will use Nginx to route different .dev urls to different ips. If we only want to do RSR work then one can skip Nginx and just route all .dev urls to the RSR ip (33.33.33.15) instead of localhost.
Install & setup Nginx on your local Mac to proxy to the correct port (VM). We will use Homebrew but will need to alter the default start config to be able to run on port 80. We will follow the guide on http://leonid.shevtsov.me/en/how-to-install-nginx-over-pow-in-os-x

### Install Nginx
We want to run Nginx on port 80 and also have nginx start on boot. This needs some tweaking on OS X. 

Homebrew will instal nginx in /usr/local/sbin/ so make sure it's on your path. (Inspiration from - http://leonid.shevtsov.me/en/how-to-install-nginx-over-pow-in-os-x#ixzz20DNh95d7)
<pre>
> brew install nginx
> cd <your akvo-rsr root dir>
> sudo cp ./scripts/dev-vm/nginx/nginx.plist /Library/LaunchDaemons/nginx.plist
> sudo chown root /Library/LaunchDaemons/nginx.plist
> sudo launchctl load -w /Library/LaunchDaemons/nginx.plist
</pre>
Configure Nginx with our template (it's configured for general use)
<pre>
> cp /usr/local/etc/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf.backup
> cp ./scripts/dev-vm/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf
</pre>

### Configure Nginx
We will setup a default static virtualhost to handle localhost and static.dev on port 80. This means that you can put assets in /var/www/ and reach them at http://localhost or http://static.dev. We will copy a index.html into the folder to be able to verify that everything is working.
<pre>
> sudo mkdir /var/www && sudo chown -R `whoami`:staff /var/www
> cp ./scripts/dev-vm/nginx/www/index.html /var/www/index.html
</pre>
### Configure akvo.dev virtualhost
<pre>
> cp ./scripts/dev-vm/nginx/akvo.dev /usr/local/etc/nginx/sites-available/akvo.dev
> ln -s /usr/local/etc/nginx/sites-available/akvo.dev /usr/local/etc/nginx/sites-enabled/akvo.dev
</pre>

### Start nginx
<pre>
> lauchctl load -w /Library/LaunchDaemons/nginx.plist
</pre>

## /etc/hosts
<pre>
Add "127.0.0.1	dev" to your /etc/hosts file
</pre>

## Dnsmasq
<pre>
> brew install dnsmasq
</pre>
Add line to the top of /opt/local/etc/dnsmasq.conf:
<pre>
address=/.dev/127.0.0.1
</pre>
Make sure Dnsmasq is started on boot
<pre>
$ cp /usr/local/opt/dnsmasq/dnsmasq.conf.example /usr/local/etc/dnsmasq.conf
$ sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist
</pre>

## DNS setting
Make sure you to add 127.0.0.1 as your first DNS entry in 
System preferences - Network - Advanced - DNS
This sets up your computer as the first DNS server so if on a public WIFI with web authentication you should move the 127.0.0.1 entry down below the routers IP.