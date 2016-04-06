# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import filters


class RSRGenericFilterBackend(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        """
        Return a queryset possibly filtered by query param values.
        The filter looks for the query param key filter and then filter2, filter3... up to filter24
        For each of these query param keys it uses the value to construct a filter for the
        queryset using the full Django queryset field lookups.
        This is done by splitting the value on = and assigning the bits to the key and value of a
        dict used as kwarg to filter()

        Example URL:
            http://rsr.akvo.org/rest/v1/project/?filter=title__icontains=water&filter2=currency=EUR

        TODO: this is a tech demo, there are a bunch of things that need addressing if we're to use
        this, like supporting __in=[1 2 3], adding params so you can set select_related and
        prefetch_related on models used in the filters and probably more.
        """
        def param_to_kwarg(param):
            "split a string on = and return the bits as key and value of a dict"
            bits = param.split('=')
            return {bits[0]: bits[1]}

        params = request.QUERY_PARAMS

        if params.get('filter', False):
            for i in [''] + range(2, 25):
                key = 'filter{}'.format(i)
                if params.get(key, False):
                    queryset = queryset.filter(**param_to_kwarg(params[key]))
                else:
                    break

            return queryset
