# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0106_disaggregation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicatorlabel',
            name='label',
            field=models.ForeignKey(related_name='indicators', on_delete=django.db.models.deletion.PROTECT, verbose_name='label', to='rsr.OrganisationIndicatorLabel'),
            preserve_default=True,
        ),
    ]
