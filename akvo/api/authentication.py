# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType

from tastypie.authentication import ApiKeyAuthentication
from tastypie.http import HttpUnauthorized

#from models import AkvoApiKey
from akvo.rsr.models import Organisation

class ConditionalApiKeyAuthentication(ApiKeyAuthentication):
    """ Allows for requiring API key authentication only for selected request methods
    """
    def __init__(self, methods_requiring_key=None):
        "All methods require API key if nothing else is specified on object creation"
        super(ConditionalApiKeyAuthentication, self).__init__()
        if methods_requiring_key is not None:
            self.methods_requiring_key = methods_requiring_key
        else:
            self.methods_requiring_key = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

    def is_authenticated(self, request, **kwargs):
        """
        Finds the user and checks their API key.

        Should return either ``True`` if allowed, ``False`` if not or an
        ``HttpResponse`` if you need something custom.
        """

        if request.method not in self.methods_requiring_key:
            return True

        username = request.GET.get('username') or request.POST.get('username')
        api_key = request.GET.get('api_key') or request.POST.get('api_key')

        if not username or not api_key:
            return self._unauthorized()

        try:
            user = get_user_model().objects.get(username__iexact=username)
        except (get_user_model().DoesNotExist, get_user_model().MultipleObjectsReturned):
            return self._unauthorized()

        request.user = user
        return self.get_key(user, api_key)
