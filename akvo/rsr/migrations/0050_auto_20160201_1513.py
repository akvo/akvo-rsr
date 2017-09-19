# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields
import akvo.rsr.fields
from django.conf import settings
from akvo.rsr.models.result.utils import file_path, image_path


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0049_auto_20160128_1605'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndicatorPeriodData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(db_index=True, auto_now_add=True, null=True)),
                ('last_modified_at', models.DateTimeField(db_index=True, auto_now=True, null=True)),
                ('relative_data', models.BooleanField(default=False, verbose_name='relative data')),
                ('data', akvo.rsr.fields.ValidXMLCharField(max_length=300, verbose_name='data')),
                ('status', akvo.rsr.fields.ValidXMLCharField(default=b'D', choices=[(b'D', 'draft'), (b'P', 'pending approval'), (b'R', 'return for revision'), (b'A', 'approved')], max_length=1, blank=True, verbose_name='status', db_index=True)),
                ('text', akvo.rsr.fields.ValidXMLTextField(verbose_name='text', blank=True)),
                ('photo', sorl.thumbnail.fields.ImageField(upload_to=image_path, verbose_name='photo', blank=True)),
                ('file', models.FileField(upload_to=file_path, verbose_name='file', blank=True)),
                ('update_method', akvo.rsr.fields.ValidXMLCharField(default=b'W', choices=[(b'W', 'web'), (b'M', 'mobile')], max_length=1, blank=True, verbose_name='update method', db_index=True)),
                ('period', models.ForeignKey(related_name='data', verbose_name='indicator period', to='rsr.IndicatorPeriod')),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'indicator period data',
                'verbose_name_plural': 'indicator period data',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='IndicatorPeriodDataComment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(db_index=True, auto_now_add=True, null=True)),
                ('last_modified_at', models.DateTimeField(db_index=True, auto_now=True, null=True)),
                ('comment', akvo.rsr.fields.ValidXMLTextField(verbose_name='comment', blank=True)),
                ('data', models.ForeignKey(related_name='comments', verbose_name='indicator period data', to='rsr.IndicatorPeriodData')),
                ('user', models.ForeignKey(verbose_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'indicator period data comment',
                'verbose_name_plural': 'indicator period data comments',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='indicatorperiod',
            name='locked',
            field=models.BooleanField(default=True, db_index=True, verbose_name='locked'),
            preserve_default=True,
        ),
    ]
