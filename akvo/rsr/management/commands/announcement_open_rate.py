#!/usr/bin/env python3

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

""" Calculate the open rate for announcements

Usage:

    python manage.py announcement_open_rate announcement_tag release_date

"""

import datetime

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Calculate the open rate for a specific announcement"

    def add_arguments(self, parser):
        parser.add_argument(
            "announcement_tag", type=str, help="Tag for the announcment"
        )
        parser.add_argument(
            "release_date", type=str, help="Release date",
        )

    def handle(self, *args, **options):
        tag = options["announcement_tag"]
        release_date = datetime.datetime.strptime(
            options["release_date"], "%d-%m-%Y"
        ).date()
        # NOTE: We use the last login date here, under the assumption that we
        # are calculating the open rate only after a duration of 2 weeks of the
        # release date, which is the cookie expiry time for our sessions
        logged_in_users = User.objects.filter(last_login__gte=release_date)
        seen_users = User.objects.filter(seen_announcements__overlap=[tag])

        seen_count = seen_users.count()
        logged_in_count = logged_in_users.count()
        open_rate = (
            seen_users.count() / logged_in_count * 100 if logged_in_count > 0 else None
        )
        print(f"Seen count: {seen_count}")
        print(f"Logged in count: {logged_in_count}")
        print(f"Open rate: {open_rate}")
