# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0020_auto_20150731_1312'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisationcustomfield',
            name='mandatory',
            field=models.BooleanField(default=False, help_text='Indicate whether this field is mandatory or not', verbose_name='mandatory'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='projectcustomfield',
            name='mandatory',
            field=models.BooleanField(default=False, help_text='Indicate whether this field is mandatory or not', verbose_name='mandatory'),
            preserve_default=True,
        ),
    ]
