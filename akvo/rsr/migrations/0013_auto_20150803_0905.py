# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0012_partnersite_show_keyword_logos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projectupdate',
            name='photo_credit',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='75 characters', max_length=75, verbose_name='photo credit', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='projectupdate',
            name='video_credit',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='75 characters', max_length=75, verbose_name='video credit', blank=True),
            preserve_default=True,
        ),
    ]
