# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0087_auto_20161110_0920'),
    ]

    operations = [
        migrations.AlterField(
            model_name='iatiimport',
            name='mapper_prefix',
            field=models.CharField(blank=True, help_text=b'Choose a custom mapper to invoke custom behaviour for this import', max_length=30, verbose_name='Custom mappers', choices=[(b'Cordaid', b'Cordaid'), (b'CordaidZip', b'CordaidZip'), (b'ICCO', b'ICCO'), (b'Result_only', b'Result_only')]),
            preserve_default=True,
        ),
    ]
