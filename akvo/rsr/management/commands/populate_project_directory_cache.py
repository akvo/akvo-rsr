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

from akvo.rest.views.project import serialized_project
from akvo.rest.cache import delete_project_from_project_directory_cache
from akvo.rsr.models import Country, Partnership, Project, ProjectLocation, RecipientCountry, Sector
from akvo.utils import build_dict


class Command(BaseCommand):
    help = __doc__

    def handle(self, *args, **options):
        start = time()
        projects = Project.objects.published().only(
            'id', 'title', 'subtitle',
            'current_image',
            'project_plan_summary',
            'primary_location__id',
            'primary_organisation__id',
            'primary_organisation__name',
            'primary_organisation__long_name',
            'primary_location__latitude',
            'primary_location__longitude',
        ).select_related(
            'primary_location',
            'primary_organisation',
        ).filter(id=2702)

        location_cache = build_dict(
            (location.location_target_id, location) for location in ProjectLocation.objects.all()
        )
        partnership_cache = build_dict((partnership.id, partnership) for partnership in Partnership.objects.all())
        recipient_country_cache = build_dict((country.id, country) for country in RecipientCountry.objects.all())
        sector_cache = build_dict((sector.project_id, sector) for sector in Sector.objects.all())
        country_cache = {country.id: country for country in Country.objects.all()}
        print(f"Making caches took {time() - start}")

        start = time()
        print(f"Populating project directory cache with {projects.count()} projects")
        for project in projects:
            project_start = time()
            delete_project_from_project_directory_cache(project)
            serialized_project(
                project,
                location_cache,
                partnership_cache,
                recipient_country_cache,
                sector_cache,
                country_cache,
            )
            print(f"project {time() - project_start}", flush=True)
        print(f"total: {time() - start}")
