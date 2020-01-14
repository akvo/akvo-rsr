# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0111_auto_20170927_1241'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='indicatorperioddata',
            options={'ordering': ('-id',), 'verbose_name': 'indicator period data', 'verbose_name_plural': 'indicator period data'},
        ),
        migrations.AlterModelOptions(
            name='indicatorperioddatacomment',
            options={'ordering': ('-id',), 'verbose_name': 'indicator period data comment', 'verbose_name_plural': 'indicator period data comments'},
        ),
    ]
