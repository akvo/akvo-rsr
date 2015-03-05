# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model

from akvo.api.authentication import ConditionalApiKeyAuthentication

from tastypie.constants import ALL

from .resources import ConditionalFullResource
from ..fields import ConditionalFullToManyField


class UserResource(ConditionalFullResource):
    organisations = ConditionalFullToManyField('akvo.api.resources.OrganisationResource', 'organisations', null=True)

    class Meta:
        allowed_methods = ['get']
        authentication = ConditionalApiKeyAuthentication()
        queryset = get_user_model().objects.filter(is_active=True)
        resource_name = 'user'
        fields = [
            'username',
            'first_name',
            'last_name',
            'last_login',
            'organisations'
        ]
        filtering = dict(
            username = ALL,
        )

    def dehydrate(self, bundle):
        """ Workaround for the overloading of 'username' when used in the query.
            It is needed for the authentication, but the filtering machinery
            intercepts and complains that the 'username' field doesn't allow filtering.
            So instead of having username in the fields list we add it here

            The adding is conditional, only add fields for users in the same organisation
            as request.user which is the API key owner
        """
        bundle = super(UserResource, self).dehydrate(bundle)
        if self._meta.authentication.is_authenticated(bundle.request):
            try:
                organisations = bundle.request.user.organisations.all()
            except:
                organisations = []

            # find out if the user has a profile that's associated with the API key owner org
            profile = get_user_model().objects.filter(organisations__in=organisations, id=bundle.obj.id)
        if profile:
            bundle.data['username'] = bundle.obj.username
            bundle.data['email'] = bundle.obj.email
        else:
            del bundle.data['username']
            del bundle.data['organisations']
        return bundle
