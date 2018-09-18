# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth.signals import user_login_failed, user_logged_in
from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.mixins import TimestampsMixin


class LoginLog(TimestampsMixin):
    """Model to log login attempts of users."""

    success = models.BooleanField(
        _(u'login successful'),
        default=True,
        help_text=_(u'Log whether the login attempt was successful or not.')
    )
    email = models.EmailField(_(u'user email'))

    class Meta:
        ordering = ('-created_at',)


def log_failed_login(sender, credentials, **kwargs):
    """A signal receiver to log failed login attempts.

    3 failed logins before a successful login, sets the password to an unusable
    one, so that the user is forced to reset the password.

    """
    username = credentials['username']
    LoginLog.objects.create(success=False, email=username)

user_login_failed.connect(log_failed_login)


def log_succeeded_login(sender, user, **kwargs):
    """A signal receiver to log succeeded login"""
    LoginLog.objects.create(success=True, email=user.email)

user_logged_in.connect(log_succeeded_login)
