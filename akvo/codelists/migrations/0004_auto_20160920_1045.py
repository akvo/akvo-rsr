# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('codelists', '0003_auto_20160226_1131'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='country',
            options={'ordering': ('-version', 'name', 'code'), 'verbose_name': 'country', 'verbose_name_plural': 'countries'},
        ),
    ]
