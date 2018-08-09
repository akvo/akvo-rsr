# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0133_auto_20180719_1952'),
    ]

    operations = [
        migrations.CreateModel(
            name='RestrictedUserProjectsByOrg',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_restricted', models.BooleanField(default=False)),
                ('organisation', models.ForeignKey(related_name='restricted_users', to='rsr.Organisation')),
                ('restricted_projects', models.ManyToManyField(related_name='inaccessible_by', null=True, to='rsr.Project', blank=True)),
                ('user', models.ForeignKey(related_name='restricted_projects', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'restricted user projects',
                'verbose_name_plural': 'restricted users projects',
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='restricteduserprojectsbyorg',
            unique_together=set([('user', 'organisation')]),
        ),
    ]
