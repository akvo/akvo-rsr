# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0127_userprojects'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprojects',
            name='is_restricted',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
