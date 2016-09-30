# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0083_auto_20160816_0950'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projecteditorvalidation',
            name='action',
            field=models.PositiveSmallIntegerField(db_index=True, verbose_name='action', choices=[(1, 'Mandatory'), (2, 'Hidden')]),
            preserve_default=True,
        ),
    ]
