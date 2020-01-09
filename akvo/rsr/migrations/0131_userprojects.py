# -*- coding: utf-8 -*-


from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0130_indicatorperiod_narrative'),
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
