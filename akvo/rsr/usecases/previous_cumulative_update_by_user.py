from akvo.rsr.models import IndicatorPeriodData


def empty_result():
    return {
        'value': None,
        'numerator': None,
        'denominator': None,
        'disaggregations': {},
    }


def get_previous_cumulative_update_value(user, indicator):
    if not indicator.cumulative:
        return empty_result()
    latest_update = IndicatorPeriodData.objects\
        .prefetch_related('disaggregations', 'disaggregations__dimension_value', 'disaggregations__dimension_value__name')\
        .filter(user=user, period__indicator=indicator, status=IndicatorPeriodData.STATUS_APPROVED_CODE)\
        .order_by('-period__period_end', '-created_at')\
        .first()
    if not latest_update:
        return empty_result()
    disaggregations = {}
    for d in latest_update.disaggregations.all():
        category = d.dimension_value.name.name
        type = d.dimension_value.value
        disaggregations.setdefault(category, {}).setdefault(type, {
            'value': d.value,
            'numerator': d.numerator,
            'denominator': d.denominator,
        })
    return {
        'value': latest_update.value,
        'numerator': latest_update.numerator,
        'denominator': latest_update.denominator,
        'disaggregations': disaggregations,
    }
