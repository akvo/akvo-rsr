# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.http import HttpResponseForbidden
from django.db.models import Count, Q

from rest_framework import filters, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from akvo.rsr.models import IndicatorPeriodAggregationJob, Project, IndicatorPeriod, IndicatorPeriodData
from akvo.rest.authentication import TastyTokenAuthentication
from ..filters import RSRGenericFilterBackend

from ..serializers import IndicatorPeriodAggregationJobSerializer
from ..viewsets import ReadOnlyPublicProjectViewSet, SafeMethodsPermissions
from ...rsr.usecases.jobs.aggregation import schedule_aggregation_jobs


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

    @action(detail=True, methods=['post'])
    def reschedule(self, request, **kwargs):
        """
        Puts a new job in the queue for the indicator period

        The old job is left in order to have a history
        """
        job: IndicatorPeriodAggregationJob = self.get_object()

        if job.status != IndicatorPeriodAggregationJob.Status.MAXXED:
            raise ValidationError("Maximum number of attempts not reached")

        new_jobs = schedule_aggregation_jobs(job.period)
        serializer = self.get_serializer(new_jobs, many=True)

        return Response(serializer.data)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def recalculate_project_aggregation(request):
    user = request.user
    if not user.is_superuser:
        return HttpResponseForbidden()
    project_id = request.data.get('project')
    if not project_id:
        return Response({'error': 'Project id required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Invalid project'}, status=status.HTTP_400_BAD_REQUEST)

    descendants = project.descendants()
    periods = IndicatorPeriod.objects.filter(indicator__result__project__in=descendants)
    periods = periods.annotate(
        approved_count=Count('data', filter=Q(data__status=IndicatorPeriodData.STATUS_APPROVED_CODE))
    ).filter(approved_count__gte=1)

    jobs = set()
    for period in periods:
        new_jobs = schedule_aggregation_jobs(period)
        jobs = jobs.union(set(new_jobs))

    return Response({'message': f"Scheduled period aggregation jobs: {len(jobs)}, on root project: {project.title}"})
