# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0127_userpermissionedprojects'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='userpermissionedprojects',
            options={'ordering': ['user_id'], 'verbose_name': 'user permissioned projects', 'verbose_name_plural': 'user permissioned projects'},
        ),
    ]
