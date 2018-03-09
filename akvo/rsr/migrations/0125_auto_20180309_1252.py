# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0124_auto_20180205_1104'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dimension',
            name='name',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The name of a category to be used when disaggregating (e.g "Age").', max_length=100, verbose_name='dimension name'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='dimensionvalue',
            name='dimension',
            field=models.ForeignKey(related_name='dimension_values', verbose_name='dimension', to='rsr.Dimension'),
            preserve_default=True,
        ),
    ]
