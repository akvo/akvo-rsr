# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0128_auto_20180711_0624'),
    ]

    operations = [
        migrations.AlterField(
            model_name='iatiexport',
            name='version',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'2.03', max_length=4, verbose_name='version'),
            preserve_default=True,
        ),
    ]
