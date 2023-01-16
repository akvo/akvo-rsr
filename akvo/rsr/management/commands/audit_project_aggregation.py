from django.core.management.base import BaseCommand
from akvo.rsr.models import Project
from akvo.rsr.usecases.audit_project_aggregation import audit_project_aggregation


class Command(BaseCommand):
    help = 'Script to ensure that the project aggregation is correct'

    def add_arguments(self, parser):
        parser.add_argument('project_id', type=int)

    def handle(self, *args, **options):
        try:
            project = Project.objects.get(id=options['project_id'])
        except Project.DoesNotExist:
            print("Project not found")
            return
        audit_project_aggregation(project)
