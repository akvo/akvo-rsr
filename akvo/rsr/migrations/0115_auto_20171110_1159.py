# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0114_auto_20171110_1158'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='indicator',
            unique_together=set([('result', 'parent_indicator')]),
        ),
        migrations.AlterUniqueTogether(
            name='indicatorperiod',
            unique_together=set([('indicator', 'parent_period')]),
        ),
        migrations.AlterUniqueTogether(
            name='result',
            unique_together=set([('project', 'parent_result')]),
        ),
    ]
