# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0021_auto_20150813_1426'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='organisation',
            name='partner_types',
        ),
        migrations.DeleteModel(
            name='PartnerType',
        ),
    ]
