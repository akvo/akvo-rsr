# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0122_auto_20180112_1454'),
    ]

    operations = [
        migrations.CreateModel(
            name='PeriodActualValue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('measure', models.CharField(max_length=1)),
                ('value', models.IntegerField()),
                ('numerator', models.IntegerField()),
                ('denominator', models.IntegerField()),
            ],
            options={
                'db_table': 'rsr_indicator_period_actual_value',
                'managed': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PeriodDisaggregation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dimension_name', models.CharField(max_length=100)),
                ('dimension_value', models.CharField(max_length=100)),
                ('value', models.IntegerField()),
                ('numerator', models.IntegerField()),
                ('denominator', models.IntegerField()),
            ],
            options={
                'db_table': 'rsr_indicator_period_disaggregation',
                'managed': False,
            },
            bases=(models.Model,),
        ),
    ]
