# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0134_loginlog'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisation',
            name='include_restricted',
            field=models.BooleanField(default=True, help_text='Restricted users automatically get access to new projects of this organisation', verbose_name='Include restricted users'),
            preserve_default=True,
        ),
    ]
