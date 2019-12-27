# -*- coding: utf-8 -*-


from django.db import models, migrations
import sorl.thumbnail.fields
import akvo.rsr.models.keyword
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0009_auto_20150528_1413'),
    ]

    operations = [
        migrations.AddField(
            model_name='keyword',
            name='logo',
            field=sorl.thumbnail.fields.ImageField(help_text='Add your keyword logo here. You can only add one logo. The logo will be shown on the project page, but not on Akvo Pages.<br/>The logo should be about 1 MB in size, and should preferably be 75x75 pixels and in PNG or JPG format.', upload_to=akvo.rsr.models.keyword.logo_path, verbose_name='logo', blank=True),
            preserve_default=True,
        ),
    ]
