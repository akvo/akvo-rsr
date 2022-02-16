from django.db.models import F

from akvo.rsr.models import IndicatorPeriod


def get_inconsistent_periods():
    return IndicatorPeriod.objects.exclude(
        parent_period=None
    ).exclude(
        parent_period__indicator__pk=F('indicator__parent_indicator__pk')
    ).select_related(
        'parent_period', 'parent_period__indicator', 'indicator__parent_indicator',
        'indicator__result__project',
    ).order_by(
        'indicator__result__project__pk', 'indicator__result__pk', 'indicator__pk'
    )
