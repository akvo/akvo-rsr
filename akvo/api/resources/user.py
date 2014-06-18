# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model

from tastypie.authentication import ApiKeyAuthentication
from tastypie.constants import ALL_WITH_RELATIONS, ALL

from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import UserProfile

from .resources import ConditionalFullResource


class UserResource(ConditionalFullResource):
    user_profile = ConditionalFullToOneField('akvo.api.resources.UserProfileResource', 'userprofile', null=True)

    class Meta:
        authentication  = ApiKeyAuthentication()
        allowed_methods = ['get']
        queryset = get_user_model.objects.filter(is_active=True)
        resource_name = 'user'
        fields = ['username', 'first_name', 'last_name', 'last_login',]
        filtering = dict(
            username = ALL,
            # foreign keys
            userprofile = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
        """ Workaround for the overloading of 'username' when used in the query.
            It is needed for the authentication, but the filtering machinery
            intercepts and complains that the 'username' field doesn't allow filtering.
            So instead of having username in the fields list we add it here

            The adding is conditional, only add fields for users in the same organisation
            as request.user which is the API key owner

            For other users delete the user_profile field
        """
        bundle = super(UserResource, self).dehydrate(bundle)
        if self._meta.authentication.is_authenticated(bundle.request):
            if getattr(bundle.request.user, 'get_profile', False):
                # get the org of the API key owner
                organisation = bundle.request.user.userprofile.organisation
            else:
                organisation = None
            # find out if the user has a profile that's associated with the API key owner org
            profile = UserProfile.objects.filter(organisation=organisation, user__id=bundle.obj.id)
        if profile:
            bundle.data['username'] = bundle.obj.username
            bundle.data['email'] = bundle.obj.email
        else:
            del bundle.data['user_profile']
            del bundle.data['username']
        return bundle
