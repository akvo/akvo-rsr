from django.db import migrations
from django.utils import timezone


def make_timezone_aware_created_at(apps, schema):
    Project = apps.get_model("rsr", "Project")
    projects = []
    for project in Project.objects.all():
        project.created_at = timezone.make_aware(project.created_at)
    Project.objects.bulk_update(projects, ["created_at"])


class Migration(migrations.Migration):
    dependencies = [
        ('rsr', '0219_iatiactivityvalidationjob_iatiorganisationvalidationjob'),
    ]

    operations = [
        migrations.RunPython(make_timezone_aware_created_at)
    ]
