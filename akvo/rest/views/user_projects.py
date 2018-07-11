# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

from ..serializers import UserProjectAccessSerializer
from ..viewsets import BaseRSRViewSet


class UserProjectsAccessViewSet(BaseRSRViewSet):
    """
    """

    permission_classes = (IsAuthenticated,)

    queryset = get_user_model().objects.all().select_related(
        'user_projects'
    ).prefetch_related(
        'user_projects__projects'
    )
    
    serializer_class = UserProjectAccessSerializer
