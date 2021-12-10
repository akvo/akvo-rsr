#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Populate the project directory cache for all the projects.

Usage:

    python manage.py populate_project_directory_cache

"""
from time import time
from django.core.management.base import BaseCommand

from akvo.rest.cache import serialized_project, delete_project_from_project_directory_cache
from akvo.rsr.models import Project


class Command(BaseCommand):
    help = __doc__

    def handle(self, *args, **options):
        projects = Project.objects.published().values_list('pk', flat=True)

        start = time()
        print(f"Populating project directory cache with {projects.count()} projects")
        for project_id in projects:
            print(f"project {project_id}", end=' ', flush=True)
            project_start = time()
            delete_project_from_project_directory_cache(project_id)
            print(f"{time() - project_start}", end=' ', flush=True)
            serialized_project(project_id)
            print(f"{time() - project_start}")
        print(f"total: {time() - start}")
