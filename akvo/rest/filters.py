# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import ast
from rest_framework import filters


class RSRGenericFilterBackend(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        """
        Return a queryset possibly filtered by query param values.
        The filter looks for the query param keys filter and exclude
        For each of these query param the value is evaluated using ast.literal_eval() and used as
        kwargs in queryset.filter and queryset.exclude respectively.

        Example URLs:
            http://rsr.akvo.org/rest/v1/project/?filter={'title__icontains':'water','currency':'EUR'}
            http://rsr.akvo.org/rest/v1/project/?filter={'title__icontains':'water'}&exclude={'currency':'EUR'}

        It's also possible to specify models to be included in select_related() and
        prefetch_related() calls on the queryset, but specifying these in lists of strings as the
        values for the query sting params select_relates and prefetch_related.

        Example:
            http://rsr.akvo.org/rest/v1/project/?filter={'partners__in':[42,43]}&prefetch_related=['partners']
        """
        filter = request.QUERY_PARAMS.get('filter', None)
        try:
            filter_kwargs = ast.literal_eval(filter)
            queryset = queryset.filter(**filter_kwargs)
        except ValueError:
            pass

        exclude = request.QUERY_PARAMS.get('exclude', None)
        try:
            exclude_kwargs = ast.literal_eval(exclude)
            queryset = queryset.exclude(**exclude_kwargs)
        except ValueError:
            pass

        select_related = request.QUERY_PARAMS.get('select_related', None)
        try:
            select_related_args = ast.literal_eval(select_related)
            queryset = queryset.select_related(*select_related_args)
        except ValueError:
            pass

        prefetch_related = request.QUERY_PARAMS.get('prefetch_related', None)
        try:
            prefetch_related_args = ast.literal_eval(prefetch_related)
            queryset = queryset.prefetch_related(*prefetch_related_args)
        except ValueError:
            pass

        return queryset
