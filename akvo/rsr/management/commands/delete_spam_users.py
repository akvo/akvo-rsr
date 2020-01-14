# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import datetime
import sys

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db.models import Count

User = get_user_model()


class Command(BaseCommand):
    help = "Delete spam users from the DB"

    def handle(self, *args, **options):
        """Delete spam user accounts from the DB.

        Deletes all users who joined more than a week ago, but don't have an
        employment associated with them.

        """

        last_week = datetime.datetime.today() + datetime.timedelta(days=-7)

        no_employment_users = User.objects.annotate(employer_count=Count('employers')).filter(
            date_joined__lt=last_week,
            employer_count=0
        )

        sys.stdout.write("Found {} spam users.".format(no_employment_users.count()))
        sys.stdout.write("\nDeleting ...\n")
        sys.stdout.flush()

        no_employment_users.delete()

        sys.stdout.write("\nDone!\n")
