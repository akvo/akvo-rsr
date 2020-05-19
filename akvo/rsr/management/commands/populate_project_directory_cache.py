#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Populate the project directory cache for all the projects.

Usage:

    python manage.py populate_project_directory_cache

"""

from django.core.management.base import BaseCommand

from akvo.rest.views.project import serialized_project
from akvo.rest.cache import delete_project_from_project_directory_cache
from akvo.rsr.models import Project


class Command(BaseCommand):
    help = __doc__

    def add_arguments(self, parser):
        parser.add_argument('action', choices=['clear', 'fill'], help='Action to perform')

    def handle(self, *args, **options):
        projects = Project.objects.public().published().values_list('pk', flat=True)

        if options['action'] == 'clear':
            for project_id in projects:
                delete_project_from_project_directory_cache(project_id)

        else:
            for project_id in projects:
                serialized_project(project_id)
