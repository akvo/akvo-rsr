# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

""" Anonymize a user in  the DB.

Usage:

    python manage.py anonymize_user <user-id1>  [<user-id2>, ...]

"""

import sys

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Delete a user from the DB to comply with a GDPR request"

    def handle(self, *args, **options):

        if not args:
            print(__doc__)
            sys.exit(1)

        user_ids = map(int, args)

        for user_id in user_ids:
            user = User.objects.get(id=user_id)
            user.is_active = False
            user.set_password(None)
            email = 'user-{}@example.com'.format(user_id)
            user.first_name = user.last_name = 'User-{}'.format(user_id)
            user.username = email
            user.email = email
            user.save()
