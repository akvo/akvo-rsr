# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os

from django.core.wsgi import get_wsgi_application


os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'
application = get_wsgi_application()
