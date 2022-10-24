from django.core.management.base import BaseCommand
from akvo.rsr.usecases.jobs.aggregation import execute_aggregation_jobs


class Command(BaseCommand):
    help = "Run indicator period aggregation jobs."

    def handle(self, *args, **options):
        execute_aggregation_jobs()
