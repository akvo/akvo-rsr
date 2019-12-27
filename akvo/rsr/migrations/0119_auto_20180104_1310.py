# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0118_auto_20171206_1518'),
    ]

    operations = [
        migrations.AlterField(
            model_name='narrativereport',
            name='published',
            field=models.BooleanField(default=False, verbose_name='published'),
            preserve_default=True,
        ),
    ]
