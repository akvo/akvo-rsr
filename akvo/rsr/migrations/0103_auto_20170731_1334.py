# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0102_remove_indicatorperioddata_relative_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='type',
            field=models.PositiveSmallIntegerField(default=1, verbose_name='indicator type', choices=[(1, 'Quantitative'), (2, 'Qualitative')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicatorperioddata',
            name='narrative',
            field=akvo.rsr.fields.ValidXMLTextField(verbose_name='qualitative indicator narrative', blank=True),
            preserve_default=True,
        ),
        migrations.RenameField('indicatorperioddata', 'data', 'value'),
        migrations.AlterField(
            model_name='indicator',
            name='baseline_value',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='The value of the baseline at the start of the project.', max_length=200, verbose_name='baseline value', blank=True),
            preserve_default=True,
        ),
    ]
