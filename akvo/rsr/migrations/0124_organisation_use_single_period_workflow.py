# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

EUTF_ID = 3394


def eutf_uses_single_period(apps, schema_editor):
    Organisation = apps.get_model('rsr', 'Organisation')
    try:
        EUTF = Organisation.objects.get(id=EUTF_ID)
    except Organisation.DoesNotExist:
        print('Could not find EUTF organisation')
    else:
        EUTF.use_single_period_workflow = True
        EUTF.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0123_periodactualvalue_perioddisaggregation'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisation',
            name='use_single_period_workflow',
            field=models.BooleanField(default=False, help_text='Enable if the Organisation uses a single indicator period for the entire project,and makes updates on it.'),
            preserve_default=True,
        ),
        migrations.RunPython(eutf_uses_single_period, lambda x, y: None)
    ]
