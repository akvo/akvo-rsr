#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Synchronizes the django-q schedules from the settings with those in the DB

New ones will be added to the DB
Modified ones will be modified in the DB
Schedules in the DB but missing in the settings will be removed from the DB

Usage:

    python manage.py sync_django_q_schedules

"""
from django.core.management.base import BaseCommand

from akvo.rsr.usecases.django_q.schedules import sync_with_settings


class Command(BaseCommand):
    help = __doc__

    def handle(self, *args, **options):
        sync_with_settings()
