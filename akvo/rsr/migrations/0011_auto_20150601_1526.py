# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0010_auto_20150601_1307'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budgetitem',
            name='amount',
            field=models.DecimalField(default=0, verbose_name='amount', max_digits=10, decimal_places=2),
            preserve_default=True,
        ),
    ]
