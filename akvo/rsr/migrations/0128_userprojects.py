# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0127_auto_20180529_0955'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProjects',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_restricted', models.BooleanField(default=False)),
                ('projects', models.ManyToManyField(related_name='accessible_by', null=True, to='rsr.Project', blank=True)),
                ('user', models.OneToOneField(related_name='user_projects', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('user_id',),
                'verbose_name': 'user projects',
                'verbose_name_plural': 'users projects',
            },
            bases=(models.Model,),
        ),
    ]
