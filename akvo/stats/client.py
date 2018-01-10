# Akvo RSR is covered by the GNU Affero General Public License. See more
# details in the license.txt file located at the root folder of the Akvo RSR
# module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.

from django.conf import settings
from statsd.client import StatsClient as StandardStatsClient


class StatsClient(StandardStatsClient):

    def __init__(self, *_):
        host = settings.STATSD_HOST
        port = settings.STATSD_PORT
        prefix = settings.STATSD_PREFIX
        StandardStatsClient.__init__(self, host, port, prefix)
