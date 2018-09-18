# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_login_failed, user_logged_in
from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.mixins import TimestampsMixin

# FIXME: Move to settings
MAX_FAILED_LOGINS = 3


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


def set_unusable_password(username):
    User = get_user_model()
    try:
        user = User.objects.get(email=username)
    except User.DoesNotExist:
        pass
    else:
        user.set_unusable_password()
        user.save()


def count_failed_attempts(username):
    attempts = LoginLog.objects.filter(email=username, success=False)
    last_login = LoginLog.objects.filter(email=username, success=True).first()
    if last_login is not None:
        attempts = attempts.filter(created_at__gt=last_login.created_at)
    return attempts.count()


def log_failed_login(sender, credentials, **kwargs):
    """A signal receiver to log failed login attempts.

    3 failed logins before a successful login, sets the password to an unusable
    one, so that the user is forced to reset the password.

    """
    username = credentials['username']
    LoginLog.objects.create(success=False, email=username)
    failed_logins = count_failed_attempts(username)
    from django import forms
    from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm
    if failed_logins >= MAX_FAILED_LOGINS:
        set_unusable_password(username)
        reset_form = PasswordResetForm(data=dict(email=username))
        reset_form.is_valid()
        reset_form.save()  # sends the password reset email to the user
        raise forms.ValidationError(
            # FIXME: translation text
            u'Your account password has been reset because of too many incorrect login attempts. '
            u'Please reset your password.',
            code='invalid_login',
            params={'username': 'username'},
        )
    else:
        remaining_logins = MAX_FAILED_LOGINS - failed_logins
        raise forms.ValidationError(
            # FIXME: translation text
            u'{}. Only {} login attempts remaining'.format(
                AuthenticationForm.error_messages['invalid_login'], remaining_logins
            ),
            code='invalid_login',
            params={'username': 'username'},
        )

user_login_failed.connect(log_failed_login)


def log_succeeded_login(sender, user, **kwargs):
    """A signal receiver to log succeeded login"""
    LoginLog.objects.create(success=True, email=user.email)

user_logged_in.connect(log_succeeded_login)
