# -*- coding: utf-8 -*-


from django.db import models, migrations
import sorl.thumbnail.fields
import akvo.rsr.models.result.utils


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0123_periodactualvalue_perioddisaggregation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='file',
            field=models.FileField(upload_to=akvo.rsr.models.result.utils.file_path, max_length=255, verbose_name='file', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indicatorperioddata',
            name='photo',
            field=sorl.thumbnail.fields.ImageField(upload_to=akvo.rsr.models.result.utils.image_path, max_length=255, verbose_name='photo', blank=True),
            preserve_default=True,
        ),
    ]
