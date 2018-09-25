# -*- coding: utf-8 -*-

"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.

"""

import re

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class AuthBackend(ModelBackend):
    def authenticate(self, username=None, password=None, no_password=False, **kwargs):
        # Check the username-password combination and return a User.
        # The login can be either the username or the email of the user.
        email_regex = re.compile(r"[^@]+@[^@]+\.[^@]+")

        try:
            if email_regex.match(username):
                # Get user by email
                user = get_user_model().objects.get(email__iexact=username)
            else:
                # Get user by username
                user = get_user_model().objects.get(username__iexact=username)
        except get_user_model().DoesNotExist:
            return None

        if no_password:
            return user
        else:
            return user if user.check_password(password) else None
