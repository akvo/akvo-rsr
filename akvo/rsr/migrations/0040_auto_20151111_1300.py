# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models, migrations

from ..models.project import Project

def add_primary_organisations(apps, schema_editor):

    for project in Project.objects.all():
        project.primary_organisation = project.find_primary_organisation()
        project.save(update_fields=['primary_organisation'])


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0039_auto_20151111_1246'),
    ]

    operations = [
        migrations.RunPython(
            add_primary_organisations,
        ),
    ]
