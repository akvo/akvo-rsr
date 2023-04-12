#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""
Provides a localhost HTTP server to query the local status of the django-q cluster
"""
import logging
import signal
import socket
from datetime import timedelta
from http.server import BaseHTTPRequestHandler, HTTPServer

from django.core.management.base import BaseCommand
from django.utils import timezone
from django_q.models import Success
from django_q.status import Stat

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = __doc__

    def handle(self, *args, **options):
        server = HTTPServer(("localhost", 8080), DjangoQRequestHandler)

        def handle_end(*_):
            logger.info("Stopping server")
            server.shutdown()

        signal.signal(signal.SIGINT, handle_end)
        signal.signal(signal.SIGTERM, handle_end)

        logger.info("Starting server...")
        server.serve_forever()


class DjangoQRequestHandler(BaseHTTPRequestHandler):
    """
    A handler to be used with HTTPServer to get the status of the local django-q cluster
    """

    def do_GET(self):
        """
        Handle GET requests to return response with the status code indicating django-q cluster is still running
        """
        if self.is_worker_running():
            self.send_response(200)
        else:
            self.send_response(500)
        self.end_headers()
        self.wfile.write(b'')

    def is_worker_running(self):
        hostname = socket.gethostname()

        # Find local cluster
        local_stat = next(iter(stat for stat in Stat.get_all() if stat.host == hostname), None)
        if local_stat:
            logger.info(f"Cluster status: {local_stat.status}")
            return True

        # Sometimes Stat.get_all() returns [] even though the cluster is still running.
        # Since we have tasks that runs every minute, we can use it to make sure.
        # Check to see if we have any successful result within the last 10 minutes.
        now = timezone.now()
        past = now - timedelta(minutes=10)
        results = Success.objects.filter(started__gte=past)
        logger.info(f"successful tasks within 10 minutes: {results.count()}")

        # If any results are returned, then the background worker is running!
        return results.exists()

    def log_message(self, format: str, *args) -> None:
        logger.debug(format, *args)
