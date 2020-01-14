# -*- coding: utf-8 -*-


from django.db import models, migrations


def activate_results_framework(apps, schema_editor):
    """
    Activate the results framework for all projects.
    """
    Project = apps.get_model('rsr', 'Project')

    for project in Project.objects.all():
        project.is_impact_project = True
        project.save(update_fields=['is_impact_project'])


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0065_auto_20160329_1041'),
    ]

    operations = [
        migrations.RunPython(activate_results_framework),
    ]
