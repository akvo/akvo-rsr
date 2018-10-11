# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import timedelta

from django import forms
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.signals import user_login_failed, user_logged_in
from django.db import models
from django.utils.translation import ugettext_lazy as _, ungettext_lazy
from django.utils.timezone import now

from akvo.rsr.mixins import TimestampsMixin

MAX_FAILED_LOGINS = settings.MAX_FAILED_LOGINS
LOGIN_DISABLE_TIME = settings.LOGIN_DISABLE_TIME


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


def is_login_disabled(username):
    return count_failed_attempts(username) >= MAX_FAILED_LOGINS


def count_failed_attempts(username):
    failed_attempts = LoginLog.objects.filter(email=username, success=False)
    last_login = LoginLog.objects.filter(email=username, success=True).first()
    if last_login is not None:
        failed_attempts = failed_attempts.filter(created_at__gt=last_login.created_at)
    time_cutoff = now() - timedelta(seconds=LOGIN_DISABLE_TIME)
    failed_attempts = failed_attempts.filter(created_at__gt=time_cutoff)
    return failed_attempts.count()


def log_failed_login(sender, credentials, **kwargs):
    """A signal receiver to log failed login attempts.

    3 failed logins before a successful login, sets the password to an unusable
    one, so that the user is forced to reset the password.

    """
    username = credentials['username']
    User = get_user_model()
    try:
        email = User.objects.get(username=username).email
    except User.DoesNotExist:
        email = username
    LoginLog.objects.create(success=False, email=email)
    failed_logins = count_failed_attempts(username)
    if failed_logins >= MAX_FAILED_LOGINS:
        raise forms.ValidationError(
            _(u'Login has been disabled for %(time)d minutes') % {
                'time': LOGIN_DISABLE_TIME / 60.0
            }
        )

    else:
        remaining_logins = MAX_FAILED_LOGINS - failed_logins
        raise forms.ValidationError(
            ungettext_lazy(
                u'%(error)s You only have one more login attempt before login is disabled '
                u'for %(time)d minutes. '
                u'Make sure to enter your password correctly.',
                # Plural
                u'%(error)s You have %(count)d login attempts before login is disabled '
                u'for %(time)d minutes.',
                # Count
                remaining_logins
            ) % {
                'error': AuthenticationForm.error_messages['invalid_login'],
                'count': remaining_logins,
                'time': LOGIN_DISABLE_TIME / 60.0
            },
            code='invalid_login',
            params={'username': 'username'},
        )


user_login_failed.connect(log_failed_login)


def log_succeeded_login(sender, user, **kwargs):
    """A signal receiver to log succeeded login"""
    LoginLog.objects.create(success=True, email=user.email)


user_logged_in.connect(log_succeeded_login)
