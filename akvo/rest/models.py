# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.utils.translation import ugettext_lazy as _
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication, BaseAuthentication
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

    def authenticate(self, request):
        token = getattr(request, 'token', None)
        if token is not None:
            if token.scope != JWT_WEB_FORMS_SCOPE:
                raise exceptions.AuthenticationFailed(_('Incorrect JWT token scope.'))
            try:
                token.validate_max_uses()
            except Exception:
                raise exceptions.AuthenticationFailed(_('Invalid JWT token.'))

            credentials = self.authenticate_credentials(token, request._request)

            # FIXME: Tokens are only valid for one POST request. Not sure if
            # this is a good idea. Needs discussion.
            if request.method == 'POST':
                # NOTE: The token.expire() call doesn't seem to expire the
                # token. This is probably a bug in the implementation of request
                # token -- the query parameter in the URL is being used by the
                # middle ware to decide if a token is valid. But, shouldn't we
                # check the expiration date for a token from the DB? Do the
                # token URLs actually even have a validity? This needs more
                # investigation.
                token.max_uses = 0
                token.save(update_fields=['max_uses'])

            return credentials

    def authenticate_credentials(self, token, request):
        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))

        response = MockResponse()
        token.log(request, response)
        return (token.user, token)


class MockResponse():
    status_code = None
