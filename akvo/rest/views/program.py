# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, Indicator
from akvo.rsr.models.result.utils import QUANTITATIVE
from decimal import Decimal, InvalidOperation
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def program_results(request, pk):
    queryset = Project.objects\
        .prefetch_related('results', 'results__indicators')\
        .filter(projecthierarchy__isnull=False)
    program = get_object_or_404(queryset, pk=pk)
    if not request.user.has_perm('rsr.view_project', program):
        raise Http404

    return Response([
        {
            'id': r.id,
            'title': r.title,
            'indicators': [
                {
                    'id': i.id,
                    'title': i.title,
                    'description': i.description,
                    'period_count': i.periods.count(),
                    'type': 'quantitative' if i.type == QUANTITATIVE else 'qualitative',
                    'measure': 'unit' if i.measure == '1' else 'percentage' if i.measure == '2' else None
                }
                for i
                in r.indicators.all()
            ],
        }
        for r
        in program.results.all()
    ])


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def program_indicator_periods(request, program_pk, indicator_pk):
    queryset = Indicator.objects\
        .prefetch_related('periods', 'periods__child_periods')\
        .select_related('result__project')
    indicator = get_object_or_404(queryset, pk=indicator_pk)
    program = indicator.result.project
    if program.id != int(program_pk) or not request.user.has_perm('rsr.view_project', program):
        raise Http404

    return Response([_transform_period(p) for p in indicator.periods.all()])


def _transform_period(period):
    contributors = filter(None, [
        _transform_contributor(child)
        for child
        in period.child_periods.select_related(
            'indicator__result__project',
            'indicator__result__project__primary_location__country'
        ).prefetch_related('disaggregations').all()
    ])

    countries = []
    for contributor in contributors:
        if contributor['country'] and contributor['country'] not in countries:
            countries.append(contributor['country'])

    return {
        'id': period.id,
        'period_start': period.period_start,
        'period_end': period.period_end,
        'actual_value': _force_decimal(period.actual_value),
        'target_value': _force_decimal(period.target_value),
        'contributors': contributors,
        'countries': countries,
        'disaggregations': [
            {
                'category': d.dimension_value.name.name,
                'type': d.dimension_value.value,
                'value': d.value,
                'numerator': d.numerator,
                'denominator': d.denominator,
            }
            for d
            in period.disaggregations.select_related(
                'dimension_value',
                'dimension_value__name'
            ).all()
        ]
    }


def _transform_contributor(period):
    value = _force_decimal(period.actual_value)

    if value <= 0:
        return None

    project = period.indicator.result.project
    country = project.primary_location.country

    return {
        'id': project.id,
        'title': project.title,
        'country': {'iso_code': country.iso_code, 'name': country.name} if country else None,
        'value': value,
    }


def _force_decimal(value):
    try:
        return Decimal(value)
    except (InvalidOperation, TypeError):
        return Decimal(0)
