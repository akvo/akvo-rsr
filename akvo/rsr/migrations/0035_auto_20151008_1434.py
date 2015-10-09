# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0034_auto_20150916_1402'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectupdate',
            name='indicator_period',
            field=models.ForeignKey(related_name='updates', verbose_name='indicator period', blank=True, to='rsr.IndicatorPeriod', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectupdate',
            name='period_update',
            field=models.DecimalField(null=True, verbose_name='period update', max_digits=14, decimal_places=2, blank=True),
            preserve_default=True,
        ),
    ]
