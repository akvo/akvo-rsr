# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please
# see < http://www.gnu.org/licenses/agpl.html >.

set -e

if [ ! -e /var/akvo/rsr/venv ]
then
    sudo -H -u rsr virtualenv --quiet /var/akvo/rsr/venv
fi

sudo -H -u rsr /var/akvo/rsr/venv/bin/pip install -r /var/akvo/rsr/code/scripts/deployment/pip/requirements/2_rsr.txt
