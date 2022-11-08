# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated

from akvo.rsr.models import IndicatorPeriodAggregationJob
from ..filters import RSRGenericFilterBackend

from ..serializers import IndicatorPeriodAggregationJobSerializer
from ..viewsets import ReadOnlyPublicProjectViewSet, SafeMethodsPermissions


class IndicatorPeriodAggregationJobViewSet(ReadOnlyPublicProjectViewSet):
    queryset = IndicatorPeriodAggregationJob.objects.all().select_related(
        IndicatorPeriodAggregationJob.project_relation[:-2]
    )
    serializer_class = IndicatorPeriodAggregationJobSerializer
    project_relation = IndicatorPeriodAggregationJob.project_relation
    ordering = ["updated_at"]
    filter_backends = (filters.OrderingFilter, RSRGenericFilterBackend,)

    # These are login only resources that shouldn't be interesting to the public
    permission_classes = (SafeMethodsPermissions, IsAuthenticated)
