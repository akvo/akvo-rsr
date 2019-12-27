# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0101_auto_20170720_1420'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='indicatorperioddata',
            name='relative_data',
        ),
    ]
