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
            name='approved',
            field=models.BooleanField(default=False, verbose_name='approved'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectupdate',
            name='change',
            field=models.IntegerField(null=True, verbose_name='change', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectupdate',
            name='period',
            field=models.ForeignKey(related_name='period_updates', verbose_name='indicator period', blank=True, to='rsr.IndicatorPeriod', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectupdate',
            name='processed',
            field=models.BooleanField(default=False, verbose_name='processed'),
            preserve_default=True,
        ),
    ]
