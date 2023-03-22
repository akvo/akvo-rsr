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
from http.server import BaseHTTPRequestHandler, HTTPServer

from django.core.management.base import BaseCommand
from django_q.conf import Conf
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

    def do_GET(self):
        hostname = socket.gethostname()

        # Find local cluster
        local_stat = next(iter(stat for stat in Stat.get_all() if stat.host == hostname), None)
        if local_stat:
            message = local_stat.status
        else:
            message = Conf.STOPPED
        logger.info(f"Sending {message}")
        self.send_response(200)
        self.end_headers()
        self.wfile.write(message.encode())
