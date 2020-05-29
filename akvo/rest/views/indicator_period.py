# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..serializers import IndicatorPeriodSerializer, IndicatorPeriodFrameworkSerializer
from ..viewsets import PublicProjectViewSet

from akvo.rsr.models import IndicatorPeriod
from akvo.rest.models import TastyTokenAuthentication
from django.http import HttpResponseBadRequest
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
def set_periods_locked(request):
    period_ids = request.data.get('periods', [])
    locked = request.data.get('locked', None)
    if len(period_ids) < 1 or locked is None:
        return HttpResponseBadRequest()

    user = request.user
    periods = IndicatorPeriod.objects.filter(id__in=period_ids)

    # only do the operation on periods where user has correct permission.
    permitted_ids = [p.id for p in periods if user.has_perm('rsr.change_indicatorperiod', p)]
    IndicatorPeriod.objects.filter(id__in=permitted_ids).update(locked=locked)

    # return only affected periods
    return Response({'results': permitted_ids})
