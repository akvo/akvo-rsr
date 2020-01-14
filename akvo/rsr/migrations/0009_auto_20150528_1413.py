# -*- coding: utf-8 -*-


from django.db import models, migrations


def set_organisation_reporting_status(apps, schema_editor):
    """Make sure organisation that is reporting is enabled as such."""
    Project = apps.get_model('rsr', 'Project')
    for project in Project.objects.all():
        if project.sync_owner:
            owner = project.sync_owner
            owner.can_become_reporting = True
            owner.save()


class Migration(migrations.Migration):
    """."""

    dependencies = [
        ('rsr', '0008_organisation_can_become_reporting'),
    ]

    operations = [
        migrations.RunPython(set_organisation_reporting_status)
    ]
