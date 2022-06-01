#!/usr/bin/env python3

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import warnings

from django.core.management.base import BaseCommand
from django.db import transaction

from akvo.rsr.models import (
    Organisation,
)


class Command(BaseCommand):
    help = "Remove Netherlands Foreign Ministry which is a duplicate of the Dutch Foreign Ministry"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run", action="store_true", help="No action will be taken in the DB"
        )

    def handle(self, *args, **options):
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                self._handle(*args, **options)
        except InterruptedError:
            print("DRY RUN: No action was taken")

    @transaction.atomic()
    def _handle(self, *args, **options):
        dry_run = options.get("dry_run")
        if dry_run:
            print("DRY RUN: No action will be taken")

        original_org = Organisation.objects.get(id=464)
        duplicate_org = Organisation.objects.get(id=4596)

        self.stdout.write("Migrating partnerships of '%s' to '%s'" % (duplicate_org, original_org))
        for partnership in duplicate_org.partnerships.all().order_by("project__id"):
            partnership.organisation = original_org
            partnership.save()
            project = partnership.project
            self.stdout.write("\tPartnership(%s): %s - %s" % (partnership.id, project.id, project.title))

        self.stdout.write("Deleting org '%s'" % (duplicate_org, ))
        duplicate_org.delete()

        if dry_run:
            raise InterruptedError()
