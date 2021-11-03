# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.core import signing
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string


REGISTRATION_SALT = getattr(settings, 'REGISTRATION_SALT', 'akvo.registration')


def generate_key(obj, salt):
    """
    Generate the activation key which will be emailed to the user.
    """
    return signing.dumps(obj=obj, salt=salt)


def validate_key(activation_key, salt, max_age):
    """
    Verify that the activation key is valid and within the permitted activation time window,
    returning the signed object if valid or ``None`` if not.
    """
    try:
        return signing.loads(activation_key, salt=salt, max_age=max_age)
    except signing.BadSignature:
        return None


def get_inactive_user(email):
    User = get_user_model()
    try:
        return User.objects.get(email=email, is_active=False)
    except User.DoesNotExist:
        return None


def send_activation_email(user, site):
    """
    Send the activation email. The activation key is the user's email address,
    signed using TimestampSigner.
    """
    activation_key = generate_key(user.email, REGISTRATION_SALT)
    context = {
        'activation_key': activation_key,
        'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS,
        'user': user,
        'site': site
    }
    subject = render_to_string('registration/activation_email_subject.txt', context)
    # Force subject to a single line to avoid header-injection issues.
    subject = ''.join(subject.splitlines())
    message = render_to_string('registration/activation_email.txt', context)
    user.email_user(subject, message, settings.DEFAULT_FROM_EMAIL)


def activate_user(activation_key):
    email = validate_key(activation_key, REGISTRATION_SALT, settings.ACCOUNT_ACTIVATION_DAYS * 86400)
    if email is not None:
        user = get_inactive_user(email)
        if user is not None:
            user.is_active = True
            user.save()
            return user
    return False
