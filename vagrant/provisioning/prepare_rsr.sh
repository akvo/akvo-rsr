# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please
# see < http://www.gnu.org/licenses/agpl.html >.

set -e

# Temporary Hack (see https://github.com/akvo/akvo-provisioning/issues/29)
sudo sed -i 's/SITE_ID=1$/SITE_ID=1004/' /var/akvo/rsr/local_settings.conf

supervisorctl restart rsr
# supervisorctl stop rsr
