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
            field=models.BooleanField(default=True, help_text='By selecting this option, the results data of child projects will be aggregated to this project. In the child project(s), this can be turned off per project as well.', verbose_name='Aggregate results data from child projects'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='project',
            name='aggregate_to_parent',
            field=models.BooleanField(default=True, help_text='By selecting this option, the results data of this project will be aggregated to the parent project.', verbose_name='Aggregate results data to parent project'),
            preserve_default=True,
        ),
    ]
