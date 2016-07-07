# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0079_auto_20160620_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='aggregate_children',
            field=models.BooleanField(default=True, help_text='Should project aggregate the results of child projects.', verbose_name='aggregate child results'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='project',
            name='aggregate_to_parent',
            field=models.BooleanField(default=True, help_text='Should projects results be aggregated to parent project.', verbose_name='aggregate results in parent'),
            preserve_default=True,
        ),
    ]
