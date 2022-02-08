from django.db.models import F

from akvo.rsr.models import Indicator


def get_inconsistent_indicators():
    return Indicator.objects.exclude(
        parent_indicator=None
    ).exclude(
        parent_indicator__result__pk=F('result__parent_result__pk')
    ).select_related(
        'result__parent_result', 'parent_indicator', 'parent_indicator__result',
        'result__project',
    ).order_by(
        'result__project__pk', 'result__pk'
    )
