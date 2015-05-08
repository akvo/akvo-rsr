# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Category
from ..serializers import CategorySerializer
from ..viewsets import BaseRSRViewSet


class CategoryViewSet(BaseRSRViewSet):

    """Category resource."""

    queryset = Category.objects.prefetch_related('benchmarknames', 'focus_area')
    serializer_class = CategorySerializer
