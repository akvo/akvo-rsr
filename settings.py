# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# Django settings for akvo project.
# The main part of settings is in settings_base.py that is loaded here
# In settings.py we keep server-specific settings

from settings_base import *

DATABASE_ENGINE = 'mysql'           # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
DATABASE_NAME = 'rsrdb' # Or path to database file if using sqlite3.
DATABASE_USER = 'rsruser'             # Not used with sqlite3.
DATABASE_PASSWORD = 'u5r6vKSBwUxE4EMB'         # Not used with sqlite3.
DATABASE_HOST = ''             # Set to empty string for localhost. Not used with sqlite3.
DATABASE_PORT = ''             # Set to empty string for default. Not used with sqlite3.

DEBUG = True

DEFAULT_FROM_EMAIL = 'noreply@dev.akvo.org'

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = '/var/dev/akvo/mediaroot/'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = 'http://dev.akvo.org:8080/rsr/media/'

TEMPLATE_DEBUG = DEBUG