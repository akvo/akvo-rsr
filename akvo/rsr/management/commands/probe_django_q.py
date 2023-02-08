#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Check if all django-q workers have been started

Usage:

    python manage.py probe_django_q

"""
import socket
from django.core.management.base import BaseCommand
from django_q.conf import Conf
from django_q.status import Stat


class Command(BaseCommand):
    help = __doc__

    def add_arguments(self, parser):
        parser.add_argument(
            '-a',
            '--all',
            action='store_true',
            help='Probe all clusters even non-local ones'
        )

    def handle(self, *args, **options):

        if options.get("all"):
            self.probe_all_clusters()
        else:
            self.probe_cluster()

    def probe_all_clusters(self):
        expected_worker_count = Conf.WORKERS
        self.stdout.write(f"expected worker count: {expected_worker_count}")
        self.stdout.write(f"cluster_id | status | current workers")
        self.stdout.flush()

        for stat in Stat.get_all():
            worker_count = len(stat.workers)
            self.stdout.write(f"{stat.cluster_id}|{stat.status}|{worker_count}")
            if self.cluster_started_all_workers(stat):
                exit(1)
            self.stdout.flush()

    def probe_cluster(self):
        hostname = socket.gethostname()

        # Find local cluster
        local_stat = next(iter(stat for stat in Stat.get_all() if stat.host == hostname), None)
        if not local_stat:
            self.stdout.write(f"Couldn't find cluster on local machine")
            return
        if not self.cluster_started_all_workers(local_stat):
            exit(1)

    def cluster_started_all_workers(self, stat: Stat) -> bool:
        expected_worker_count = Conf.WORKERS
        worker_count = len(stat.workers)
        has_all_workers = worker_count == expected_worker_count
        if not has_all_workers:
            self.stderr.write(f"cluster {stat.cluster_id} has {worker_count} of {expected_worker_count} workers")

        return has_all_workers
