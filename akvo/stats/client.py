from django.conf import settings
from statsd.client import StatsClient as StandardStatsClient


class StatsClient(StandardStatsClient):

    def __init__(self, *_):
        host = settings.STATSD_HOST
        port = settings.STATSD_PORT
        prefix = settings.STATSD_PREFIX
        StandardStatsClient.__init__(self, host, port, prefix)
