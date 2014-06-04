# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.authentication import ApiKeyAuthentication
from tastypie.constants import ALL_WITH_RELATIONS

from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import UserProfile

from .resources import ConditionalFullResource


class UserProfileResource(ConditionalFullResource):
    organisation = ConditionalFullToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    user = ConditionalFullToOneField('akvo.api.resources.UserResource', 'user')

    class Meta:
        authentication  = ApiKeyAuthentication()
        allowed_methods = ['get']
        queryset        = UserProfile.objects.filter(user__is_active=True)
        resource_name   = 'user_profile'
        fields          = ['organisation', 'user',]
        filtering       = dict(
            # foreign keys
            user            = ALL_WITH_RELATIONS,
            organisation    = ALL_WITH_RELATIONS,
        )

    def get_object_list(self, request):
        """ Limit access to the users in your own organisation
        """
        organisation = request.user.userprofile.organisation
        return UserProfile.objects.filter(organisation=organisation)

    def dehydrate(self, bundle):
        """ Add meta fields showing if the user profile is an organisation admin or an organisation editor
        """
        bundle = super(UserProfileResource, self).dehydrate(bundle)
        bundle.data['is_org_admin'] = bundle.obj.get_is_org_admin()
        bundle.data['is_org_editor'] = bundle.obj.get_is_org_editor()
        return bundle
