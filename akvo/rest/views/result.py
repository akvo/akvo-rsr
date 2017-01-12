# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Result
from ..serializers import ResultSerializer, ResultsFrameworkSerializer
from ..viewsets import PublicProjectViewSet


class ResultsViewSet(PublicProjectViewSet):
    """Results resource."""

    queryset = Result.objects.all().select_related('project')
    serializer_class = ResultSerializer


class ResultsFrameworkViewSet(PublicProjectViewSet):
    """Results framework resource."""

    queryset = Result.objects.select_related('project').prefetch_related('indicators')
    serializer_class = ResultsFrameworkSerializer
