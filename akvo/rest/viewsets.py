# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models.fields import FieldDoesNotExist
from django.db.models.fields.related import ForeignObject
from django.core.exceptions import FieldError

from akvo.rsr.models import PublishingStatus
from akvo.rest.models import TastyTokenAuthentication

from rest_framework import authentication, filters, permissions, viewsets

from .filters import RSRGenericFilterBackend
from .pagination import TastypieOffsetPagination


class SafeMethodsPermissions(permissions.DjangoObjectPermissions):
    """
    Base class to allow any safe methods ('GET', 'OPTIONS' and 'HEAD') without needing to
    authenticate.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super(SafeMethodsPermissions, self).has_permission(request, view)


class BaseRSRViewSet(viewsets.ModelViewSet):
    """
    Base class used for the view sets for RSR models. Provides unified auth and perms settings.
    """
    authentication_classes = (authentication.SessionAuthentication, TastyTokenAuthentication, )
    permission_classes = (SafeMethodsPermissions, )
    filter_backends = (filters.OrderingFilter, RSRGenericFilterBackend,)
    ordering_fields = '__all__'

    def paginate_queryset(self, queryset):
        """ Custom offset-based pagination for the Tastypie API emulation
        """
        if self.request and '/api/v1/' in self.request.path:
            self.pagination_class = TastypieOffsetPagination
        return super(BaseRSRViewSet, self).paginate_queryset(queryset)

    def get_queryset(self):

        def django_filter_filters(request):
            """
            Support emulating the DjangoFilterBackend-based filtering that some views used to have
            """
            # query string keys reserved by the RSRGenericFilterBackend
            qs_params = ['filter', 'exclude', 'select_related', 'prefetch_related', ]
            # query string keys used by core DRF, OrderingFilter and Akvo custom views
            exclude_params = ['limit', 'format', 'page', 'offset', 'ordering', 'partner_type',
                              'sync_owner', 'reporting_org', ]
            filters = {}
            for key in request.query_params.keys():
                if key not in qs_params + exclude_params and not key.startswith('image_thumb_'):
                    filters.update({key: request.query_params.get(key)})
            return filters

        def get_lookups_from_filters(legacy_filters):
            """
            Cast the values in DjangoFilterBackend-styled query string filters to correct types to
            be able to use them in regular queryset-filter() calls
            """
            # types of lookups supported by the views using DjangoFilterBackend
            LEGACY_FIELD_LOOKUPS = ['exact', 'contains', 'icontains', 'gt', 'gte', 'lt',
                                    'lte', ]
            query_set_lookups = []
            for key, value in legacy_filters.items():
                parts = key.split('__')
                if parts[-1] in LEGACY_FIELD_LOOKUPS:
                    parts = parts[:-1]
                    model = queryset.model
                    for part in parts:
                        try:
                            field_object = model._meta.get_field(part)
                            related_model = field_object.model
                            direct = not field_object.auto_created or field_object.concrete

                            if direct:
                                if issubclass(field_object.__class__, ForeignObject):
                                    model = field_object.related.parent_model
                                else:
                                    value = field_object.to_python(value)
                                    break
                            else:
                                model = related_model
                        except FieldDoesNotExist:
                            pass
                query_set_lookups += [{key: value}]
            return query_set_lookups

        queryset = super(BaseRSRViewSet, self).get_queryset()

        # support for old DjangoFilterBackend-based filtering if not pk is given
        if not self.kwargs.get(u'pk'):
            # find all "old styled" filters
            legacy_filters = django_filter_filters(self.request)
            # create lookup dicts from the filters found
            lookups = get_lookups_from_filters(legacy_filters)
            for lookup in lookups:
                try:
                    queryset = queryset.filter(**lookup)
                except (FieldError, ValueError):
                    # In order to mimick 'old' behaviour of the API, we should ignore non-valid
                    # parameters or values. Returning a warning would be more preferable.
                    pass

        return queryset


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

        request = self.request
        user = request.user

        queryset = super(PublicProjectViewSet, self).get_queryset()

        # filter projects if user is "non-privileged"
        if user.is_anonymous() or not (user.is_superuser or user.is_admin):
            queryset = self.projects_filter_for_non_privileged_users(
                user, queryset, self.project_relation, action=self.action
            )

        return queryset.distinct()

    @staticmethod
    def projects_filter_for_non_privileged_users(user, queryset, project_relation, action='create'):

        if not user.is_anonymous() and (user.is_admin or user.is_superuser):
            return queryset.distinct()

        # Construct the public projects filter field lookup.
        project_filter = project_relation + 'is_public'

        # Filter the object list into two querysets;
        # One where the related Projects are public and one where they are private
        public_objects = queryset.filter(**{project_filter: True}).distinct()
        private_objects = queryset.filter(**{project_filter: False}).distinct()

        # In case of an anonymous user, only return the public objects
        if user.is_anonymous():
            unpublished_exclude = project_relation + 'publishingstatus__status'
            queryset = public_objects.exclude(
                **{unpublished_exclude: PublishingStatus.STATUS_UNPUBLISHED}
            ).distinct()

        # Otherwise, check to which objects the user has (change) permission
        elif private_objects.exists():
            include_user_owned = hasattr(queryset.model, 'user')
            if action == 'list':
                # The view permission is new, and previously only the change
                # permission existed. To avoid adding new view permissions for
                # all the objects, we also check if a user has change
                # permissions, which implicitly implies view permissions.
                change_permission = type(private_objects[0])._meta.db_table.replace('_', '.change_')
                change_filter = user.get_permission_filter(
                    change_permission, project_relation, include_user_owned
                )
                change_objects = private_objects.filter(change_filter).distinct()

                # Check if user has view permission on the queryset
                view_permission = change_permission.replace('.change_', '.view_')
                view_filter = user.get_permission_filter(
                    view_permission, project_relation, include_user_owned
                )
                view_objects = private_objects.filter(view_filter).distinct()

                private_objects = (change_objects | view_objects).distinct()
            else:
                permission = type(private_objects[0])._meta.db_table.replace('_', '.change_')
                filter_ = user.get_permission_filter(permission, project_relation, include_user_owned)
                private_objects = private_objects.filter(filter_).distinct()

            queryset = public_objects | private_objects

        return queryset.distinct()
