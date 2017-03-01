# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from rest_framework import pagination
from rest_framework.response import Response


class LimitSizePageNumberPagination(pagination.PageNumberPagination):
    page_size = 30
    page_size_query_param = 'limit'
    max_page_size = 100


class TastypieOffsetPagination(pagination.LimitOffsetPagination):

    def get_paginated_response(self, data):
        """ Emulate the old style Tastypie format if the URL contains /api/v1/
        """
        return Response({
            'meta': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'total_count': self.count,
                'limit': self.limit,
                'offset': self.offset,
            },
            'objects': data
        })
