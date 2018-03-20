# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0125_auto_20180315_0829'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='report',
            options={'ordering': ('name',)},
        ),
    ]
