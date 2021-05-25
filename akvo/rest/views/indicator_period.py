# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..serializers import IndicatorPeriodSerializer, IndicatorPeriodFrameworkSerializer
from ..viewsets import PublicProjectViewSet

from akvo.rsr.models import Project, Indicator, IndicatorPeriod
from akvo.rest.models import TastyTokenAuthentication
from django.http import HttpResponseBadRequest, HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class IndicatorPeriodViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.all().select_related('parent_period').prefetch_related(
        'disaggregation_targets')
    serializer_class = IndicatorPeriodSerializer
    project_relation = 'indicator__result__project__'


class IndicatorPeriodFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.prefetch_related(
        'disaggregation_targets')
    serializer_class = IndicatorPeriodFrameworkSerializer
    project_relation = 'indicator__result__project__'


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def set_periods_locked(request, project_pk):
    """Bulk update period.locked attributes of a project.
    """
    period_ids = request.data.get('periods', [])
    locked = request.data.get('locked', None)
    if len(period_ids) < 1 or locked is None:
        return HttpResponseBadRequest()

    user = request.user
    project = get_object_or_404(Project, pk=project_pk)
    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    # Only change periods related to the given project
    IndicatorPeriod.objects\
        .filter(id__in=period_ids, indicator__result__project=project)\
        .update(locked=locked)

    return Response({'success': True})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def bulk_add_periods(request, project_pk):
    periods = request.data.get('periods', [])
    if len(periods) < 1:
        return HttpResponseBadRequest()

    user = request.user
    project = get_object_or_404(Project, pk=project_pk)
    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    indicators = Indicator.objects.prefetch_related('periods').filter(result__project=project)
    created = []
    for indicator in indicators:
        for p in periods:
            period = {key: p[key] for key in ('period_start', 'period_end')}
            if indicator.periods.filter(**period).count():
                continue
            try:
                obj = indicator.periods.create(**period)
                created.append(obj)
            except Exception:
                pass

    data = IndicatorPeriodSerializer(created, many=True).data
    return Response(dict(periods=data))


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def bulk_remove_periods(request, project_pk):
    periods = request.data.get('periods', [])
    if len(periods) < 1:
        return HttpResponseBadRequest()

    user = request.user
    project = get_object_or_404(Project, pk=project_pk)
    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    for p in periods:
        kwargs = {key: p[key] for key in ('period_start', 'period_end')}
        kwargs['indicator__result__project'] = project
        for period in IndicatorPeriod.objects.filter(**kwargs):
            try:
                period.delete()
            except Exception:
                pass

    return JsonResponse(dict(), status=status.HTTP_204_NO_CONTENT)
