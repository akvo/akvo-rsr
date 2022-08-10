#!/usr/bin/env python3


# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

""" Expire all existing sessions

Usage:

    python manage.py expire_all_sessions

"""

# Adapted from https://gist.github.com/tclancy/10269504

import datetime
import importlib

from django.conf import settings
from django.contrib.auth import logout
from django.contrib.sessions.models import Session
from django.core.management.base import BaseCommand
from django.http import HttpRequest
from django.utils import timezone


def init_session(session_key):
    """
    Initialize same session as done for ``SessionMiddleware``.
    """
    engine = importlib.import_module(settings.SESSION_ENGINE)
    return engine.SessionStore(session_key)


class Command(BaseCommand):
    help = "Expire all active sessions"

    def handle(self, *args, **options):
        start = timezone.now() - datetime.timedelta(days=1)
        request = HttpRequest()
        sessions = Session.objects.filter(expire_date__gt=start)

        print(f'Found {len(sessions)} not-expired session(s).')

        for session in sessions:
            user_id = session.get_decoded().get('_auth_user_id')
            request.session = init_session(session.session_key)

            logout(request)
            print(f'Successfully logged out {user_id} user.')

        print('All OK!')
