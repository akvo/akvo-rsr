# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0084_auto_20160920_1045'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='donate_button',
        ),
        migrations.AddField(
            model_name='project',
            name='donate_url',
            field=models.URLField(help_text='Add a donation url for this project. If no URL is added, it is not possible to donate to this project through RSR.', null=True, verbose_name='donate url', blank=True),
            preserve_default=True,
        ),
    ]
