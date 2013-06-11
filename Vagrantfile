# -*- mode: ruby -*-
# vi: set ft=ruby :

$whoami = `whoami`.strip
$hosthost = `hostname`.strip
$hostname = $whoami + '.' + $hosthost + '.localdev.akvo.org'

Vagrant.configure("2") do |config|
    config.vm.box = "precise64"
    config.vm.box_url = "http://files.vagrantup.com/precise64.box"
    config.vm.hostname = $hostname
    config.ssh.forward_agent = true

    config.vm.synced_folder "provisioning/environments/", "/vagrant/bootstrap/"
    config.vm.synced_folder "provisioning", "/puppet/checkout"
    config.vm.synced_folder ".", "/vagrant/rsr/checkout/"

    config.vm.network :private_network, ip: "192.168.50.101"

    config.vm.provision :shell do |s|
        s.path = "provisioning/environments/bootstrap_vagrant.sh"
        s.args = "localdev_rsr"
    end

    config.vm.provision :shell, :path => "scripts/dev/provision_vagrant.sh"

end

