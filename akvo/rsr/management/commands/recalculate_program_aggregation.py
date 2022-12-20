from django.core.management.base import BaseCommand
from django.db.models import Count, Q

from akvo.rsr.models import ProjectHierarchy, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.usecases.jobs.aggregation import schedule_aggregation_job


class Command(BaseCommand):
    help = 'Script for recalculating periods aggregation of a program'

    def add_arguments(self, parser):
        parser.add_argument('program_id', type=int)

    def handle(self, *args, **options):
        try:
            hierarchy = ProjectHierarchy.objects.get(root_project=options['program_id'])
            program = hierarchy.root_project
        except ProjectHierarchy.DoesNotExist:
            print("Program not found")
            return

        descendants = program.descendants()
        periods = IndicatorPeriod.objects\
            .annotate(approved_count=Count('data', filter=Q(data__status=IndicatorPeriodData.STATUS_APPROVED_CODE)))\
            .filter(approved_count__gte=1, indicator__result__project__in=descendants)

        for period in periods:
            schedule_aggregation_job(period)

        print(f"Scheduled period aggregation jobs: {periods.count()}, on program: {program.title}")
