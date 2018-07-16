# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from akvo.utils import manageable_objects
from ..serializers import UserProjectAccessSerializer


class UserProjectsAccessViewSet(viewsets.ModelViewSet):
    """
    """

    permission_classes = (IsAuthenticated,)
    queryset = get_user_model().objects.all()
    serializer_class = UserProjectAccessSerializer

    def get_queryset(self):
        """ Filter the query set to include only users that the current user may manage.
        If a non-manageable user is accessed the response will be a 404 because we're lifting it
        out of the available objects. There might be a way to implement this better, so that a 403
        would be returned instead. This serves the purpose though, of not being able to change
        objects you don't have access to.
        """
        queryset = super(UserProjectsAccessViewSet, self).get_queryset()
        manageables = manageable_objects(self.request.user)
        manageable_users = manageables['employments'].users()
        return queryset.filter(id__in=manageable_users).select_related(
            'user_projects'
        ).prefetch_related(
            'user_projects__projects'
        )
