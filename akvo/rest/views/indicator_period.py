# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..serializers import IndicatorPeriodSerializer, IndicatorPeriodFrameworkSerializer
from ..viewsets import PublicProjectViewSet

from akvo.rsr.models import Project, IndicatorPeriod
from akvo.rest.models import TastyTokenAuthentication
from django.http import HttpResponseBadRequest, HttpResponseForbidden
from django.shortcuts import get_object_or_404
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
def set_project_periods_locked(request, project_pk):
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
def set_periods_locked(request):
    """Bulk update period.locked attributes.
    """
    period_ids = request.data.get('periods', [])
    locked = request.data.get('locked', None)
    if len(period_ids) < 1 or locked is None:
        return HttpResponseBadRequest()

    IndicatorPeriod.objects\
        .filter(id__in=period_ids)\
        .update(locked=locked)

    return Response({'success': True})
