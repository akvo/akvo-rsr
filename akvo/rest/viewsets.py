# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import filters
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import DjangoObjectPermissions

from .models import TastyTokenAuthentication


class BaseRSRViewSet(viewsets.ModelViewSet):
    """
    Base class used for the view sets for RSR models. Provides unified auth and perms settings.
    """
    authentication_classes = (SessionAuthentication, TastyTokenAuthentication, )
    permission_classes = (DjangoObjectPermissions, )
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, )
    ordering_fields = '__all__'


class PublicProjectViewSet(BaseRSRViewSet):
    """
    Only public projects or objects related to public projects will be shown.
    """
    def get_queryset(self, related_to='project__'):
        queryset = super(PublicProjectViewSet, self).get_queryset()
        user = self.request.user

        if not (user.is_superuser or user.is_admin):
            project_filter = related_to + 'is_public'

            public_objects = queryset.filter(**dict.fromkeys([project_filter], True)).distinct()
            private_objects = queryset.filter(**dict.fromkeys([project_filter], False)).distinct()

            for obj in private_objects:
                # Loop through all 'private' objects to see if the user has permission to change it
                # or not. Fetch permission first. E.g. a Sector object becomes 'rsr.change_sector'.
                permission = type(obj)._meta.db_table.replace('_', '.change_')

                if not user.has_perm(permission, obj):
                    # See if user has permission to change and remove item from queryset if not
                    private_objects = private_objects.exclude(pk=obj.pk)

            queryset = public_objects | private_objects

        return queryset
