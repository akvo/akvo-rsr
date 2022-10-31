from django.core.management.base import BaseCommand
from akvo.rsr.usecases import period_update_aggregation as aggregation
from django.db.models import Q
from akvo.rsr.models import ProjectHierarchy, IndicatorPeriod
from akvo.rsr.models.result.utils import QUANTITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.utils import ensure_decimal


def audit_period_aggregation(period):
    count = 0
    value, numerator, denominator = aggregation.sum_updates(period)
    if period.indicator.measure == PERCENTAGE_MEASURE:
        contrib_numerator, contrib_denominator = aggregation.sum_contributed_percentage_value(period)
        numerator = ensure_decimal(numerator) + ensure_decimal(contrib_numerator)
        denominator = ensure_decimal(denominator) + ensure_decimal(contrib_denominator)
        value = calculate_percentage(numerator, denominator)
    else:
        value = ensure_decimal(value) + aggregation.sum_contributed_unit_value(period)

    try:
        assert ensure_decimal(period.actual_value) == value
    except AssertionError as e:
        print('AssertionError', period.actual_value, value, period.id, str(period), period.indicator.result.project.id, str(period.indicator.result.project))
    count += 1

    for child_period in period.child_periods.all():
        count += audit_period_aggregation(child_period)

    return count


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('program_id', type=int)

    def handle(self, *args, **options):
        try:
            hierarchy = ProjectHierarchy.objects.get(root_project=options['program_id'])
            program = hierarchy.root_project
        except ProjectHierarchy.DoesNotExist:
            print("Program not found")
            return

        running_quantitative_periods = IndicatorPeriod.objects\
            .filter(indicator__result__project=program, indicator__type=QUANTITATIVE)\
            .exclude(Q(actual_value__isnull=True) | Q(actual_value__exact=''))

        count = 0
        for period in running_quantitative_periods:
            count += audit_period_aggregation(period)
        print(f"{count} periods audited.")
