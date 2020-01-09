# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0126_auto_20180320_1252'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='url',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Enter the parametrized path for downloading the report. NOTE: one line only even if the input field allows for more!', max_length=200, verbose_name='url'),
            preserve_default=True,
        ),
    ]
