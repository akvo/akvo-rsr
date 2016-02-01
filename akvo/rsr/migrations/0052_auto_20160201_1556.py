# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0051_auto_20160201_1534'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectupdate',
            name='indicator_period',
        ),
        migrations.RemoveField(
            model_name='projectupdate',
            name='period_update',
        ),
    ]
