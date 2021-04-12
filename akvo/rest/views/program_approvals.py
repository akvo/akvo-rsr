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
        .values('period_start', 'period_end', 'locked', 'id',
                'indicator__result__project_id',
                'indicator__result__project__title',
                # NOTE: The country iso_codes are not returned as a
                # list, but a new entry is created for each period,
                # for each project location iso_code
                'indicator__result__project__locations__country__iso_code')\
        .distinct()

    data = {}

    for period in periods:
        date_key = '{}-{}'.format(
            period['period_start'].strftime('%-d/%-m/%Y') if period['period_start'] else '',
            period['period_end'].strftime('%-d/%-m/%Y') if period['period_end'] else ''
        )
        if date_key not in data:
            data[date_key] = {}

        project_id = period['indicator__result__project_id']
        project_title = period['indicator__result__project__title']
        country = period['indicator__result__project__locations__country__iso_code']
        if project_id not in data[date_key]:
            data[date_key][project_id] = {
                'id': project_id,
                'title': project_title,
                'countries': set([country]) if country else set(),
                'periods': {},
            }
        # Each country is returned as a separate entry, so we group
        # the countries into a list. See the NOTE above.
        if country is not None and country not in data[date_key][project_id]['countries']:
            data[date_key][project_id]['countries'].add(country)
        if period['id'] not in data[date_key][project_id]['periods']:
            data[date_key][project_id]['periods'][period['id']] = {
                'id': period['id'],
                'locked': period['locked'],
            }

    return Response(data)
