# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# The following values describe the static project structure for RSR

import django, os


# Django paths, should never change
STATIC_DJANGO_DESTINATION = os.path.join(django.__path__[0])
MEDIAROOT_ADMIN_DESTINATION = os.path.join(STATIC_DJANGO_DESTINATION, 'contrib/admin/media')

# Main project paths
PROJECT_ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..'))
PROJECT_ROOT_DIR_NAME = PROJECT_ROOT_DIR.split(os.sep)[-1]
STATIC_DIR = os.path.realpath(os.path.join(PROJECT_ROOT_DIR, '../static'))
MEDIAROOT_DIR = os.path.join(PROJECT_ROOT_DIR, 'akvo/mediaroot')

# Configurable paths for the akvo web directory
WEB_DIR = '/var/www/akvo'
WEB_DB_DIR = os.path.join(WEB_DIR, 'db')
WEB_MEDIAROOT_DESTINATION = os.path.join(STATIC_DIR, 'akvo/mediaroot')

# Configurable paths for the static directory
STATIC_AKVO_DESTINATION = os.path.join('..', PROJECT_ROOT_DIR_NAME, 'akvo')
STATIC_AKVO_VIRTUALENV_DESTINATION = '/var/virtualenv/akvo'

# Configurable paths for the mediaroot directory and settings.py file
SETTINGS_FILE_DESTINATION = '../../static/settings.py'
STATIC_DIR_RELATIVE_TO_MEDIAROOT = '../../../static'
MEDIAROOT_DB_DESTINATION = os.path.join(STATIC_DIR_RELATIVE_TO_MEDIAROOT, 'db')
