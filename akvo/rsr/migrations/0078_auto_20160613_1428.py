# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0077_auto_20160608_1227'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='order',
            field=models.PositiveSmallIntegerField(null=True, verbose_name='indicator order', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='result',
            name='order',
            field=models.PositiveSmallIntegerField(null=True, verbose_name='result order', blank=True),
            preserve_default=True,
        ),
    ]
