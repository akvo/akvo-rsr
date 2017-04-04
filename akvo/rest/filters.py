# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import ast

from django.db.models import Q
from django.core.exceptions import FieldError

from rest_framework import filters
from rest_framework.exceptions import APIException


class RSRGenericFilterBackend(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        """
        Return a queryset possibly filtered by query param values.
        The filter looks for the query param keys filter and exclude
        For each of these query param the value is evaluated using ast.literal_eval() and used as
        kwargs in queryset.filter and queryset.exclude respectively.

        Example URLs:
            https://rsr.akvo.org/rest/v1/project/?filter={'title__icontains':'water','currency':'EUR'}
            https://rsr.akvo.org/rest/v1/project/?filter={'title__icontains':'water'}&exclude={'currency':'EUR'}

        It's also possible to specify models to be included in select_related() and
        prefetch_related() calls on the queryset, but specifying these in lists of strings as the
        values for the query sting params select_relates and prefetch_related.

        Example:
            https://rsr.akvo.org/rest/v1/project/?filter={'partners__in':[42,43]}&prefetch_related=['partners']

        Finally limited support for filtering on multiple arguments using logical OR between
        those expressions is available. To use this supply two or more query string keywords on the
        form q_filter1, q_filter2... where the value is a dict that can be used as a kwarg in a Q
        object. All those Q objects created are used in a queryset.filter() call concatenated using
        the | operator.
        """
        def eval_query_value(request, key):
            """
            Use ast.literal_eval() to evaluate a query string value as a python data type object
            :param request: the django request object
            :param param: the query string param key
            :return: a python data type object, or None if literal_eval() fails
            """
            value = request.query_params.get(key, None)
            try:
                return ast.literal_eval(value)
            except (ValueError, SyntaxError):
                return None

        qs_params = ['filter', 'exclude', 'select_related', 'prefetch_related']

        # evaluate each query string param, and apply the queryset method with the same name
        for param in qs_params:
            args_or_kwargs = eval_query_value(request, param)
            if args_or_kwargs:
                # filter and exclude are called with a dict kwarg, the _related methods with a list
                try:
                    if param in ['filter', 'exclude', ]:
                        queryset = getattr(queryset, param)(**args_or_kwargs)
                    else:
                        queryset = getattr(queryset, param)(*args_or_kwargs)

                except FieldError as e:
                    raise APIException("Error in request: {message}".format(message=e.message))

        # support for Q expressions, limited to OR-concatenated filtering
        if request.query_params.get('q_filter1', None):
            i = 1
            q_queries = []
            while request.query_params.get('q_filter{}'.format(i), None):
                query_arg = eval_query_value(request, 'q_filter{}'.format(i))
                if query_arg:
                    q_queries += [query_arg]
                i += 1

            q_expr = Q(**q_queries[0])
            for query in q_queries[1:]:
                q_expr = q_expr | Q(**query)

            queryset = queryset.filter(q_expr)

        return queryset
