# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0133_auto_20180719_1952'),
    ]

    operations = [
        migrations.CreateModel(
            name='LoginLog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(db_index=True, auto_now_add=True, null=True)),
                ('last_modified_at', models.DateTimeField(db_index=True, auto_now=True, null=True)),
                ('success', models.BooleanField(default=True, help_text='Log whether the login attempt was successful or not.', verbose_name='login successful')),
                ('email', models.EmailField(max_length=75, verbose_name='user email')),
            ],
            options={
                'abstract': False,
                'ordering': ('-created_at',)
            },
            bases=(models.Model,),
        ),
    ]
