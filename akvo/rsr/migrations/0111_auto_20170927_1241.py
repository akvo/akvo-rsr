# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0110_auto_20170922_1234'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='organisationindicatorlabel',
            options={'ordering': ('organisation', 'label'), 'verbose_name': 'organisation indicator label', 'verbose_name_plural': 'organisation indicator labels'},
        ),
    ]
