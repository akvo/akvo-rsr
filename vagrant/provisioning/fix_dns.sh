set -e

sed -i '/nameserver/d' /etc/resolv.conf
echo 'nameserver 192.168.50.101' >> /etc/resolv.conf
cat /etc/resolv.conf