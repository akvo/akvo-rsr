# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response

from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, IndicatorPeriod, IndicatorPeriodData
from ..serializers import IndicatorPeriodDataPendingForApprovalSerializer


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def get_program_period_updates_for_approvals(request, program_pk):
    program = get_object_or_404(Project, pk=program_pk)
    project_ids = program.descendants().values_list('id', flat=True)

    updates = IndicatorPeriodData.objects\
        .select_related(
            'period', 'period__indicator',
            'period__indicator__result',
            'period__indicator__result__project',
            'user',
            'approved_by'
        )\
        .prefetch_related(
            'period__indicator__result__project__locations__country',
            'comments',
            'comments__user',
            'disaggregations',
            'disaggregations__dimension_value',
            'disaggregations__dimension_value__name',
            'indicatorperioddatafile_set',
        )\
        .filter(status=IndicatorPeriodData.STATUS_PENDING_CODE, period__indicator__result__project__in=project_ids)\
        .distinct()

    serializer = IndicatorPeriodDataPendingForApprovalSerializer(updates, many=True)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def get_program_period_dates(request, program_pk):
    program = get_object_or_404(Project, pk=program_pk)
    project_ids = program.descendants().values_list('id', flat=True)

    periods = IndicatorPeriod.objects\
        .select_related('indicator__result__project')\
        .prefetch_related('indicator__result__project__locations__country')\
        .filter(indicator__result__project__in=project_ids)\
        .distinct()

    data = {}
    for period in periods:
        date_key = '{}-{}'.format(
            period.period_start.strftime('%-d/%-m/%Y') if period.period_start else '',
            period.period_end.strftime('%-d/%-m/%Y') if period.period_end else ''
        )
        if date_key not in data:
            data[date_key] = {}
        project = period.indicator.result.project
        if project.id not in data[date_key]:
            data[date_key][project.id] = {
                'id': project.id,
                'title': project.title,
                'contries': set(loc.country.iso_code for loc in project.locations.all() if loc.country),
                'periods': {},
            }
        if period.id not in data[date_key][project.id]['periods']:
            data[date_key][project.id]['periods'][period.id] = {
                'id': period.id,
                'locked': period.locked,
            }

    return Response(data)
