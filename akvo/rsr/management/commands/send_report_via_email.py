from django.core.management.base import BaseCommand
from akvo.rsr.views.py_reports.email_report import run_job


class Command(BaseCommand):

    def handle(self, *args, **options):
        run_job()
