# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0105_indicatordimension'),
    ]

    operations = [
        migrations.CreateModel(
            name='Disaggregation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(db_index=True, auto_now_add=True, null=True)),
                ('last_modified_at', models.DateTimeField(db_index=True, auto_now=True, null=True)),
                ('value', models.DecimalField(null=True, verbose_name='quantitative disaggregated value', max_digits=20, decimal_places=2, blank=True)),
                ('narrative', akvo.rsr.fields.ValidXMLTextField(verbose_name='qualitative narrative', blank=True)),
                ('numerator', models.DecimalField(decimal_places=2, max_digits=20, blank=True, help_text='The numerator for a percentage value', null=True, verbose_name='numerator for indicator')),
                ('denominator', models.DecimalField(decimal_places=2, max_digits=20, blank=True, help_text='The denominator for a percentage value', null=True, verbose_name='denominator for indicator')),
                ('dimension', models.ForeignKey(to='rsr.IndicatorDimension')),
                ('update', models.ForeignKey(related_name='disaggregations', verbose_name='indicator period update', to='rsr.IndicatorPeriodData')),
            ],
            options={
                'verbose_name': 'disaggregated value',
                'verbose_name_plural': 'disaggregated values',
            },
            bases=(models.Model,),
        ),
    ]
