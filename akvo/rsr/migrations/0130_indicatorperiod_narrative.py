# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0129_auto_20180710_1549'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicatorperiod',
            name='narrative',
            field=akvo.rsr.fields.ValidXMLTextField(verbose_name='qualitative indicator narrative', blank=True),
            preserve_default=True,
        ),
    ]
