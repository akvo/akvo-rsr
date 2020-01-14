# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0035_auto_20151002_1511'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='indicatorperiod',
            options={'ordering': ['period_start'], 'verbose_name': 'indicator period', 'verbose_name_plural': 'indicator periods'},
        ),
        migrations.AddField(
            model_name='project',
            name='is_impact_project',
            field=models.BooleanField(default=False, help_text='Determines whether this project is an RSR Impact project.', verbose_name='is rsr impact project'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectupdate',
            name='indicator_period',
            field=models.ForeignKey(related_name='updates', verbose_name='indicator period', blank=True, to='rsr.IndicatorPeriod', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectupdate',
            name='period_update',
            field=models.DecimalField(null=True, verbose_name='period update', max_digits=14, decimal_places=2, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='result',
            name='parent_result',
            field=models.ForeignKey(related_name='child_results', default=None, blank=True, to='rsr.Result', help_text='The parent result of this result.', null=True),
            preserve_default=True,
        ),
    ]
