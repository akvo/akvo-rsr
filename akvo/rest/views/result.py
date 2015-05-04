# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Result
from ..serializers import ResultSerializer
from ..viewsets import BaseRSRViewSet


class ResultViewSet(BaseRSRViewSet):

    """Result resource."""

    queryset = Result.objects.prefetch_related('indicators')
    serializer_class = ResultSerializer
    filter_fields = ('project', 'type', )
