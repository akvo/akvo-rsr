# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0126_auto_20180320_1252'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPermissionedProjects',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('projects', models.ManyToManyField(related_name='permitted_users', to='rsr.Project')),
                ('user', models.OneToOneField(related_name='permitted_projects', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
