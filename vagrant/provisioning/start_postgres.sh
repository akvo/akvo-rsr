# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the
# Akvo RSR module. For additional details on the GNU license please
# see < http://www.gnu.org/licenses/agpl.html >.

# For whatever reason, postgres is unable to bind to the assigned IP
# address at the time the vagrant box starts up. Presumably networking
# is not ready at that point. Therefore it will fail, so we force it
# to start here.
/etc/init.d/postgresql start
