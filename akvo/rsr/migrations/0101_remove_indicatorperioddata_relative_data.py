# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0100_auto_20170531_1047'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='indicatorperioddata',
            name='relative_data',
        ),
    ]
