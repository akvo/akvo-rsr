# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# Django settings for akvo project.
# The main part of settings is in settings_base.py that is loaded here
# In settings.py we keep server-specific settings

from settings_base import *

DATABASE_ENGINE = 'sqlite3'           # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
DATABASE_NAME = '/Users/gabriel/dev/0.9.7/akvo/data/akvo.sqlite3' # Or path to database file if using sqlite3.
DATABASE_USER = ''             # Not used with sqlite3.
DATABASE_PASSWORD = ''         # Not used with sqlite3.
DATABASE_HOST = ''             # Set to empty string for localhost. Not used with sqlite3.
DATABASE_PORT = ''             # Set to empty string for default. Not used with sqlite3.

DEBUG = True

SITE_ID = 1

DOMAIN_NAME = 'localhost:8000'
    
DEFAULT_FROM_EMAIL = 'noreply@%s' % DOMAIN_NAME

EMAIL_HOST          = 'mail.outbox.se'
EMAIL_HOST_USER     = 'gabriel@zezame.com'
EMAIL_HOST_PASSWORD = '40robberS'

INTERNAL_IPS = (
    '192.168.1.68   ', #'87.227.60.54', '192.168.38.68',
)

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = '/Users/gabriel/dev/media/mediaroot/'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"

MEDIA_URL = 'http://%s/rsr/media/' % DOMAIN_NAME

TEMPLATE_DEBUG = DEBUG

# PayPal settings
PAYPAL_DEBUG = True # Set to False in production
#PAYPAL_COMMAND = '_donations' # This defaults to '_donations'
#PAYPAL_CURRENCY_CODE = 'EUR' # This defaults to 'EUR'
PAYPAL_BUSINESS = 'thomas@akvo.org'
#PAYPAL_SANDBOX_BUSINESS = 'paul.b_1236517924_biz@gmail.com'
PAYPAL_SANDBOX_BUSINESS = 'paul.b_1236803589_biz@gmail.com'
PAYPAL_PRODUCT_DESCRIPTION_PREFIX = 'Akvo Project Donation: '
PAYPAL_SANDBOX_PRODUCT_DESCRIPTION_PREFIX = 'Akvo Project Test Donation: '
PAYPAL_NOTIFY_URL = 'http://%s/rsr/ipn/' % DOMAIN_NAME
PAYPAL_RETURN_URL = 'http://%s/rsr/ipn/thanks/' % DOMAIN_NAME
PAYPAL_CANCEL_URL = 'http://%s/' % DOMAIN_NAME
PAYPAL_SANDBOX_NOTIFY_URL = 'http://%s/rsr/ipn/' % DOMAIN_NAME
PAYPAL_SANDBOX_RETURN_URL = 'http://%s/rsr/ipn/thanks/' % DOMAIN_NAME
PAYPAL_SANDBOX_CANCEL_URL = 'http://%s/' % DOMAIN_NAME
#PAYPAL_IMAGE = 'https://www.sandbox.paypal.com/en_US/i/btn/btn_donate_LG.gif'
#PAYPAL_SANDBOX_IMAGE = 'https://www.sandbox.paypal.com/en_US/i/btn/btn_donate_LG.gif'
PAYPAL_IMAGE = 'http://%s/rsr/media/img/paypal_donate.gif' % DOMAIN_NAME
PAYPAL_SANDBOX_IMAGE = 'http://%s/rsr/media/img/paypal_donate.gif' % DOMAIN_NAME
PAYPAL_RECEIVER_EMAIL = DEFAULT_FROM_EMAIL

