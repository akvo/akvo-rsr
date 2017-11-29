# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0115_auto_20171110_1159'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisationlocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisationlocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectlocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdatelocation',
            name='latitude',
            field=akvo.rsr.fields.LatitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='latitude', db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdatelocation',
            name='longitude',
            field=akvo.rsr.fields.LongitudeField(default=None, blank=True, help_text='Use a period to denote decimals.', null=True, verbose_name='longitude', db_index=True),
            preserve_default=True,
        ),
    ]
