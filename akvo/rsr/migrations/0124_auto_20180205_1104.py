# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0123_periodactualvalue_perioddisaggregation'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndicatorDimensionName',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', akvo.rsr.fields.ValidXMLCharField(help_text='The name of a category to be used when disaggregating (e.g "Age").', max_length=100, verbose_name='dimension name')),
                ('project', models.ForeignKey(related_name='dimension_names', verbose_name='project', to='rsr.Project')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'indicator dimension name',
                'verbose_name_plural': 'indicator dimension names',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='IndicatorDimensionValue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', akvo.rsr.fields.ValidXMLCharField(help_text='A value in the category being disaggregated (e.g. "Older than 60 years").', max_length=100, verbose_name='dimension value')),
                ('name', models.ForeignKey(related_name='dimension_values', verbose_name='dimension name', to='rsr.IndicatorDimensionName')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'indicator dimension value',
                'verbose_name_plural': 'indicator dimension values',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='indicator',
            name='dimension_names',
            field=models.ManyToManyField(related_name='indicators', to='rsr.IndicatorDimensionName'),
            preserve_default=True,
        ),
    ]
