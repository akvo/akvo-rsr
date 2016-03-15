# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0059_auto_20160226_1631'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectdocument',
            name='category',
        ),
    ]
