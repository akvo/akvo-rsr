# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models.fields import FieldDoesNotExist
from django.db.models.fields.related import ForeignObject
from django.core.exceptions import FieldError

from akvo.rest.models import TastyTokenAuthentication

from rest_framework import authentication, filters, permissions, viewsets

from .filters import RSRGenericFilterBackend


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

    def get_queryset(self):

        def django_filter_filters(request):
            """
            Support emulating the DjangoFilterBackend-based filtering that some views used to have
            """
            # query string keys reserved by the RSRGenericFilterBackend
            qs_params = ['filter', 'exclude', 'select_related', 'prefetch_related', ]
            # query string keys used by core DRF, OrderingFilter and Akvo custom views
            exclude_params = ['limit', 'format', 'page', 'ordering', 'partner_type', 'sync_owner',
                              'reporting_org', ]
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
                            field_object, related_model, direct, m2m = model._meta.\
                                get_field_by_name(part)

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

        def projects_filter_for_non_privileged_users(user, queryset):
            # Construct the public projects filter field lookup.
            project_filter = self.project_relation + 'is_public'

            # Filter the object list into two querysets;
            # One where the related Projects are public and one where they are private
            public_objects = queryset.filter(**{project_filter: True}).distinct()
            private_objects = queryset.filter(**{project_filter: False}).distinct()

            # In case of an anonymous user, only return the public objects
            if user.is_anonymous():
                queryset = public_objects

            # Otherwise, check to which objects the user has (change) permission
            elif private_objects:
                permission = type(private_objects[0])._meta.db_table.replace('_', '.change_')
                permitted_obj_pks = []

                # Loop through all 'private' objects to see if the user has permission to change
                # it. If so add its PK to the list of permitted objects.
                for obj in private_objects:
                    if user.has_perm(permission, obj):
                        permitted_obj_pks.append(obj.pk)

                queryset = public_objects | queryset.filter(pk__in=permitted_obj_pks).distinct()

            return queryset

        # filter projects if user is "non-privileged"
        if user.is_anonymous() or not (user.is_superuser or user.is_admin):
            queryset = projects_filter_for_non_privileged_users(user, queryset)

        return queryset
