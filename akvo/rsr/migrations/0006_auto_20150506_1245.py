# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0005_auto_20150423_1429'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicator',
            name='baseline_comment',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='You can further define the baseline here. (2000 characters)', max_length=2000, verbose_name='baseline comment', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicator',
            name='description',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='You can further define the indicator here. (2000 characters)', max_length=2000, verbose_name='description', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperiod',
            name='actual_comment',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='You can comment on the actual value here. (2000 characters)', max_length=2000, verbose_name='actual comment', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperiod',
            name='target_comment',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='You can comment on the target value here. (2000 characters)', max_length=2000, verbose_name='target comment', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='result',
            name='description',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='You can provide further information of the result here. (2000 characters)', max_length=2000, verbose_name='description', blank=True),
            preserve_default=True,
        ),
    ]
