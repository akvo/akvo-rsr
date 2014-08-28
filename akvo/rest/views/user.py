# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model

from ..serializers import UserSerializer
from ..viewsets import BaseRSRViewSet


class UserViewSet(BaseRSRViewSet):
    """
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
