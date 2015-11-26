# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import filters
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import DjangoObjectPermissions

from .models import TastyTokenAuthentication

from akvo.rsr.models import Project


class BaseRSRViewSet(viewsets.ModelViewSet):
    """
    Base class used for the view sets for RSR models. Provides unified auth and perms settings.
    Only public projects will be shown by filtering the queryset.
    """
    authentication_classes = (SessionAuthentication, TastyTokenAuthentication, )
    permission_classes = (DjangoObjectPermissions, )
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, )
    ordering_fields = '__all__'

    def get_queryset(self):
        """Filter out any private projects."""
        for related_obj in self.queryset.model._meta.get_all_related_objects():
            if related_obj.model == Project:
                self.queryset = self.queryset.filter(project__is_public=True)
                break
        return super(BaseRSRViewSet, self).get_queryset()
