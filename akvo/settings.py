# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# Django settings for akvo project.
# The main part of settings is in settings_base.py that is loaded here
# In settings.py we keep server-specific settings

from settings_base import *

DATABASE_ENGINE = 'mysql'           # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
DATABASE_NAME = 'rsrdb' 			# Or path to database file if using sqlite3.
DATABASE_USER = 'rsruser'             # Not used with sqlite3.
DATABASE_PASSWORD = 'u5r6vKSBwUxE4EMB'         # Not used with sqlite3.
DATABASE_HOST = ''             # Set to empty string for localhost. Not used with sqlite3.
DATABASE_PORT = ''             # Set to empty string for default. Not used with sqlite3.

DEBUG = True

DEFAULT_FROM_EMAIL = 'noreply@sandbox.akvo.org'

#INTERNAL_IPS = (
#    '87.227.60.54', '125.27.250.14', '192.168.38.68', '192.168.1.123',
#)

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = '/var/dev/akvo/mediaroot/'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = 'http://sandbox.akvo.org/rsr/media/'

TEMPLATE_DEBUG = DEBUG

# PayPal settings
PAYPAL_DEBUG = True # Set to False in production
#PAYPAL_COMMAND = '_donations' # This defaults to '_donations'
#PAYPAL_CURRENCY_CODE = 'EUR' # This defaults to 'EUR'
PAYPAL_BUSINESS = 'thomas@akvo.org'
PAYPAL_SANDBOX_BUSINESS = 'paul.b_1236517924_biz@gmail.com'
PAYPAL_PRODUCT_DESCRIPTION_PREFIX = 'Akvo Project Donation: '
PAYPAL_SANDBOX_PRODUCT_DESCRIPTION_PREFIX = 'Akvo Project Test Donation: '
PAYPAL_NOTIFY_URL = 'http://sandbox.akvo.org/rsr/ipn/'
PAYPAL_RETURN_URL = 'http://sandbox.akvo.org/rsr/ipn/thanks/'
PAYPAL_CANCEL_URL = 'http://sandbox.akvo.org/'
PAYPAL_SANDBOX_NOTIFY_URL = 'http://sandbox.akvo.org/rsr/ipn/'
PAYPAL_SANDBOX_RETURN_URL = 'http://sandbox.akvo.org/rsr/ipn/thanks/'
PAYPAL_SANDBOX_CANCEL_URL = 'http://sandbox.akvo.org/'
#PAYPAL_IMAGE = 'https://www.sandbox.paypal.com/en_US/i/btn/btn_donate_LG.gif'
#PAYPAL_SANDBOX_IMAGE = 'https://www.sandbox.paypal.com/en_US/i/btn/btn_donate_LG.gif'
PAYPAL_IMAGE = 'http://sandbox.akvo.org/rsr/media/img/paypal_donate.gif'
PAYPAL_SANDBOX_IMAGE = 'http://sandbox.akvo.org/rsr/media/img/paypal_donate.gif'
PAYPAL_RECEIVER_EMAIL = DEFAULT_FROM_EMAIL