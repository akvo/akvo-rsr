# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please
# see < http://www.gnu.org/licenses/agpl.html >.

set -e

rm -f /var/akvo/rsr/code
sudo -H -u rsr ln -s /vagrant/rsr/checkout /var/akvo/rsr/code

ln -sf /var/akvo/rsr/local_settings.conf /var/akvo/rsr/code/akvo/settings/65_puppet.conf
