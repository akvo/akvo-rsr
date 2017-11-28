# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def delete_duplicate_instances(apps, schema_editor):
    duplicate_id = 19656
    Indicator = apps.get_model('rsr', 'Indicator')
    Indicator.objects.filter(id__in=[duplicate_id]).delete()

    dummy_project_id = 5701
    Result = apps.get_model('rsr', 'Result')
    Result.objects.filter(project__id=dummy_project_id).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0113_auto_20171116_0804'),
    ]

    operations = [
        migrations.RunPython(
            delete_duplicate_instances,
            reverse_code=lambda x, y: None
        ),
    ]
