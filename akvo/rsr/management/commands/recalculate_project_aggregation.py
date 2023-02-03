from django.core.management.base import BaseCommand
from django.db.models import Count, Q

from akvo.rsr.models import Project, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.models.result.utils import QUANTITATIVE
from akvo.rsr.usecases.jobs.aggregation import schedule_aggregation_job


class Command(BaseCommand):
    help = 'Script for recalculating periods aggregation of a project. By default will only apply to periods that have approved updates.'

    def add_arguments(self, parser):
        parser.add_argument('--all', action='store_true', help="Apply to all periods including periods with no approved updates")
        parser.add_argument('--quantitative', action='store_true', help="Apply to quantitative indicator periods only. Will be ignored if --all is used")
        parser.add_argument('project_id', type=int)

    def handle(self, *args, **options):
        try:
            project = Project.objects.get(id=options['project_id'])
        except Project.DoesNotExist:
            print("Project not found")
            return

        descendants = project.descendants()
        periods = IndicatorPeriod.objects.filter(indicator__result__project__in=descendants)
        if not options.get("all"):
            periods = periods.annotate(
                approved_count=Count('data', filter=Q(data__status=IndicatorPeriodData.STATUS_APPROVED_CODE))
            ).filter(approved_count__gte=1)
            if options.get("quantitative"):
                periods = periods.filter(indicator__type=QUANTITATIVE)

        jobs = set()
        for period in periods:
            new_jobs = schedule_aggregation_job(period)
            jobs = jobs.union(set(new_jobs))

        print(f"Scheduled period aggregation jobs: {len(jobs)}, on root project: {project.title}")
