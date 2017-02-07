# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0088_auto_20161116_1214'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='parent_indicator',
            field=models.ForeignKey(related_name='child_indicators', default=None, blank=True, to='rsr.Indicator', null=True, verbose_name='parent indicator'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicatorperiod',
            name='parent_period',
            field=models.ForeignKey(related_name='child_periods', default=None, blank=True, to='rsr.IndicatorPeriod', null=True, verbose_name='parent indicator period'),
            preserve_default=True,
        ),
    ]
