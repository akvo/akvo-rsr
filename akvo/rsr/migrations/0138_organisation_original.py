# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0137_auto_20180831_1038'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisation',
            name='original',
            field=models.OneToOneField(related_name='shadow', null=True, on_delete=django.db.models.deletion.SET_NULL, blank=True, to='rsr.Organisation', help_text='Pointer to original organisation if this is a shadow. Used by EUTF'),
            preserve_default=True,
        ),
    ]
