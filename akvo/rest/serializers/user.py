# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth.models import User

from .organisation import OrganisationExtraSerializer
from .rsr_serializer import BaseRSRSerializer


class UserSerializer(BaseRSRSerializer):

    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'email',
        )


class UserExtraSerializer(BaseRSRSerializer):

    organisation = OrganisationExtraSerializer(source='get_profile.organisation')

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'organisation',
        )
        exclude = ('absolute_url',)

    def __init__(self, *args, **kwargs):
        """ Delete the 'absolute_url' field added in BaseRSRSerializer.__init__().
        It's neither correct nor do we want this data to be visible.
        """
        super(UserExtraSerializer, self).__init__(*args, **kwargs)
        del self.fields['absolute_url']