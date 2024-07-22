# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0080_auto_20160707_1204'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='default_periods',
            field=models.BooleanField(default=False, blank=True, null=True, help_text='Determines whether periods of indicator are used by default.', verbose_name='default indicator periods'),
            preserve_default=True,
        ),
    ]
