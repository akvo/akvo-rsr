WORK IN PROGRESS

# Intro
Vagrant provides base boxes for Ubuntu and we use the Precise 64 bit box, with a few small changes. All VM solutions have the notion of having some kind of client software to make the integration between VM and host smother, same for Virtualbox. Since the boxes Vagrant provide have an old version that don't match current Virtualbox we need to update the "Guest additions". Since updating the guest additions are not scriptable and we don't want to have to do a manual step every time we create a new VM. Since we need to create base boxes we also make sure to update & upgrade the software on the box before creating a new.

# Let's create a new basebox.
Kill the current box:
<pre>
$ vagrant destroy
</pre>
Start with opening the Vagrantfile (akvo-rsr project root).
Start by commenting the following lines (might be different name & url)
<pre>
config.vm.box = "akvo_rsr_12.04_64_4.18"
config.vm.box_url = "https://dl.dropbox.com/s/cf4huumpd2tangs/akvo_rsr_12.04_64_4.18.box?dl=1"
</pre>
To setup Vagrant to load a "bare" Ubuntu Precise box uncomment:
<pre>
# config.vm.box = "precise64"
# config.vm.box_url = "http://files.vagrantup.com/precise64.box"
# config.vm.boot_mode = :gui
</pre>
We don't want to provision a base box so comment the puppet configs:
<pre>
config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "dev-env/puppet/manifests"
    puppet.manifest_file = "dev.pp"
    puppet.module_path = "dev-env/puppet/modules"
    # puppet.options = "--verbose --debug"
    puppet.options = "--verbose"
end
</pre>
Then:
<pre>
> vagrant up
</pre>
This will prompt you for your admin password to be able to mount an NFS share on your filesystem. At the login screen use:
<pre>
precise64 login: "vagrant"
Password: "vagrant"
</pre>
In the Virtualbox window click the menu item "Install Guest Additions" from the Devices menu. This will mount the fake media with Guest additions on the VM.
<pre>
$ sudo apt-get update && sudo apt-get upgrade -y
$ sudo apt-get install linux-headers-$(uname -r) build-essential -y
$ sudo mount /dev/cdrom /media/cdrom
$ sudo sh /media/cdrom/VBoxLinuxAdditions.run
</pre>
The installation script will say that we need to restart and that X11 drivers fails - which is fine since there is no X11 installed.
<pre>
$ Building the OpenGL support module ...done.
$ Doing non-kernel setup of the Guest Additions ...done.
$ You should restart your guest to make sure the new modules are actually used

$ Installing the Window System drivers ...fail!
$ (Could not find the X.Org or XFree86 Window System.)
</pre>
You can now exit, reboot and then package a new box:
<pre>
$ exit
> vagrant reload
> vagrant package
</pre>
This creates a new package.box file in the current directory. This file "is" the base box.<br>

## Add box to Dropbox for sharing
Let's move the package.box file to the Vagrant boxes Dropbox folder (<dropbox root>/6. Development/Akvo Dev/Vagrant boxes/). Rename it as stated in Readme.txt. Let the file upload to Dropbox then grab the download link (not the share page).

## Update Vagrantfile
When you have the url to the base box on Dropbox it's time to update config.vm.box and config.vm.box_url Vagrantfile settings to match our new box. You should edit the ones that are commented and not the ones used for base box building.

The last thing we want to do is to swap to using our new base box. Do this by commenting the precise64 entries and uncomment your new settings and the puppet provision config.

You can now destroy the current box to then load the new one
<pre>
> vagrant destroy
> vagrant up
</pre>

Commit and push for everyone to use!