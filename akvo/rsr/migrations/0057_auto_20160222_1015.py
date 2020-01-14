# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0056_auto_20160219_1007'),
    ]

    operations = [
        migrations.AlterField(
            model_name='iatiimport',
            name='enabled',
            field=models.BooleanField(default=False, help_text=b'Set to enable running of this import.', verbose_name='importing enabled'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='iatiimport',
            name='frequency',
            field=models.PositiveIntegerField(blank=True, help_text=b'Set the frequency interval of the import', null=True, choices=[(1, 'hourly'), (2, 'every six hours'), (3, 'daily'), (4, 'every three days'), (5, 'weekly'), (6, 'bi-weekly'), (7, 'every four weeks'), (8, 'every two minutes')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='iatiimport',
            name='run_immediately',
            field=models.BooleanField(default=False, help_text=b'Run the job immediately.', verbose_name='run immediately'),
            preserve_default=True,
        ),
    ]
