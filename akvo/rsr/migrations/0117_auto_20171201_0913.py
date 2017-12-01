# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def indicator_dimensions_cleanup(apps, schema_editor):
    IndicatorDimension = apps.get_model('rsr', 'indicatordimension')
    for dimension in IndicatorDimension.objects.all():
        dimension.name = dimension.name.strip()
        dimension.value = dimension.value.strip()
        dimension.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0116_auto_20171129_0731'),
    ]

    operations = [
        migrations.RunPython(indicator_dimensions_cleanup,
                             lambda x, y: None)
    ]
