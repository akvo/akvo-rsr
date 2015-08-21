# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0022_auto_20150819_0908'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budgetitem',
            name='amount',
            field=models.DecimalField(null=True, verbose_name='amount', max_digits=10, decimal_places=2, blank=True),
            preserve_default=True,
        ),
    ]
