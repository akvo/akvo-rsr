# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from typing import Optional

from django.utils.translation import gettext_lazy as _
from request_token.models import RequestToken
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication, BaseAuthentication
from rest_framework.request import Request
from tastypie.models import ApiKey

from akvo.constants import JWT_WEB_FORMS_SCOPE


def create_api_key(sender, **kwargs):
    """
    A signal for hooking up automatic ApiKey creation.
    Slightly modified from the tastypie function to generate a key when saving an existing user if no key exists
    """
    if not kwargs.get('raw', False):
        user = kwargs.get('instance')
        ApiKey.objects.get_or_create(user=user)


class TastyTokenAuthentication(TokenAuthentication):
    """
    Override the model attribute to use Tastypie's token model

    Simple token based authentication.

    Clients should authenticate by passing the token key in the "Authorization"
    HTTP header, prepended with the string "Token ".  For example:

        Authorization: Token 401f7ac837da42b97f613d789819ff93537bee6a
    """

    model = ApiKey
    """
    A custom token model may be used, but must have the following properties.

    * key -- The string identifying the token
    * user -- The user to which the token belongs
    """


class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request: Request):
        token: Optional[RequestToken] = getattr(request, 'token', None)
        if token is not None:
            if token.scope != JWT_WEB_FORMS_SCOPE:
                raise exceptions.AuthenticationFailed(_('Incorrect JWT token scope.'))
            try:
                token.validate_max_uses()
            except Exception:
                raise exceptions.AuthenticationFailed(_('Invalid JWT token.'))

            return self.authenticate_credentials(token)

    def authenticate_credentials(self, token):
        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))
        return token.user, token
