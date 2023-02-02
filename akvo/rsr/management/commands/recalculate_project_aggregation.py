from django.core.management.base import BaseCommand
from django.db.models import Count, Q

from akvo.rsr.models import Project, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.usecases.jobs.aggregation import schedule_aggregation_job


class Command(BaseCommand):
    help = 'Script for recalculating periods aggregation of a project'

    def add_arguments(self, parser):
        parser.add_argument('--no-filter', action='store_true')
        parser.add_argument('project_id', type=int)

    def handle(self, *args, **options):
        try:
            project = Project.objects.get(id=options['project_id'])
        except Project.DoesNotExist:
            print("Project not found")
            return

        descendants = project.descendants()
        periods = IndicatorPeriod.objects.filter(indicator__result__project__in=descendants)
        if options.get("no_filter") is None:
            periods = periods.annotate(
                approved_count=Count('data', filter=Q(data__status=IndicatorPeriodData.STATUS_APPROVED_CODE))
            ).filter(approved_count__gte=1)

        for period in periods:
            schedule_aggregation_job(period)

        print(f"Scheduled period aggregation jobs: {periods.count()}, on project: {project.title}")
