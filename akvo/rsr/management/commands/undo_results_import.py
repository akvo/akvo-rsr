# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Undo results framework import for the specified projects

Usage:

    python manage.py undo_results_import <project-id1> [<project-id2> ...]

"""


import sys

from django.core.management.base import BaseCommand
from ...models import Result


class Command(BaseCommand):
    help = "Undo results framework import for the specified projects"

    def handle(self, *args, **options):
        if not args:
            print(__doc__)
            sys.exit(1)

        for id_ in map(int, args):
            results = Result.objects.filter(project__id=id_).exclude(parent_result=None)
            print("Deleting {} results for project {}".format(results.count(), id_))
            results.delete()
