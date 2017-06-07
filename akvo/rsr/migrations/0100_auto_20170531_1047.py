# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0099_report_organisations'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='data',
            field=akvo.rsr.fields.ValidXMLCharField(max_length=300, null=True, verbose_name='data', blank=True),
            preserve_default=True,
        ),
    ]
