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

    # project_relation is the default string for constructing a field lookup to the is_public field
    # on the related Project. Override this in when the viewset is for a model that doesn't have a
    # direct FK to Project or the FK field isn't named project. E.g. IndicatorViewSet:
    #   project_relation = 'result__project__'
    # The lookup is used to filter out objects associated with private projects, see below.
    project_relation = 'project__'

    def get_queryset(self):

        queryset = super(PublicProjectViewSet, self).get_queryset()
        user = self.request.user

        if not (user.is_superuser or user.is_admin):
            # construct the filter field lookup
            project_filter = self.project_relation + 'is_public'
            # filter the object list into two querysets, one where the related Projects are public,
            # and one where they are private
            public_objects = queryset.filter(**{project_filter: True}).distinct()
            private_objects = queryset.filter(**{project_filter: False}).distinct()
            if private_objects:
                permission = type(private_objects[0])._meta.db_table.replace('_', '.change_')
                permitted_obj_pks = []
                # Loop through all 'private' objects to see if the user has permission to change
                # it. If so add its PK to the list of permitted objects
                for obj in private_objects:
                    if user.has_perm(permission, obj):
                        # See if user has permission to change and remove item from queryset if not
                        permitted_obj_pks += obj.pk

                queryset = public_objects | queryset.filter(pk__in=permitted_obj_pks).distinct()

        return queryset
