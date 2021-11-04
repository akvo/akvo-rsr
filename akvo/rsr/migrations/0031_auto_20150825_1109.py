# -*- coding: utf-8 -*-


import django.db.models.deletion
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0030_remove_partnership_partner_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnership',
            name='organisation',
            field=models.ForeignKey(related_name='partnerships', blank=False, to='rsr.Organisation', help_text='Select an organisation that is taking an active role in the project.', null=True, on_delete=django.db.models.deletion.SET_NULL, verbose_name='organisation'),
            preserve_default=True,
        ),
    ]
