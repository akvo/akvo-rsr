from django.core.management import BaseCommand

from akvo.rsr.models import Project
from akvo.rsr.models.project import update_thumbnails


class Command(BaseCommand):
    help = "Make sure the thumbnail URLs for all project images exist"

    def handle(self, *args, **options):
        for project in Project.objects.all():
            update_thumbnails(None, instance=project, created=False)
